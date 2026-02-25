/**
 * Moteur de calcul financier — Jevalis
 * Simulations d'impact financier immobilier pour France, Suisse, Belgique, Luxembourg
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SimulationInput {
  country: string;
  canton?: string;
  city: string;
  operationType: string;
  purchasePrice?: number;
  salePrice?: number;
  acquisitionDate?: string;
  renovationCost?: number;
  loanAmount?: number;
  loanRate?: number;
  loanDuration?: number;
}

export interface NotaryFeesBreakdown {
  total: number;
  effectiveRate: number;
  registrationTax: number;
  notaryEmoluments: number;
  disbursements: number;
  miscFees: number;
}

export interface CapitalGainBreakdown {
  grossGain: number;
  deductibleExpenses: number;
  netGain: number;
  holdingPeriodYears: number;
  incomeTaxAllowancePercent: number;
  socialTaxAllowancePercent: number;
  taxableGainIncomeTax: number;
  taxableGainSocialTax: number;
  incomeTax: number;
  socialTax: number;
  surtax: number;
  totalTax: number;
  netProceeds: number;
}

export interface LoanBreakdown {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  totalRepaid: number;
}

export interface SimulationResult {
  country: string;
  countryLabel: string;
  city: string;
  operationType: string;
  notaryFees?: NotaryFeesBreakdown;
  capitalGain?: CapitalGainBreakdown;
  loan?: LoanBreakdown;
  totalInvestment?: number;
  summary: string;
  disclaimer: string;
}

// ─── Utilitaires ────────────────────────────────────────────────────────────

function yearsHeld(acquisitionDate: string): number {
  const acq = new Date(acquisitionDate);
  const now = new Date();
  const diff = now.getTime() - acq.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function formatEUR(n: number): string {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

function formatCHF(n: number): string {
  return n.toLocaleString("fr-CH", { style: "currency", currency: "CHF" });
}

// ─── FRANCE ─────────────────────────────────────────────────────────────────

/**
 * Barème des émoluments du notaire (France, 2025)
 * Source : service-public.fr / arrêté du 26 février 2016 modifié
 */
function computeFranceNotaryEmoluments(price: number): number {
  const tranches = [
    { limit: 6500, rate: 0.03870 },
    { limit: 17000, rate: 0.01596 },
    { limit: 60000, rate: 0.01064 },
    { limit: Infinity, rate: 0.00799 },
  ];

  let total = 0;
  let previous = 0;

  for (const tranche of tranches) {
    const current = Math.min(price, tranche.limit);
    if (current > previous) {
      total += (current - previous) * tranche.rate;
      previous = current;
    }
    if (price <= tranche.limit) break;
  }

  return round2(total);
}

function computeFranceNotaryFees(price: number): NotaryFeesBreakdown {
  const registrationTax = round2(price * 0.05807);
  const notaryEmoluments = computeFranceNotaryEmoluments(price);
  const disbursements = round2(price * 0.001);
  const miscFees = round2(400 + price * 0.001);
  const total = round2(registrationTax + notaryEmoluments + disbursements + miscFees);
  const effectiveRate = round2((total / price) * 100);

  return { total, effectiveRate, registrationTax, notaryEmoluments, disbursements, miscFees };
}

