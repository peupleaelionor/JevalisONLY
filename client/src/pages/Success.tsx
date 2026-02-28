import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Download, Mail, Home, ArrowRight, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Success() {
  const [, navigate] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isEbook, setIsEbook] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    const product = params.get("product");
    if (sid) { setSessionId(sid); setIsEbook(product === "ebook"); }
    else navigate("/");
  }, [navigate]);

  const sessionStatus = trpc.stripe.getSessionStatus.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );

  if (!sessionId || sessionStatus.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0B1628" }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[oklch(0.70_0.20_70)] border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-[oklch(0.55_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  if (sessionStatus.error || sessionStatus.data?.status !== "paid") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B1628" }}>
        <div className="max-w-md w-full text-center bg-[oklch(0.13_0.025_250)] border border-red-500/30 p-10">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Paiement non confirmé</h2>
          <p className="text-[oklch(0.55_0.02_250)] mb-8 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Nous n&apos;avons pas pu confirmer votre paiement. Si vous avez été débité, contactez-nous à <span className="gold-text">support@jevalis.com</span>
          </p>
          <Link href="/"><Button className="w-full gold-bg text-[#0B1628] font-black gap-2" style={{ fontFamily: "var(--font-heading)" }}><Home className="w-5 h-5"/> Retour à l&apos;accueil</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4" style={{ background: "#0B1628" }}>
      {/* Nav */}
      <div className="max-w-2xl mx-auto mb-12 flex justify-center">
        <Link href="/"><span className="font-black text-xl tracking-widest cursor-pointer" style={{ fontFamily: "var(--font-heading)" }}><span className="text-white">JE</span><span className="gold-text">V</span><span className="text-white">ALIS</span></span></Link>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Main success card */}
        <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.30_0.06_85)]/40 p-10 text-center mb-6">
          <div className="w-20 h-20 rounded-full gold-bg flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <Check className="w-10 h-10 text-[#0B1628]"/>
          </div>
          <h1 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            🎉 {isEbook ? "Guide reçu !" : "Rapport en cours !"}
          </h1>
          <p className="text-[oklch(0.55_0.02_250)] text-lg mb-8 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            {isEbook
              ? "Votre Guide Fiscal Immobilier Européen a été envoyé à "
              : "Votre rapport professionnel a été envoyé à "}
            <span className="gold-text font-bold">{sessionStatus.data.customerEmail}</span>
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[oklch(0.11_0.02_250)] border border-[oklch(0.20_0.03_250)] p-6">
              <Mail className="w-8 h-8 gold-text mx-auto mb-3"/>
              <h3 className="text-white font-bold mb-2 text-sm" style={{ fontFamily: "var(--font-heading)" }}>Email envoyé</h3>
              <p className="text-[oklch(0.50_0.02_250)] text-xs leading-relaxed" style={{ fontFamily: "var(--font-caption)" }}>Votre {isEbook ? "guide PDF" : "rapport"} vous attend dans votre boîte mail</p>
            </div>
            <div className="bg-[oklch(0.11_0.02_250)] border border-[oklch(0.20_0.03_250)] p-6">
              <Download className="w-8 h-8 gold-text mx-auto mb-3"/>
              <h3 className="text-white font-bold mb-2 text-sm" style={{ fontFamily: "var(--font-heading)" }}>Téléchargement</h3>
              <p className="text-[oklch(0.50_0.02_250)] text-xs leading-relaxed" style={{ fontFamily: "var(--font-caption)" }}>Lien de téléchargement valable 30 jours</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[oklch(0.45_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
              Pas reçu ? Vérifiez vos spams ou contactez <span className="gold-text">support@jevalis.com</span>
            </p>
            <Link href="/account">
              <Button className="w-full gold-bg text-[#0B1628] font-black py-5 gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                Voir mes rapports dans mon compte <ArrowRight className="w-4 h-4"/>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full border-[oklch(0.25_0.03_250)] text-white hover:bg-[oklch(0.18_0.03_250)] gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <Home className="w-4 h-4"/> Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </div>

        {/* Upsell */}
        {isEbook && (
          <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-8 text-center">
            <FileText className="w-8 h-8 gold-text mx-auto mb-4"/>
            <h3 className="text-xl font-black text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Allez plus loin avec votre simulation</h3>
            <p className="text-[oklch(0.50_0.02_250)] mb-6 text-sm" style={{ fontFamily: "var(--font-body)" }}>Obtenez un rapport PDF premium personnalisé pour votre opération immobilière. Frais de notaire, plus-value, crédit — tout calculé pour votre bien.</p>
            <Link href="/#simulation">
              <Button className="gold-bg text-[#0B1628] font-black gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                Lancer ma simulation <ArrowRight className="w-4 h-4"/>
              </Button>
            </Link>
          </div>
        )}
        {!isEbook && (
          <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-8 text-center">
            <h3 className="text-xl font-black text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Complétez votre analyse</h3>
            <p className="text-[oklch(0.50_0.02_250)] mb-6 text-sm" style={{ fontFamily: "var(--font-body)" }}>Obtenez également notre Guide Fiscal Immobilier Européen — 20 pages de stratégies d&apos;optimisation pour 6 pays européens.</p>
            <Button className="bg-[oklch(0.70_0.20_70)] hover:bg-[oklch(0.65_0.20_70)] text-white font-black gap-2" style={{ fontFamily: "var(--font-heading)" }} onClick={() => window.location.href = "/apercu-ebook"}>
              Découvrir le guide — 9,99 € <ArrowRight className="w-4 h-4"/>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
