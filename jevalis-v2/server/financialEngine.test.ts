import { describe, expect, it } from "vitest";
import { runSimulation, type SimulationInput } from "./financialEngine";

describe("Financial Engine — France", () => {
  it("calculates notary fees for a purchase in France", () => {
    const input: SimulationInput = {
      country: "france",
      city: "Paris",
      operationType: "achat",
      purchasePrice: 300000,
    };
    const result = runSimulation(input);

    expect(result.country).toBe("france");
    expect(result.countryLabel).toBe("France");
    expect(result.notaryFees).toBeDefined();
    expect(result.notaryFees!.total).toBeGreaterThan(0);
    expect(result.notaryFees!.effectiveRate).toBeGreaterThan(5);
    expect(result.notaryFees!.effectiveRate).toBeLessThan(12);
    expect(result.notaryFees!.registrationTax).toBeGreaterThan(0);
    expect(result.notaryFees!.notaryEmoluments).toBeGreaterThan(0);
  });

  it("calculates capital gain tax for a sale in France", () => {
    const input: SimulationInput = {
      country: "france",
      city: "Lyon",
      operationType: "vente",
      purchasePrice: 200000,
      salePrice: 350000,
      acquisitionDate: "2015-06-15",
    };
    const result = runSimulation(input);

    expect(result.capitalGain).toBeDefined();
    expect(result.capitalGain!.grossGain).toBe(150000);
    expect(result.capitalGain!.holdingPeriodYears).toBeGreaterThan(5);
    expect(result.capitalGain!.totalTax).toBeGreaterThanOrEqual(0);
    expect(result.capitalGain!.netProceeds).toBeGreaterThan(0);
  });

  it("calculates loan for a purchase in France", () => {
    const input: SimulationInput = {
      country: "france",
      city: "Marseille",
      operationType: "achat",
      purchasePrice: 250000,
      loanAmount: 200000,
      loanRate: 3.5,
      loanDuration: 25,
    };
    const result = runSimulation(input);

    expect(result.loan).toBeDefined();
    expect(result.loan!.monthlyPayment).toBeGreaterThan(800);
    expect(result.loan!.monthlyPayment).toBeLessThan(1200);
    expect(result.loan!.totalInterest).toBeGreaterThan(0);
    expect(result.loan!.totalRepaid).toBeGreaterThan(200000);
    expect(result.totalInvestment).toBeGreaterThan(0);
  });
});

describe("Financial Engine — Suisse", () => {
  it("calculates notary fees for a purchase in Suisse (Genève)", () => {
    const input: SimulationInput = {
      country: "suisse",
      canton: "Genève",
      city: "Genève",
      operationType: "achat",
      purchasePrice: 500000,
    };
    const result = runSimulation(input);

    expect(result.country).toBe("suisse");
    expect(result.countryLabel).toBe("Suisse");
    expect(result.notaryFees).toBeDefined();
    expect(result.notaryFees!.total).toBeGreaterThan(0);
  });

  it("calculates capital gain for a sale in Suisse", () => {
    const input: SimulationInput = {
      country: "suisse",
      canton: "Vaud",
      city: "Lausanne",
      operationType: "vente",
      purchasePrice: 400000,
      salePrice: 600000,
      acquisitionDate: "2018-01-01",
    };
    const result = runSimulation(input);

    expect(result.capitalGain).toBeDefined();
    expect(result.capitalGain!.grossGain).toBe(200000);
    expect(result.capitalGain!.totalTax).toBeGreaterThan(0);
  });
});

describe("Financial Engine — Belgique", () => {
  it("calculates registration fees for a purchase in Belgique", () => {
    const input: SimulationInput = {
      country: "belgique",
      city: "Bruxelles",
      operationType: "achat",
      purchasePrice: 350000,
    };
    const result = runSimulation(input);

    expect(result.country).toBe("belgique");
    expect(result.countryLabel).toBe("Belgique");
    expect(result.notaryFees).toBeDefined();
    expect(result.notaryFees!.total).toBeGreaterThan(0);
    expect(result.notaryFees!.registrationTax).toBeGreaterThan(0);
  });
});

describe("Financial Engine — Luxembourg", () => {
  it("calculates notary fees for a purchase in Luxembourg", () => {
    const input: SimulationInput = {
      country: "luxembourg",
      city: "Luxembourg",
      operationType: "achat",
      purchasePrice: 600000,
    };
    const result = runSimulation(input);

    expect(result.country).toBe("luxembourg");
    expect(result.countryLabel).toBe("Luxembourg");
    expect(result.notaryFees).toBeDefined();
    expect(result.notaryFees!.total).toBeGreaterThan(0);
  });

  it("calculates capital gain for a sale in Luxembourg", () => {
    const input: SimulationInput = {
      country: "luxembourg",
      city: "Luxembourg",
      operationType: "vente",
      purchasePrice: 400000,
      salePrice: 550000,
      acquisitionDate: "2020-03-01",
    };
    const result = runSimulation(input);

    expect(result.capitalGain).toBeDefined();
    expect(result.capitalGain!.grossGain).toBe(150000);
    expect(result.capitalGain!.totalTax).toBeGreaterThan(0);
  });
});

describe("Financial Engine — Edge cases", () => {
  it("handles achat_vente operation type", () => {
    const input: SimulationInput = {
      country: "france",
      city: "Nice",
      operationType: "achat_vente",
      purchasePrice: 300000,
      salePrice: 400000,
      acquisitionDate: "2010-01-01",
      loanAmount: 250000,
      loanRate: 3.0,
      loanDuration: 20,
    };
    const result = runSimulation(input);

    expect(result.notaryFees).toBeDefined();
    expect(result.capitalGain).toBeDefined();
    expect(result.loan).toBeDefined();
    expect(result.summary).toBeTruthy();
    expect(result.disclaimer).toBeTruthy();
  });

  it("generates a valid summary text", () => {
    const input: SimulationInput = {
      country: "france",
      city: "Bordeaux",
      operationType: "achat",
      purchasePrice: 200000,
    };
    const result = runSimulation(input);

    expect(result.summary.length).toBeGreaterThan(50);
    expect(result.disclaimer.length).toBeGreaterThan(50);
  });
});
