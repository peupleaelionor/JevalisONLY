import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Calculator, CreditCard, ArrowRight, ArrowLeft, Check, Shield, Zap, FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const COUNTRIES = [
  { value: "france", label: "France", flag: "🇫🇷" },
  { value: "suisse", label: "Suisse", flag: "🇨🇭" },
  { value: "belgique", label: "Belgique", flag: "🇧🇪" },
  { value: "luxembourg", label: "Luxembourg", flag: "🇱🇺" },
  { value: "pays-bas", label: "Pays-Bas", flag: "🇳🇱" },
  { value: "allemagne", label: "Allemagne", flag: "🇩🇪" },
];

const SWISS_CANTONS = [
  "Genève", "Vaud", "Zurich", "Berne", "Bâle-Ville", "Bâle-Campagne",
  "Lucerne", "Saint-Gall", "Argovie", "Thurgovie", "Tessin", "Valais",
  "Neuchâtel", "Fribourg", "Soleure", "Schaffhouse", "Zoug", "Schwyz",
  "Glaris", "Appenzell", "Grisons", "Jura", "Nidwald", "Obwald", "Uri",
];

const OPERATION_TYPES = [
  { value: "achat", label: "Achat immobilier" },
  { value: "vente", label: "Vente immobilière" },
  { value: "achat_vente", label: "Achat + Vente" },
];

interface FormData {
  country: string;
  canton: string;
  city: string;
  operationType: string;
  purchasePrice: string;
  salePrice: string;
  acquisitionDate: string;
  renovationCost: string;
  loanAmount: string;
  loanRate: string;
  loanDuration: string;
  email: string;
  fullName: string;
}

interface SimulationResult {
  publicId: string;
  reportUrl: string;
  summary: string;
  results: {
    notaryFees?: { total: number; effectiveRate: number };
    capitalGain?: { totalTax: number; netProceeds: number };
    loan?: { monthlyPayment: number; totalCost: number };
    totalInvestment?: number;
  };
}