function computeFranceCapitalGain(
  salePrice: number,
  purchasePrice: number,
  acquisitionDate: string,
  renovationCost: number = 0
): CapitalGainBreakdown {
  const years = yearsHeld(acquisitionDate);
  const acquisitionCosts = round2(purchasePrice * 0.075);
  const deductibleExpenses = round2(acquisitionCosts + renovationCost);
  const grossGain = round2(salePrice - purchasePrice);
  const netGain = round2(grossGain - deductibleExpenses);

  // Abattements IR (par année de détention au-delà de la 5e)
  let incomeTaxAllowancePercent = 0;
  if (years >= 22) {
    incomeTaxAllowancePercent = 100;
  } else if (years > 5) {
    incomeTaxAllowancePercent = (years - 5) * 6;
  }

  // Abattements prélèvements sociaux
  let socialTaxAllowancePercent = 0;
  if (years >= 30) {
    socialTaxAllowancePercent = 100;
  } else if (years > 5) {
    if (years <= 21) {
      socialTaxAllowancePercent = (years - 5) * 1.65;
    } else {
      socialTaxAllowancePercent = 16 * 1.65 + (years - 21) * 1.60 + 9;
    }
  }

  const taxableGainIncomeTax = round2(Math.max(0, netGain * (1 - incomeTaxAllowancePercent / 100)));
  const taxableGainSocialTax = round2(Math.max(0, netGain * (1 - socialTaxAllowancePercent / 100)));

  const incomeTax = round2(taxableGainIncomeTax * 0.19);
  const socialTax = round2(taxableGainSocialTax * 0.172);

  // Surtaxe si plus-value nette > 50 000 €
  let surtax = 0;
  if (taxableGainIncomeTax > 260000) surtax = round2(taxableGainIncomeTax * 0.06);
  else if (taxableGainIncomeTax > 250000) surtax = round2(taxableGainIncomeTax * 0.05);
  else if (taxableGainIncomeTax > 200000) surtax = round2(taxableGainIncomeTax * 0.04);
  else if (taxableGainIncomeTax > 150000) surtax = round2(taxableGainIncomeTax * 0.03);
  else if (taxableGainIncomeTax > 100000) surtax = round2(taxableGainIncomeTax * 0.02);
  else if (taxableGainIncomeTax > 50000) surtax = round2(taxableGainIncomeTax * 0.02);

  const totalTax = round2(incomeTax + socialTax + surtax);
  const netProceeds = round2(salePrice - totalTax);

  return {
    grossGain,
    deductibleExpenses,
    netGain,
    holdingPeriodYears: years,
    incomeTaxAllowancePercent: round2(incomeTaxAllowancePercent),
    socialTaxAllowancePercent: round2(socialTaxAllowancePercent),
    taxableGainIncomeTax,
    taxableGainSocialTax,
    incomeTax,
    socialTax,
    surtax,
    totalTax,
    netProceeds,
  };
}

function computeLoan(amount: number, rate: number, duration: number): LoanBreakdown {
  const monthlyRate = rate / 100 / 12;
  const n = duration * 12;
  const monthlyPayment = round2(
    amount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  );
  const totalRepaid = round2(monthlyPayment * n);
  const totalInterest = round2(totalRepaid - amount);
  const totalCost = totalInterest;

  return { monthlyPayment, totalInterest, totalCost, totalRepaid };
}

// ─── SUISSE ─────────────────────────────────────────────────────────────────

function computeSwissNotaryFees(price: number, canton: string = "Genève"): NotaryFeesBreakdown {
  const cantonRates: Record<string, number> = {
    "Genève": 0.03, "Vaud": 0.033, "Zurich": 0.02, "Berne": 0.018,
    "Bâle-Ville": 0.025, "Bâle-Campagne": 0.02, "Lucerne": 0.015,
    "Saint-Gall": 0.015, "Argovie": 0.02, "Thurgovie": 0.015,
    "Tessin": 0.025, "Valais": 0.018, "Neuchâtel": 0.033,
    "Fribourg": 0.025, "Soleure": 0.022, "Schaffhouse": 0.02,
    "Zoug": 0.01, "Schwyz": 0.015, "Glaris": 0.015,
    "Appenzell": 0.015, "Grisons": 0.02, "Jura": 0.03,
    "Nidwald": 0.01, "Obwald": 0.012, "Uri": 0.012,
  };

  const rate = cantonRates[canton] || 0.025;
  const registrationTax = round2(price * rate);
  const notaryEmoluments = round2(price * 0.005);
  const disbursements = round2(price * 0.001);
  const miscFees = round2(500);
  const total = round2(registrationTax + notaryEmoluments + disbursements + miscFees);
  const effectiveRate = round2((total / price) * 100);

  return { total, effectiveRate, registrationTax, notaryEmoluments, disbursements, miscFees };
}

