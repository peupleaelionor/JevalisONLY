/**
 * Générateur de rapport PDF professionnel — Jevalis
 * Design : Swiss Private Banking (navy + or)
 */

import PDFDocument from "pdfkit";
import type { SimulationResult } from "./financialEngine";

// ─── Couleurs ───────────────────────────────────────────────────────────────

const NAVY = "#0A1628";
const NAVY_LIGHT = "#142238";
const GOLD = "#D4A843";
const WHITE = "#FFFFFF";
const GRAY = "#8899AA";
const LIGHT_GRAY = "#C0CDD8";

// ─── Utilitaires ────────────────────────────────────────────────────────────

function formatEUR(n: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
}

function formatPercent(n: number): string {
  return `${n.toFixed(2)} %`;
}

function formatDate(): string {
  return new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Générateur ─────────────────────────────────────────────────────────────

export function generateReportPDF(result: SimulationResult, clientName: string, clientEmail: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      bufferPages: true,
      info: {
        Title: `Rapport Jevalis — ${clientName}`,
        Author: "Jevalis",
        Subject: "Simulation d'impact financier immobilier",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width - 100; // margins

    // ─── Page 1 : Couverture ──────────────────────────────────────────

    // Fond navy
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);

    // Ligne dorée en haut
    doc.rect(50, 40, pageWidth, 2).fill(GOLD);

    // Logo texte
    doc.fontSize(32).font("Helvetica-Bold").fillColor(WHITE).text("JEVALIS", 50, 80, { align: "left" });
    doc.fontSize(10).font("Helvetica").fillColor(GOLD).text("SIMULATION D'IMPACT FINANCIER IMMOBILIER", 50, 120, { align: "left" });

    // Ligne séparatrice
    doc.rect(50, 150, 80, 1).fill(GOLD);

    // Titre principal
    doc.fontSize(28).font("Helvetica-Bold").fillColor(WHITE).text("Rapport d'analyse", 50, 200);
    doc.fontSize(28).fillColor(GOLD).text("financière", 50, 240);

    // Informations client
    doc.fontSize(12).font("Helvetica").fillColor(LIGHT_GRAY);
    doc.text(`Préparé pour : ${clientName}`, 50, 320);
    doc.text(`Date : ${formatDate()}`, 50, 340);
    doc.text(`Référence : JEV-${Date.now().toString(36).toUpperCase()}`, 50, 360);

    // Résumé de l'opération
    doc.rect(50, 420, pageWidth, 1).fill(GOLD);
    doc.fontSize(14).font("Helvetica-Bold").fillColor(WHITE).text("Synthèse de l'opération", 50, 440);

    const operationLabels: Record<string, string> = {
      achat: "Achat immobilier",
      vente: "Vente immobilière",
      achat_vente: "Achat et vente",
    };

    doc.fontSize(11).font("Helvetica").fillColor(LIGHT_GRAY);
    let y = 470;
    const addInfoLine = (label: string, value: string) => {
      doc.font("Helvetica").fillColor(GRAY).text(label, 50, y, { width: 200 });
      doc.font("Helvetica-Bold").fillColor(WHITE).text(value, 260, y, { width: pageWidth - 210 });
      y += 22;
    };

    addInfoLine("Pays", result.countryLabel);
    addInfoLine("Ville", result.city);
    addInfoLine("Type d'opération", operationLabels[result.operationType] || result.operationType);

    // Ligne dorée en bas
    doc.rect(50, doc.page.height - 60, pageWidth, 1).fill(GOLD);
    doc.fontSize(8).font("Helvetica").fillColor(GRAY).text("Document confidentiel — Jevalis © " + new Date().getFullYear(), 50, doc.page.height - 45, { align: "center", width: pageWidth });

    // ─── Page 2 : Frais de notaire ────────────────────────────────────

    if (result.notaryFees) {
      doc.addPage();
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
      doc.rect(50, 40, pageWidth, 2).fill(GOLD);

      doc.fontSize(10).font("Helvetica").fillColor(GOLD).text("JEVALIS", 50, 50);
      doc.fontSize(22).font("Helvetica-Bold").fillColor(WHITE).text("Frais de notaire", 50, 90);
      doc.fontSize(11).font("Helvetica").fillColor(GRAY).text("Détail des frais d'acquisition estimés", 50, 120);

      doc.rect(50, 150, pageWidth, 1).fill(GOLD);

      y = 175;
      const nf = result.notaryFees;

      // Tableau
      const addRow = (label: string, value: string, highlight: boolean = false) => {
        if (highlight) {
          doc.rect(50, y - 5, pageWidth, 28).fill(NAVY_LIGHT);
        }
        doc.font("Helvetica").fillColor(highlight ? WHITE : LIGHT_GRAY).fontSize(11).text(label, 60, y, { width: 300 });
        doc.font("Helvetica-Bold").fillColor(highlight ? GOLD : WHITE).fontSize(11).text(value, 370, y, { width: 150, align: "right" });
        y += 30;
      };

      addRow("Droits de mutation / d'enregistrement", formatEUR(nf.registrationTax));
      addRow("Émoluments du notaire", formatEUR(nf.notaryEmoluments));
      addRow("Débours et frais administratifs", formatEUR(nf.disbursements));
      addRow("Frais divers", formatEUR(nf.miscFees));

      doc.rect(50, y, pageWidth, 1).fill(GOLD);
      y += 15;
      addRow("TOTAL DES FRAIS DE NOTAIRE", formatEUR(nf.total), true);
      y += 5;
      addRow("Taux effectif", formatPercent(nf.effectiveRate), true);

      // Note
      y += 30;
      doc.fontSize(9).font("Helvetica").fillColor(GRAY);
      doc.text("Les frais de notaire sont calculés sur la base des barèmes en vigueur. Les montants réels peuvent varier légèrement en fonction des spécificités de votre dossier.", 50, y, { width: pageWidth });

      // Footer
      doc.rect(50, doc.page.height - 60, pageWidth, 1).fill(GOLD);
      doc.fontSize(8).font("Helvetica").fillColor(GRAY).text("Document confidentiel — Jevalis © " + new Date().getFullYear(), 50, doc.page.height - 45, { align: "center", width: pageWidth });
    }

    // ─── Page 3 : Plus-value ──────────────────────────────────────────

    if (result.capitalGain) {
      doc.addPage();
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
      doc.rect(50, 40, pageWidth, 2).fill(GOLD);

      doc.fontSize(10).font("Helvetica").fillColor(GOLD).text("JEVALIS", 50, 50);
      doc.fontSize(22).font("Helvetica-Bold").fillColor(WHITE).text("Analyse de la plus-value", 50, 90);
      doc.fontSize(11).font("Helvetica").fillColor(GRAY).text("Impact fiscal de la cession immobilière", 50, 120);

      doc.rect(50, 150, pageWidth, 1).fill(GOLD);

      y = 175;
      const cg = result.capitalGain;

      const addRow = (label: string, value: string, highlight: boolean = false) => {
        if (highlight) {
          doc.rect(50, y - 5, pageWidth, 28).fill(NAVY_LIGHT);
        }
        doc.font("Helvetica").fillColor(highlight ? WHITE : LIGHT_GRAY).fontSize(11).text(label, 60, y, { width: 300 });
        doc.font("Helvetica-Bold").fillColor(highlight ? GOLD : WHITE).fontSize(11).text(value, 370, y, { width: 150, align: "right" });
        y += 30;
      };

      addRow("Plus-value brute", formatEUR(cg.grossGain));
      addRow("Charges déductibles", formatEUR(cg.deductibleExpenses));
      addRow("Plus-value nette", formatEUR(cg.netGain));
      addRow("Durée de détention", `${cg.holdingPeriodYears} ans`);

      doc.rect(50, y, pageWidth, 0.5).fill(GRAY);
      y += 15;

      if (cg.incomeTaxAllowancePercent > 0) {
        addRow("Abattement impôt sur le revenu", formatPercent(cg.incomeTaxAllowancePercent));
      }
      if (cg.socialTaxAllowancePercent > 0) {
        addRow("Abattement prélèvements sociaux", formatPercent(cg.socialTaxAllowancePercent));
      }

      if (cg.taxableGainIncomeTax > 0) {
        addRow("Base imposable (IR)", formatEUR(cg.taxableGainIncomeTax));
      }
      if (cg.incomeTax > 0) {
        addRow("Impôt sur le revenu (19 %)", formatEUR(cg.incomeTax));
      }
      if (cg.socialTax > 0) {
        addRow("Prélèvements sociaux (17,2 %)", formatEUR(cg.socialTax));
      }
      if (cg.surtax > 0) {
        addRow("Surtaxe", formatEUR(cg.surtax));
      }

      doc.rect(50, y, pageWidth, 1).fill(GOLD);
      y += 15;
      addRow("TOTAL IMPÔT SUR LA PLUS-VALUE", formatEUR(cg.totalTax), true);
      y += 5;
      addRow("PRODUIT NET DE CESSION", formatEUR(cg.netProceeds), true);

      // Footer
      doc.rect(50, doc.page.height - 60, pageWidth, 1).fill(GOLD);
      doc.fontSize(8).font("Helvetica").fillColor(GRAY).text("Document confidentiel — Jevalis © " + new Date().getFullYear(), 50, doc.page.height - 45, { align: "center", width: pageWidth });
    }

    // ─── Page 4 : Prêt immobilier ─────────────────────────────────────

    if (result.loan) {
      doc.addPage();
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
      doc.rect(50, 40, pageWidth, 2).fill(GOLD);

      doc.fontSize(10).font("Helvetica").fillColor(GOLD).text("JEVALIS", 50, 50);
      doc.fontSize(22).font("Helvetica-Bold").fillColor(WHITE).text("Simulation de prêt", 50, 90);
      doc.fontSize(11).font("Helvetica").fillColor(GRAY).text("Analyse du coût total du financement", 50, 120);

      doc.rect(50, 150, pageWidth, 1).fill(GOLD);

      y = 175;
      const ln = result.loan;

      const addRow = (label: string, value: string, highlight: boolean = false) => {
        if (highlight) {
          doc.rect(50, y - 5, pageWidth, 28).fill(NAVY_LIGHT);
        }
        doc.font("Helvetica").fillColor(highlight ? WHITE : LIGHT_GRAY).fontSize(11).text(label, 60, y, { width: 300 });
        doc.font("Helvetica-Bold").fillColor(highlight ? GOLD : WHITE).fontSize(11).text(value, 370, y, { width: 150, align: "right" });
        y += 30;
      };

      addRow("Mensualité", formatEUR(ln.monthlyPayment), true);
      addRow("Total des intérêts", formatEUR(ln.totalInterest));
      addRow("Montant total remboursé", formatEUR(ln.totalRepaid));

      doc.rect(50, y, pageWidth, 1).fill(GOLD);
      y += 15;
      addRow("COÛT TOTAL DU CRÉDIT", formatEUR(ln.totalCost), true);

      // Footer
      doc.rect(50, doc.page.height - 60, pageWidth, 1).fill(GOLD);
      doc.fontSize(8).font("Helvetica").fillColor(GRAY).text("Document confidentiel — Jevalis © " + new Date().getFullYear(), 50, doc.page.height - 45, { align: "center", width: pageWidth });
    }

    // ─── Page finale : Synthèse & Avertissement ──────────────────────

    doc.addPage();
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
    doc.rect(50, 40, pageWidth, 2).fill(GOLD);

    doc.fontSize(10).font("Helvetica").fillColor(GOLD).text("JEVALIS", 50, 50);
    doc.fontSize(22).font("Helvetica-Bold").fillColor(WHITE).text("Synthèse", 50, 90);

    doc.rect(50, 130, pageWidth, 1).fill(GOLD);

    y = 155;

    // Investissement total
    if (result.totalInvestment) {
      doc.rect(50, y, pageWidth, 60).fill(NAVY_LIGHT);
      doc.fontSize(12).font("Helvetica").fillColor(GRAY).text("Investissement total estimé", 70, y + 10, { width: 250 });
      doc.fontSize(24).font("Helvetica-Bold").fillColor(GOLD).text(formatEUR(result.totalInvestment), 330, y + 10, { width: 200, align: "right" });
      y += 80;
    }

    // Résumé texte
    doc.fontSize(11).font("Helvetica").fillColor(LIGHT_GRAY).text(result.summary, 50, y, { width: pageWidth, lineGap: 6 });

    // Avertissement
    y = doc.page.height - 250;
    doc.rect(50, y, pageWidth, 1).fill(GOLD);
    y += 20;
    doc.fontSize(10).font("Helvetica-Bold").fillColor(GOLD).text("AVERTISSEMENT", 50, y);
    y += 20;
    doc.fontSize(9).font("Helvetica").fillColor(GRAY).text(result.disclaimer, 50, y, { width: pageWidth, lineGap: 4 });

    // Footer final
    doc.rect(50, doc.page.height - 60, pageWidth, 1).fill(GOLD);
    doc.fontSize(8).font("Helvetica").fillColor(GRAY).text("Document confidentiel — Jevalis © " + new Date().getFullYear(), 50, doc.page.height - 45, { align: "center", width: pageWidth });

    doc.end();
  });
}