export default function SimulationForm() {
  const [step, setStep] = useState(1);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [formData, setFormData] = useState<FormData>({
    country: "",
    canton: "",
    city: "",
    operationType: "",
    purchasePrice: "",
    salePrice: "",
    acquisitionDate: "",
    renovationCost: "",
    loanAmount: "",
    loanRate: "",
    loanDuration: "",
    email: "",
    fullName: "",
  });

  const createSimulation = trpc.simulation.create.useMutation({
    onSuccess: (data) => {
      setSimulationResult(data as SimulationResult);
      // Ne pas passer à l'étape 4, créer la session Stripe
      createCheckoutSession.mutate({
        productType: "PREMIUM",
        simulationId: data.publicId,
        customerEmail: formData.email,
        customerName: formData.fullName,
      });
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`, { duration: 5000 });
    },
  });

  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.info("Redirection vers le paiement sécurisé...", { duration: 2000 });
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(`Erreur de paiement : ${error.message}`, { duration: 5000 });
    },
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceedStep1 = formData.country && formData.city && formData.operationType;
  const canProceedStep2 = formData.purchasePrice || formData.salePrice;
  const canSubmit = formData.email && formData.fullName;

  const handleSubmit = async () => {
    createSimulation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      country: formData.country as "france" | "suisse" | "belgique" | "luxembourg",
      canton: formData.country === "suisse" ? formData.canton : undefined,
      city: formData.city,
      operationType: formData.operationType as "achat" | "vente" | "achat_vente",
      purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : undefined,
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
      acquisitionDate: formData.acquisitionDate || undefined,
      renovationCost: formData.renovationCost ? Number(formData.renovationCost) : undefined,
      loanAmount: formData.loanAmount ? Number(formData.loanAmount) : undefined,
      loanRate: formData.loanRate ? Number(formData.loanRate) : undefined,
      loanDuration: formData.loanDuration ? Number(formData.loanDuration) : undefined,
    });
  };

  const formatEUR = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

  const steps = [
    { num: 1, label: "Localisation", icon: MapPin },
    { num: 2, label: "Financement", icon: Calculator },
    { num: 3, label: "Paiement", icon: CreditCard },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Steps */}
      {step <= 3 && (
        <div className="flex items-center justify-between mb-12">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${
                    step >= s.num
                      ? "gold-bg text-[#0A1628]"
                      : "border border-[oklch(0.30_0.03_250)] text-[oklch(0.50_0.02_250)]"
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-sm hidden sm:block transition-colors duration-300 ${
                    step >= s.num ? "text-white" : "text-[oklch(0.45_0.02_250)]"
                  }`}
                  style={{ fontFamily: "var(--font-caption)" }}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={`h-px transition-all duration-500 ${
                      step > s.num ? "gold-bg" : "bg-[oklch(0.25_0.03_250)]"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Localisation */}
      {step === 1 && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div>
            <h3
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Localisation du bien
            </h3>
            <p className="text-[oklch(0.55_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
              Indiquez la localisation de votre opération immobilière.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                Pays
              </Label>
              <Select value={formData.country} onValueChange={(v) => updateField("country", v)}>
                <SelectTrigger className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12">
                  <SelectValue placeholder="Sélectionnez un pays" />
                </SelectTrigger>
                <SelectContent className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)]">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="text-white">
                      {c.flag} {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.country === "suisse" && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                  Canton
                </Label>
                <Select value={formData.canton} onValueChange={(v) => updateField("canton", v)}>
                  <SelectTrigger className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12">
                    <SelectValue placeholder="Sélectionnez un canton" />
                  </SelectTrigger>
                  <SelectContent className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)]">
                    {SWISS_CANTONS.map((c) => (
                      <SelectItem key={c} value={c} className="text-white">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                Ville
              </Label>
              <Input
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Ex : Paris, Genève, Bruxelles..."
                className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 placeholder:text-[oklch(0.40_0.02_250)]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                Type d'opération
              </Label>
              <Select value={formData.operationType} onValueChange={(v) => updateField("operationType", v)}>
                <SelectTrigger className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12">
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)]">
                  {OPERATION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="text-white">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={!canProceedStep1}
            className="w-full h-14 gold-bg text-[#0A1628] font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-30"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Continuer
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Step 2: Détails financiers */}
      {step === 2 && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div>
            <h3
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Détails financiers
            </h3>
            <p className="text-[oklch(0.55_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
              Renseignez les informations financières de votre opération.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(formData.operationType === "achat" || formData.operationType === "achat_vente") && (
              <div className="space-y-2">
                <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                  Prix d'achat (€)
                </Label>
                <Input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => updateField("purchasePrice", e.target.value)}
                  placeholder="250 000"
                  className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 placeholder:text-[oklch(0.40_0.02_250)]"
                />
              </div>
            )}

            {(formData.operationType === "vente" || formData.operationType === "achat_vente") && (
              <div className="space-y-2">
                <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                  Prix de vente (€)
                </Label>
                <Input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => updateField("salePrice", e.target.value)}
                  placeholder="320 000"
                  className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 placeholder:text-[oklch(0.40_0.02_250)]"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                Date d'acquisition
              </Label>
              <Input
                type="date"
                value={formData.acquisitionDate}
                onChange={(e) => updateField("acquisitionDate", e.target.value)}
                className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                Travaux réalisés (€)
              </Label>
              <Input
                type="number"
                value={formData.renovationCost}
                onChange={(e) => updateField("renovationCost", e.target.value)}
                placeholder="0"
                className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 placeholder:text-[oklch(0.40_0.02_250)]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                Montant du prêt (€)
              </Label>
              <Input
                type="number"
                value={formData.loanAmount}
                onChange={(e) => updateField("loanAmount", e.target.value)}
                placeholder="200 000"
                className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 placeholder:text-[oklch(0.40_0.02_250)]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                Taux d'intérêt (%)
              </Label>
              <Input
                type="number"
                step="0.01"
                value={formData.loanRate}
                onChange={(e) => updateField("loanRate", e.target.value)}
                placeholder="3.5"
                className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 placeholder:text-[oklch(0.40_0.02_250)]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                Durée du prêt (années)
              </Label>
              <Input
                type="number"
                value={formData.loanDuration}
                onChange={(e) => updateField("loanDuration", e.target.value)}
                placeholder="25"
                className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 placeholder:text-[oklch(0.40_0.02_250)]"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="flex-1 h-14 border-[oklch(0.25_0.03_250)] text-white hover:bg-[oklch(0.18_0.03_250)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Retour
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!canProceedStep2}
              className="flex-[2] h-14 gold-bg text-[#0A1628] font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-30"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Continuer
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Récapitulatif & Paiement */}
      {step === 3 && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div>
            <h3
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Récapitulatif & Paiement
            </h3>
            <p className="text-[oklch(0.55_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
              Vérifiez vos informations et procédez au paiement sécurisé.
            </p>
          </div>

          {/* Summary */}
          <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-[oklch(0.55_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>Pays</span>
              <span className="text-white font-medium">{COUNTRIES.find((c) => c.value === formData.country)?.label || "—"}</span>
            </div>
            <div className="h-px bg-[oklch(0.20_0.03_250)]" />
            <div className="flex justify-between text-sm">
              <span className="text-[oklch(0.55_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>Ville</span>
              <span className="text-white font-medium">{formData.city || "—"}</span>
            </div>
            <div className="h-px bg-[oklch(0.20_0.03_250)]" />
            <div className="flex justify-between text-sm">
              <span className="text-[oklch(0.55_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>Opération</span>
              <span className="text-white font-medium">{OPERATION_TYPES.find((t) => t.value === formData.operationType)?.label || "—"}</span>
            </div>
            {formData.purchasePrice && (
              <>
                <div className="h-px bg-[oklch(0.20_0.03_250)]" />
                <div className="flex justify-between text-sm">
                  <span className="text-[oklch(0.55_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>Prix d'achat</span>
                  <span className="text-white font-medium">{Number(formData.purchasePrice).toLocaleString("fr-FR")} €</span>
                </div>
              </>
            )}
            {formData.salePrice && (
              <>
                <div className="h-px bg-[oklch(0.20_0.03_250)]" />
                <div className="flex justify-between text-sm">
                  <span className="text-[oklch(0.55_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>Prix de vente</span>
                  <span className="text-white font-medium">{Number(formData.salePrice).toLocaleString("fr-FR")} €</span>
                </div>
              </>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                Nom complet
              </Label>
              <Input
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Jean Dupont"
                className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 placeholder:text-[oklch(0.40_0.02_250)]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[oklch(0.70_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                Email (pour recevoir le rapport)
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="jean@exemple.com"
                className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12 placeholder:text-[oklch(0.40_0.02_250)]"
              />
            </div>
          </div>

          {/* Price */}
          <div className="bg-[oklch(0.13_0.025_250)] border gold-border p-6 text-center">
            <p className="text-[oklch(0.55_0.02_250)] text-sm mb-2" style={{ fontFamily: "var(--font-caption)" }}>
              Montant unique — Rapport PDF immédiat
            </p>
            <p className="text-5xl font-black gold-text" style={{ fontFamily: "var(--font-heading)" }}>
              39,99 €
            </p>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 text-xs text-[oklch(0.50_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 gold-text" />
              Paiement sécurisé
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 gold-text" />
              Livraison immédiate
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 gold-text" />
              Rapport professionnel
            </span>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              className="flex-1 h-14 border-[oklch(0.25_0.03_250)] text-white hover:bg-[oklch(0.18_0.03_250)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Retour
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || createSimulation.isPending}
              className="flex-[2] h-14 gold-bg text-[#0A1628] font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-30"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {createSimulation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Génération du rapport...
                </>
              ) : (
                <>
                  Payer 39,99 € — Recevoir le rapport
                  <CreditCard className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Résultats */}
      {step === 4 && simulationResult && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full gold-bg flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-[#0A1628]" />
            </div>
            <h3
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Votre rapport est prêt
            </h3>
            <p className="text-[oklch(0.55_0.02_250)] text-sm max-w-md mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              {simulationResult.summary}
            </p>
          </div>

          {/* Résumé des résultats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {simulationResult.results.notaryFees && (
              <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] p-5 space-y-2">
                <p className="text-xs text-[oklch(0.50_0.02_250)] uppercase tracking-wider" style={{ fontFamily: "var(--font-caption)" }}>
                  Frais de notaire
                </p>
                <p className="text-xl font-bold gold-text" style={{ fontFamily: "var(--font-heading)" }}>
                  {formatEUR(simulationResult.results.notaryFees.total)}
                </p>
                <p className="text-xs text-[oklch(0.45_0.02_250)]">
                  Taux effectif : {simulationResult.results.notaryFees.effectiveRate.toFixed(2)} %
                </p>
              </div>
            )}

            {simulationResult.results.capitalGain && (
              <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] p-5 space-y-2">
                <p className="text-xs text-[oklch(0.50_0.02_250)] uppercase tracking-wider" style={{ fontFamily: "var(--font-caption)" }}>
                  Impôt sur la plus-value
                </p>
                <p className="text-xl font-bold gold-text" style={{ fontFamily: "var(--font-heading)" }}>
                  {formatEUR(simulationResult.results.capitalGain.totalTax)}
                </p>
                <p className="text-xs text-[oklch(0.45_0.02_250)]">
                  Produit net : {formatEUR(simulationResult.results.capitalGain.netProceeds)}
                </p>
              </div>
            )}

            {simulationResult.results.loan && (
              <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.22_0.03_250)] p-5 space-y-2">
                <p className="text-xs text-[oklch(0.50_0.02_250)] uppercase tracking-wider" style={{ fontFamily: "var(--font-caption)" }}>
                  Mensualité du prêt
                </p>
                <p className="text-xl font-bold gold-text" style={{ fontFamily: "var(--font-heading)" }}>
                  {formatEUR(simulationResult.results.loan.monthlyPayment)}
                </p>
                <p className="text-xs text-[oklch(0.45_0.02_250)]">
                  Coût total : {formatEUR(simulationResult.results.loan.totalCost)}
                </p>
              </div>
            )}

            {simulationResult.results.totalInvestment && (
              <div className="bg-[oklch(0.13_0.025_250)] border gold-border p-5 space-y-2">
                <p className="text-xs text-[oklch(0.50_0.02_250)] uppercase tracking-wider" style={{ fontFamily: "var(--font-caption)" }}>
                  Investissement total
                </p>
                <p className="text-xl font-bold gold-text" style={{ fontFamily: "var(--font-heading)" }}>
                  {formatEUR(simulationResult.results.totalInvestment)}
                </p>
              </div>
            )}
          </div>

          {/* Download button */}
          <a
            href={simulationResult.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              className="w-full h-14 gold-bg text-[#0A1628] font-bold text-base hover:opacity-90 transition-opacity"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Download className="mr-2 w-5 h-5" />
              Télécharger le rapport PDF complet
            </Button>
          </a>

          <p className="text-center text-xs text-[oklch(0.45_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>
            Le rapport a également été envoyé à {formData.email}
          </p>

          {/* New simulation */}
          <Button
            onClick={() => {
              setStep(1);
              setSimulationResult(null);
              setFormData({
                country: "", canton: "", city: "", operationType: "",
                purchasePrice: "", salePrice: "", acquisitionDate: "",
                renovationCost: "", loanAmount: "", loanRate: "",
                loanDuration: "", email: "", fullName: "",
              });
            }}
            variant="outline"
            className="w-full h-12 border-[oklch(0.25_0.03_250)] text-white hover:bg-[oklch(0.18_0.03_250)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Lancer une nouvelle simulation
          </Button>
        </div>
      )}
    </div>
  );
}