function computeSwissCapitalGain(
  salePrice: number,
  purchasePrice: number,
  acquisitionDate?: string,
  canton: string = "Genève"
): CapitalGainBreakdown {
  const years = acquisitionDate ? yearsHeld(acquisitionDate) : 0;
  const grossGain = round2(salePrice - purchasePrice);
  const deductibleExpenses = 0;
  const netGain = grossGain;

  const cantonRates: Record<string, number> = {
    "Genève": 0.08, "Vaud": 0.07, "Zurich": 0.06, "Berne": 0.05,
    "Bâle-Ville": 0.06, "Tessin": 0.08, "Valais": 0.06,
    "Neuchâtel": 0.06, "Fribourg": 0.05, "Zoug": 0.03, "Schwyz": 0.04,
  };

  let taxRate = cantonRates[canton] || 0.06;
  // Réduction selon durée de détention
  if (years > 25) taxRate *= 0.25;
  else if (years > 15) taxRate *= 0.50;
  else if (years > 10) taxRate *= 0.75;

  const totalTax = round2(Math.max(0, netGain) * taxRate);
  const netProceeds = round2(salePrice - totalTax);

  return {
    grossGain, deductibleExpenses, netGain, holdingPeriodYears: years,
    incomeTaxAllowancePercent: 0, socialTaxAllowancePercent: 0,
    taxableGainIncomeTax: netGain, taxableGainSocialTax: 0,
    incomeTax: totalTax, socialTax: 0, surtax: 0, totalTax, netProceeds,
  };
}

// ─── BELGIQUE ───────────────────────────────────────────────────────────────

function computeBelgiumNotaryFees(price: number): NotaryFeesBreakdown {
  const registrationTax = round2(price * 0.125);
  const notaryEmoluments = round2(price * 0.012);
  const disbursements = round2(price * 0.001);
  const miscFees = round2(800);
  const total = round2(registrationTax + notaryEmoluments + disbursements + miscFees);
  const effectiveRate = round2((total / price) * 100);

  return { total, effectiveRate, registrationTax, notaryEmoluments, disbursements, miscFees };
}

function computeBelgiumCapitalGain(
  salePrice: number,
  purchasePrice: number,
  acquisitionDate?: string
): CapitalGainBreakdown {
  const years = acquisitionDate ? yearsHeld(acquisitionDate) : 0;
  const grossGain = round2(salePrice - purchasePrice);
  const deductibleExpenses = 0;
  const netGain = grossGain;

  // Belgique : 16.5% si < 5 ans, 0% si > 5 ans (résidence principale exonérée)
  let taxRate = 0;
  if (years < 5) taxRate = 0.165;
  else if (years < 3) taxRate = 0.33;

  const totalTax = round2(Math.max(0, netGain) * taxRate);
  const netProceeds = round2(salePrice - totalTax);

  return {
    grossGain, deductibleExpenses, netGain, holdingPeriodYears: years,
    incomeTaxAllowancePercent: 0, socialTaxAllowancePercent: 0,
    taxableGainIncomeTax: netGain, taxableGainSocialTax: 0,
    incomeTax: totalTax, socialTax: 0, surtax: 0, totalTax, netProceeds,
  };
}

// ─── PAYS-BAS ──────────────────────────────────────────────────────────────────

function computeNetherlandsNotaryFees(price: number): NotaryFeesBreakdown {
  const registrationTax = round2(price * 0.06);
  const notaryEmoluments = round2(price * 0.008);
  const disbursements = round2(price * 0.001);
  const miscFees = round2(600);
  const total = round2(registrationTax + notaryEmoluments + disbursements + miscFees);
  const effectiveRate = round2((total / price) * 100);

  return { total, effectiveRate, registrationTax, notaryEmoluments, disbursements, miscFees };
}

function computeNetherlandsCapitalGain(
  salePrice: number,
  purchasePrice: number,
  acquisitionDate?: string
): CapitalGainBreakdown {
  const years = acquisitionDate ? yearsHeld(acquisitionDate) : 0;
  const grossGain = round2(salePrice - purchasePrice);
  const deductibleExpenses = 0;
  const netGain = grossGain;

  // Pays-Bas : 30% si < 2 ans, 20% si 2-5 ans, 0% si > 5 ans (résidence principale exonérée)
  let taxRate = 0;
  if (years < 2) taxRate = 0.30;
  else if (years < 5) taxRate = 0.20;

  const totalTax = round2(Math.max(0, netGain) * taxRate);
  const netProceeds = round2(salePrice - totalTax);

  return {
    grossGain, deductibleExpenses, netGain, holdingPeriodYears: years,
    incomeTaxAllowancePercent: 0, socialTaxAllowancePercent: 0,
    taxableGainIncomeTax: netGain, taxableGainSocialTax: 0,
    incomeTax: totalTax, socialTax: 0, surtax: 0, totalTax, netProceeds,
  };
}

// ─── ALLEMAGNE ──────────────────────────────────────────────────────────────────

function computeGermanyNotaryFees(price: number): NotaryFeesBreakdown {
  const registrationTax = round2(price * 0.035);
  const notaryEmoluments = round2(price * 0.012);
  const disbursements = round2(price * 0.001);
  const miscFees = round2(700);
  const total = round2(registrationTax + notaryEmoluments + disbursements + miscFees);
  const effectiveRate = round2((total / price) * 100);

  return { total, effectiveRate, registrationTax, notaryEmoluments, disbursements, miscFees };
}

function computeGermanyCapitalGain(
  salePrice: number,
  purchasePrice: number,
  acquisitionDate?: string
): CapitalGainBreakdown {
  const years = acquisitionDate ? yearsHeld(acquisitionDate) : 0;
  const grossGain = round2(salePrice - purchasePrice);
  const deductibleExpenses = 0;
  const netGain = grossGain;

  // Allemagne : 26.375% (Solidaritätszuschlag + Kirchensteuer) si < 10 ans, 0% si > 10 ans (résidence principale exonérée)
  let taxRate = 0;
  if (years < 10) taxRate = 0.26375;

  const totalTax = round2(Math.max(0, netGain) * taxRate);
  const netProceeds = round2(salePrice - totalTax);

  return {
    grossGain, deductibleExpenses, netGain, holdingPeriodYears: years,
    incomeTaxAllowancePercent: 0, socialTaxAllowancePercent: 0,
    taxableGainIncomeTax: netGain, taxableGainSocialTax: 0,
    incomeTax: totalTax, socialTax: 0, surtax: 0, totalTax, netProceeds,
  };
}

// ─── LUXEMBOURG ───────────────────────────────────────────────────────────────

function computeLuxembourgNotaryFees(price: number): NotaryFeesBreakdown {
  const registrationTax = round2(price * 0.07);
  const notaryEmoluments = round2(price * 0.01);
  const disbursements = round2(price * 0.001);
  const miscFees = round2(600);
  const total = round2(registrationTax + notaryEmoluments + disbursements + miscFees);
  const effectiveRate = round2((total / price) * 100);

  return { total, effectiveRate, registrationTax, notaryEmoluments, disbursements, miscFees };
}

function computeLuxembourgCapitalGain(
  salePrice: number,
  purchasePrice: number,
  acquisitionDate?: string
): CapitalGainBreakdown {
  const years = acquisitionDate ? yearsHeld(acquisitionDate) : 0;
  const grossGain = round2(salePrice - purchasePrice);
  const deductibleExpenses = 0;
  const netGain = grossGain;

  // Luxembourg : taux progressif, demi-taux si > 2 ans
  let taxRate = years >= 2 ? 0.21 : 0.42;
  // Abattement de 50 000 € si > 2 ans
  const abattement = years >= 2 ? 50000 : 0;
  const taxableGain = Math.max(0, netGain - abattement);
  const totalTax = round2(taxableGain * taxRate);
  const netProceeds = round2(salePrice - totalTax);

  return {
    grossGain, deductibleExpenses, netGain, holdingPeriodYears: years,
    incomeTaxAllowancePercent: 0, socialTaxAllowancePercent: 0,
    taxableGainIncomeTax: taxableGain, taxableGainSocialTax: 0,
    incomeTax: totalTax, socialTax: 0, surtax: 0, totalTax, netProceeds,
  };
}

// ─── Moteur principal ───────────────────────────────────────────────────────

export function runSimulation(input: SimulationInput): SimulationResult {
  const countryLabels: Record<string, string> = {
    france: "France",
    suisse: "Suisse",
    belgique: "Belgique",
    luxembourg: "Luxembourg",
    "pays-bas": "Pays-Bas",
    allemagne: "Allemagne",
  };

  const result: SimulationResult = {
    country: input.country,
    countryLabel: countryLabels[input.country] || input.country,
    city: input.city,
    operationType: input.operationType,
    summary: "",
    disclaimer:
      "Cette simulation est fournie à titre indicatif uniquement. Les résultats ne constituent pas un conseil fiscal, juridique ou financier. Les montants réels peuvent varier en fonction de votre situation personnelle, des évolutions législatives et des spécificités de votre dossier. Nous vous recommandons de consulter un notaire ou un conseiller fiscal agréé avant toute prise de décision.",
  };

  const hasAchat = input.operationType === "achat" || input.operationType === "achat_vente";
  const hasVente = input.operationType === "vente" || input.operationType === "achat_vente";

  // ─── Frais de notaire (achat) ──────────────────────────────────────
  if (hasAchat && input.purchasePrice) {
    switch (input.country) {
      case "france":
        result.notaryFees = computeFranceNotaryFees(input.purchasePrice);
        break;
      case "suisse":
        result.notaryFees = computeSwissNotaryFees(input.purchasePrice, input.canton);
        break;
      case "belgique":
        result.notaryFees = computeBelgiumNotaryFees(input.purchasePrice);
        break;
      case "luxembourg":
        result.notaryFees = computeLuxembourgNotaryFees(input.purchasePrice);
        break;
      case "pays-bas":
        result.notaryFees = computeNetherlandsNotaryFees(input.purchasePrice);
        break;
      case "allemagne":
        result.notaryFees = computeGermanyNotaryFees(input.purchasePrice);
        break;
    }
  }

  // ─── Plus-value (vente) ────────────────────────────────────────────
  if (hasVente && input.salePrice && input.purchasePrice) {
    switch (input.country) {
      case "france":
        result.capitalGain = computeFranceCapitalGain(
          input.salePrice, input.purchasePrice,
          input.acquisitionDate || new Date().toISOString().slice(0, 10),
          input.renovationCost || 0
        );
        break;
      case "suisse":
        result.capitalGain = computeSwissCapitalGain(
          input.salePrice, input.purchasePrice, input.acquisitionDate, input.canton
        );
        break;
      case "belgique":
        result.capitalGain = computeBelgiumCapitalGain(
          input.salePrice, input.purchasePrice, input.acquisitionDate
        );
        break;
      case "luxembourg":
        result.capitalGain = computeLuxembourgCapitalGain(
          input.salePrice, input.purchasePrice, input.acquisitionDate
        );
        break;
      case "pays-bas":
        result.capitalGain = computeNetherlandsCapitalGain(
          input.salePrice, input.purchasePrice, input.acquisitionDate
        );
        break;
      case "allemagne":
        result.capitalGain = computeGermanyCapitalGain(
          input.salePrice, input.purchasePrice, input.acquisitionDate
        );
        break;
    }
  }

  // ─── Prêt immobilier ───────────────────────────────────────────────
  if (input.loanAmount && input.loanRate && input.loanDuration) {
    result.loan = computeLoan(input.loanAmount, input.loanRate, input.loanDuration);
  }

  // ─── Investissement total ──────────────────────────────────────────
  if (hasAchat && input.purchasePrice) {
    let total = input.purchasePrice;
    if (result.notaryFees) total += result.notaryFees.total;
    if (result.loan) total += result.loan.totalInterest;
    result.totalInvestment = round2(total);
  }

  // ─── Résumé ────────────────────────────────────────────────────────
  const parts: string[] = [];
  parts.push(`Simulation pour ${input.city}, ${result.countryLabel}.`);

  if (result.notaryFees) {
    parts.push(`Les frais de notaire estimés s'élèvent à ${formatEUR(result.notaryFees.total)}, soit un taux effectif de ${result.notaryFees.effectiveRate.toFixed(2)} % du prix d'acquisition.`);
  }
  if (result.capitalGain) {
    if (result.capitalGain.totalTax > 0) {
      parts.push(`L'impôt sur la plus-value est estimé à ${formatEUR(result.capitalGain.totalTax)}. Le produit net de cession serait de ${formatEUR(result.capitalGain.netProceeds)}.`);
    } else {
      parts.push(`Aucun impôt sur la plus-value n'est dû pour cette opération.`);
    }
  }
  if (result.loan) {
    parts.push(`La mensualité du prêt serait de ${formatEUR(result.loan.monthlyPayment)} pour un coût total du crédit de ${formatEUR(result.loan.totalCost)}.`);
  }
  if (result.totalInvestment) {
    parts.push(`L'investissement total estimé s'élève à ${formatEUR(result.totalInvestment)}.`);
  }

  result.summary = parts.join(" ");

  return result;
}
