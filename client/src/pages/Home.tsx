import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DollarSign, Settings, BarChart3, TrendingUp, MapPin, Zap, Check, Shield, FileText, ChevronDown, ArrowRight, User, Clock, Star, Lock } from "lucide-react";
import SimulationForm from "./SimulationForm";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const CDN = { hero: "/images/hero-dashboard.jpg", report: "/images/report-preview.jpg", map: "/images/europe-map.jpg" };

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !started) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const steps = 60; const increment = target / steps; let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(interval); } else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target, duration]);
  return { count, ref };
}

function useCountdown() {
  const getTarget = () => {
    try { const s = localStorage.getItem("jevalis_cd"); if (s) return parseInt(s); } catch {}
    const t = Date.now() + 48 * 3600 * 1000;
    try { localStorage.setItem("jevalis_cd", String(t)); } catch {}
    return t;
  };
  const [target] = useState(getTarget);
  const [remaining, setRemaining] = useState(target - Date.now());
  useEffect(() => { const id = setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000); return () => clearInterval(id); }, [target]);
  return { h: Math.floor(remaining / 3600000), m: Math.floor((remaining % 3600000) / 60000), s: Math.floor((remaining % 60000) / 1000) };
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.12 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function HeaderAccountButton() {
  const { data } = trpc.clientAuth.getCurrentClient.useQuery();
  return data?.user ? (
    <Link href="/account"><Button variant="outline" className="border-[oklch(0.25_0.03_250)] text-white hover:bg-[oklch(0.18_0.03_250)] text-sm gap-2" style={{ fontFamily: "var(--font-heading)" }}><User className="w-4 h-4" /> Mon compte</Button></Link>
  ) : (
    <Link href="/login"><Button variant="outline" className="border-[oklch(0.25_0.03_250)] text-white hover:bg-[oklch(0.18_0.03_250)] text-sm gap-2" style={{ fontFamily: "var(--font-heading)" }}><User className="w-4 h-4" /> Connexion</Button></Link>
  );
}

export default function Home() {
  const simulationRef = useRef<HTMLDivElement>(null);
  const stat1 = useCounter(6); const stat2 = useCounter(9); const stat3 = useCounter(1);
  const countdown = useCountdown();
  const r1 = useReveal(); const r2 = useReveal(); const r3 = useReveal(); const r4 = useReveal(); const r5 = useReveal();
  const ebookCheckout = trpc.stripe.createEbookCheckout.useMutation({
    onSuccess: (d) => { if (d.checkoutUrl) window.location.href = d.checkoutUrl; },
    onError: () => { window.location.href = "/login"; },
  });
  const scrollToSim = () => simulationRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen" style={{ background: "#0B1628" }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1628]/90 backdrop-blur-md border-b border-[oklch(0.15_0.02_250)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><span className="font-black text-lg tracking-widest cursor-pointer" style={{ fontFamily: "var(--font-heading)" }}><span className="text-white">JE</span><span className="gold-text">V</span><span className="text-white">ALIS</span></span></Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/blog"><span className="text-[oklch(0.55_0.02_250)] hover:text-white transition-colors cursor-pointer text-sm" style={{ fontFamily: "var(--font-caption)" }}>Blog</span></Link>
            <Link href="/apercu-ebook"><span className="text-[oklch(0.55_0.02_250)] hover:text-white transition-colors cursor-pointer text-sm" style={{ fontFamily: "var(--font-caption)" }}>Guide fiscal</span></Link>
          </div>
          <div className="flex items-center gap-3">
            <HeaderAccountButton />
            <Button onClick={scrollToSim} className="gold-bg text-[#0B1628] font-black px-5 py-2 rounded-none hover:opacity-90 text-sm gap-2" style={{ fontFamily: "var(--font-heading)" }}>
              Simulation <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25" width="1400" height="1400" viewBox="0 0 1400 1400" fill="none">
            <circle cx="700" cy="700" r="450" stroke="oklch(0.75 0.12 85)" strokeWidth="0.6"/>
            <circle cx="700" cy="700" r="560" stroke="oklch(0.65 0.10 85)" strokeWidth="0.4"/>
            <circle cx="700" cy="700" r="650" stroke="oklch(0.55 0.08 85)" strokeWidth="0.25"/>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-7 animate-slide-up">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full gold-bg animate-pulse"/>
                <span className="text-xs tracking-[0.2em] text-[oklch(0.55_0.02_250)] uppercase" style={{ fontFamily: "var(--font-caption)" }}>Outil d&apos;aide à la décision immobilière</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.04]" style={{ fontFamily: "var(--font-heading)" }}>
                Avant d&apos;acheter<br/>ou de vendre,<br/>
                <span className="gold-text italic">estimez l&apos;impact</span><br/>
                financier réel.
              </h1>
              <p className="text-[oklch(0.52_0.02_250)] text-base max-w-lg leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Simulation immédiate, rapport professionnel PDF, paiement unique sécurisé.
                Un outil conçu pour les décisions qui comptent vraiment.
              </p>
              <div className="flex flex-wrap gap-5">
                {[{ icon: Lock, label: "Paiement sécurisé Stripe" }, { icon: Zap, label: "Rapport en moins de 1 min" }, { icon: Shield, label: "Données confidentielles" }].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-[oklch(0.45_0.02_250)] text-xs" style={{ fontFamily: "var(--font-caption)" }}>
                    <Icon className="w-3.5 h-3.5 gold-text"/>{label}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <Button onClick={scrollToSim} className="gold-bg text-[#0B1628] font-black px-8 py-6 rounded-none hover:opacity-90 text-base gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Lancer ma simulation gratuite <ArrowRight className="w-4 h-4"/>
                </Button>
                <span className="text-[oklch(0.40_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>Rapport dès 9,99 €</span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-2">
                  {["S","M","T","L"].map((l, i) => (
                    <div key={i} className="w-7 h-7 rounded-full gold-bg flex items-center justify-center text-[#0B1628] text-xs font-black border-2 border-[#0B1628]" style={{ fontFamily: "var(--font-heading)" }}>{l}</div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">{[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 fill-[#C9A84C] text-[#C9A84C]"/>)}</div>
                  <span className="text-[oklch(0.50_0.02_250)] text-xs" style={{ fontFamily: "var(--font-caption)" }}>+200 professionnels satisfaits</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-10 bg-[oklch(0.75_0.12_85)]/5 rounded-full blur-3xl"/>
                <img src={CDN.hero} alt="Jevalis Dashboard" className="w-full max-w-lg object-contain drop-shadow-2xl relative z-10"/>
              </div>
            </div>
          </div>
          <div className="text-center mt-14 pb-8">
            <button onClick={() => document.getElementById("stats-section")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex flex-col items-center gap-2 text-[oklch(0.35_0.02_250)] hover:text-[oklch(0.55_0.02_250)] transition-colors">
              <span className="text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-caption)" }}>Découvrir</span>
              <ChevronDown className="w-5 h-5 animate-bounce"/>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats-section" className="border-t border-b border-[oklch(0.15_0.03_250)] py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          <div ref={stat1.ref}><p className="text-5xl font-black gold-text" style={{ fontFamily: "var(--font-heading)" }}>{stat1.count}</p><p className="text-xs tracking-[0.15em] text-[oklch(0.45_0.02_250)] mt-2 uppercase" style={{ fontFamily: "var(--font-caption)" }}>Pays couverts</p></div>
          <div ref={stat2.ref}><p className="text-5xl font-black gold-text" style={{ fontFamily: "var(--font-heading)" }}>{stat2.count},99 €</p><p className="text-xs tracking-[0.15em] text-[oklch(0.45_0.02_250)] mt-2 uppercase" style={{ fontFamily: "var(--font-caption)" }}>Paiement unique</p></div>
          <div ref={stat3.ref}><p className="text-5xl font-black gold-text" style={{ fontFamily: "var(--font-heading)" }}>{stat3.count} <span className="text-2xl">min</span></p><p className="text-xs tracking-[0.15em] text-[oklch(0.45_0.02_250)] mt-2 uppercase" style={{ fontFamily: "var(--font-caption)" }}>Rapport livré</p></div>
        </div>
      </section>

      {/* Why Jevalis */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-divider mx-auto mb-8"/>
            <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>Pourquoi choisir <span className="gold-text">Jevalis</span> ?</h2>
            <p className="text-[oklch(0.50_0.02_250)] mt-4 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>La seule plateforme qui vous donne une vision complète de votre fiscalité immobilière européenne en quelques minutes.</p>
          </div>
          <div ref={r1.ref} className={`grid md:grid-cols-3 gap-6 mb-14 transition-all duration-700 ${r1.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {[
              { icon: DollarSign, title: "Simulation instantanée", desc: "Résultats immédiats en quelques clics. Estimation précise de vos frais de notaire, plus-value et impôts pour décisions éclairées." },
              { icon: Settings, title: "Calculs certifiés", desc: "Moteur de calcul conforme aux barèmes fiscaux officiels de 6 pays européens. Fiabilité garantie pour projets transfrontaliers." },
              { icon: BarChart3, title: "Rapports professionnels", desc: "Documents PDF détaillés avec graphiques, comparaisons et recommandations. Prêt à présenter à votre banquier ou notaire." },
            ].map((f, i) => (
              <div key={i} className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-8 space-y-4 hover-lift hover:border-[oklch(0.35_0.06_85)] transition-colors duration-300">
                <div className="w-12 h-12 border border-[oklch(0.25_0.03_250)] flex items-center justify-center"><f.icon className="w-5 h-5 gold-text"/></div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{f.title}</h3>
                <p className="text-sm text-[oklch(0.50_0.02_250)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-black gold-text italic mb-4" style={{ fontFamily: "var(--font-heading)" }}>Tarifs transparents</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {[{ label: "Simulation", price: "Gratuite", hl: false }, { label: "Pack Complet ebook + PDF", price: "9,99 €", hl: true }, { label: "Rapport Premium", price: "39,99 €", hl: false }].map(({ label, price, hl }) => (
                <div key={label} className={`px-6 py-3 border text-sm ${hl ? "gold-border gold-text font-bold" : "border-[oklch(0.22_0.03_250)] text-[oklch(0.55_0.02_250)]"}`} style={{ fontFamily: "var(--font-caption)" }}>{label} <span className="font-bold ml-1">{price}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-[oklch(0.15_0.03_250)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-divider mx-auto mb-8"/>
            <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>Un outil pensé pour vous</h2>
            <p className="text-[oklch(0.50_0.02_250)] mt-4 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>Transformez une décision complexe en analyse claire et actionnable, en moins de 3 minutes.</p>
          </div>
          <div ref={r2.ref} className={`grid md:grid-cols-3 gap-6 transition-all duration-700 ${r2.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {[
              { icon: TrendingUp, title: "Analyse financière complète", desc: "Plus-value, fiscalité, frais de notaire, coût total du crédit — tout calculé dans un rapport professionnel prêt à l'emploi." },
              { icon: MapPin, title: "6 pays, 1 outil", desc: "France, Suisse, Belgique, Luxembourg, Pays-Bas, Allemagne. Chaque simulation intègre la fiscalité locale officielle." },
              { icon: Zap, title: "Résultat immédiat", desc: "Remplissez le formulaire, payez, recevez votre rapport PDF professionnel en quelques minutes. Aucune attente." },
            ].map((f, i) => (
              <div key={i} className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-8 space-y-4 hover-lift hover:border-[oklch(0.35_0.06_85)] transition-colors duration-300">
                <f.icon className="w-6 h-6 gold-text"/>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{f.title}</h3>
                <p className="text-sm text-[oklch(0.50_0.02_250)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-24 border-t border-[oklch(0.15_0.03_250)]">
        <div className="max-w-6xl mx-auto px-6">
          <div ref={r3.ref} className={`grid lg:grid-cols-2 gap-16 items-center transition-all duration-700 ${r3.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "var(--font-heading)" }}><span className="text-white">Couverture</span><br/><span className="gold-text italic">européenne</span></h2>
              <p className="text-[oklch(0.50_0.02_250)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>Jevalis intègre les spécificités fiscales de chaque pays couvert. Frais de notaire, plus-value immobilière, impôt sur les gains — chaque simulation est adaptée avec les barèmes officiels en vigueur.</p>
              <div className="grid grid-cols-2 gap-3">
                {[{ flag: "🇫🇷", name: "France", detail: "Frais ~7–8%" }, { flag: "🇨🇭", name: "Suisse", detail: "Canton par canton" }, { flag: "🇧🇪", name: "Belgique", detail: "12,5% droits" }, { flag: "🇱🇺", name: "Luxembourg", detail: "7% droits" }, { flag: "🇳🇱", name: "Pays-Bas", detail: "6% mutation" }, { flag: "🇩🇪", name: "Allemagne", detail: "3,5–6,5% /Land" }].map((c) => (
                  <div key={c.name} className="flex items-center gap-3 bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-4 hover:border-[oklch(0.30_0.05_85)] transition-colors">
                    <span className="text-xl">{c.flag}</span>
                    <div><div className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-heading)" }}>{c.name}</div><div className="text-[oklch(0.45_0.02_250)] text-xs" style={{ fontFamily: "var(--font-caption)" }}>{c.detail}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block"><img src={CDN.map} alt="Couverture européenne" className="w-full max-w-md mx-auto object-contain opacity-90"/></div>
          </div>
        </div>
      </section>

      {/* Report */}
      <section className="py-24 border-t border-[oklch(0.15_0.03_250)]">
        <div className="max-w-6xl mx-auto px-6">
          <div ref={r4.ref} className={`grid lg:grid-cols-2 gap-16 items-center transition-all duration-700 ${r4.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="hidden lg:block"><img src={CDN.report} alt="Rapport professionnel" className="w-full max-w-md mx-auto object-contain drop-shadow-2xl"/></div>
            <div className="space-y-8">
              <div className="section-divider"/>
              <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "var(--font-heading)" }}><span className="text-white">Un rapport</span><br/><span className="gold-text italic">professionnel</span></h2>
              <p className="text-[oklch(0.50_0.02_250)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>Votre rapport inclut une analyse détaillée de l&apos;impact financier de votre opération. Un document que vous pouvez présenter directement à votre notaire, banquier ou conseiller fiscal.</p>
              <ul className="space-y-3">
                {["Frais de notaire détaillés et justifiés", "Calcul de la plus-value nette après impôts", "Impact fiscal complet selon votre juridiction", "Coût total du crédit et mensualité optimisée", "Recommandations personnalisées d'optimisation"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3"><Check className="w-4 h-4 gold-text flex-shrink-0"/><span className="text-[oklch(0.65_0.02_250)] text-sm" style={{ fontFamily: "var(--font-body)" }}>{item}</span></li>
                ))}
              </ul>
              <Button onClick={scrollToSim} className="gold-bg text-[#0B1628] font-black px-8 py-5 rounded-none hover:opacity-90 gap-2" style={{ fontFamily: "var(--font-heading)" }}>Obtenir mon rapport <ArrowRight className="w-4 h-4"/></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Simulation Form */}
      <section ref={simulationRef} className="py-24 border-t border-[oklch(0.15_0.03_250)]" id="simulation">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-divider mx-auto mb-8"/>
            <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>Lancer votre simulation</h2>
            <p className="text-[oklch(0.50_0.02_250)] mt-4 max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>Simulation gratuite · Rapport PDF professionnel envoyé immédiatement après paiement.</p>
          </div>
          <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-8 md:p-12 max-w-2xl mx-auto"><SimulationForm /></div>
        </div>
      </section>

      {/* Ebook */}
      <section className="py-24 border-t border-[oklch(0.15_0.03_250)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="book-3d-wrapper">
                <div className="relative">
                  <div className="book-glow"/>
                  <div className="book-3d">
                    <div className="book-3d-cover"><img src="/images/ebook-cover.jpg" alt="Guide Fiscal" className="w-56 md:w-72"/></div>
                    <div className="book-3d-pages"/><div className="book-3d-bottom"/>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-[oklch(0.70_0.20_70)]/10 border border-[oklch(0.70_0.20_70)]/30 px-4 py-2 rounded-full mb-4">
                <span className="text-[oklch(0.70_0.20_70)] text-sm font-bold" style={{ fontFamily: "var(--font-caption)" }}>📚 OFFRE DE LANCEMENT -50%</span>
              </div>
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-4 h-4 text-[oklch(0.55_0.02_250)]"/>
                <span className="text-xs text-[oklch(0.55_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>Offre expire dans :</span>
                {[{ v: countdown.h, l: "h" }, { v: countdown.m, l: "m" }, { v: countdown.s, l: "s" }].map(({ v, l }) => (
                  <span key={l} className="bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.03_250)] px-2 py-0.5 text-xs font-mono text-white">{String(v).padStart(2, "0")}{l}</span>
                ))}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5" style={{ fontFamily: "var(--font-heading)" }}>Guide Fiscal Immobilier Européen</h2>
              <p className="text-[oklch(0.60_0.02_250)] text-lg mb-6 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>Tout comprendre avant d&apos;acheter ou de vendre dans 6 pays européens. 20 pages avec tableaux comparatifs, exemples chiffrés et conseils d&apos;optimisation fiscale.</p>
              <ul className="space-y-3 mb-7">
                {["6 pays couverts : France, Suisse, Belgique, Luxembourg, Pays-Bas, Allemagne", "Tableaux comparatifs des frais de notaire et fiscalité", "Exemples chiffrés avec cas pratiques réels", "Checklist complète avant signature chez le notaire", "Conseils d'optimisation fiscale légale"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3"><Check className="w-5 h-5 text-[oklch(0.70_0.20_70)] flex-shrink-0 mt-0.5"/><span className="text-[oklch(0.65_0.02_250)] text-sm" style={{ fontFamily: "var(--font-body)" }}>{item}</span></li>
                ))}
              </ul>
              <div className="flex items-baseline gap-4 mb-7">
                <span className="text-4xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>9,99 €</span>
                <span className="text-xl text-[oklch(0.50_0.02_250)] line-through">19,99 €</span>
                <span className="text-sm text-green-400 font-bold">Vous économisez 10 €</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-[oklch(0.70_0.20_70)] hover:bg-[oklch(0.65_0.20_70)] text-white font-black px-8 gap-2" style={{ fontFamily: "var(--font-heading)" }} disabled={ebookCheckout.isPending} onClick={() => ebookCheckout.mutate({})}>
                  {ebookCheckout.isPending ? "Redirection..." : <>Acheter maintenant <ArrowRight className="w-5 h-5"/></>}
                </Button>
                <Button size="lg" variant="outline" className="border-[oklch(0.25_0.03_250)] text-white hover:bg-[oklch(0.18_0.03_250)]" style={{ fontFamily: "var(--font-heading)" }} onClick={() => window.location.href = "/apercu-ebook"}>Aperçu gratuit</Button>
              </div>
              <p className="text-[oklch(0.50_0.02_250)] text-xs mt-5" style={{ fontFamily: "var(--font-caption)" }}>🔒 Stripe · 📧 Livraison immédiate · ✅ Satisfait ou remboursé 7 jours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 border-t border-[oklch(0.15_0.03_250)]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[oklch(0.35_0.02_250)] text-xs mb-7 uppercase tracking-widest" style={{ fontFamily: "var(--font-caption)" }}>Utilisé par des professionnels de l&apos;immobilier et de la finance</p>
          <div className="flex justify-center items-center gap-12 flex-wrap opacity-20">
            {["BNP Paribas", "Société Générale", "Crédit Suisse"].map((n) => <div key={n} className="text-[oklch(0.60_0.02_250)] text-xl font-black" style={{ fontFamily: "var(--font-heading)" }}>{n}</div>)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 border-t border-[oklch(0.15_0.03_250)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10"><div className="section-divider mx-auto mb-6"/><h2 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>Ce que disent nos clients</h2></div>
          <div ref={r5.ref} className={`grid md:grid-cols-3 gap-6 transition-all duration-700 ${r5.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {[
              { name: "Sophie M.", loc: "Genève, Suisse", text: "Très utile pour comparer les frais de notaire entre la France et la Suisse. Le rapport m'a fait économiser plusieurs milliers d'euros sur ma négociation." },
              { name: "Marc L.", loc: "Paris, France", text: "Simulation précise et rapide. J'ai pu anticiper tous les coûts avant de signer chez le notaire. Un outil que je recommande à tout investisseur." },
              { name: "Thomas D.", loc: "Bruxelles, Belgique", text: "Indispensable pour tout investisseur transfrontalier. Les calculs sont clairs et le guide PDF est très complet. Rapport reçu en moins de 2 minutes." },
            ].map((t, i) => (
              <div key={i} className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-6">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_,j) => <span key={j} className="text-[oklch(0.70_0.20_70)] text-sm">★</span>)}</div>
                <p className="text-[oklch(0.62_0.02_250)] mb-5 text-sm leading-relaxed italic" style={{ fontFamily: "var(--font-body)" }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gold-bg flex items-center justify-center text-[#0B1628] font-black text-sm">{t.name[0]}</div>
                  <div><div className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-heading)" }}>{t.name}</div><div className="text-[oklch(0.45_0.02_250)] text-xs" style={{ fontFamily: "var(--font-caption)" }}>{t.loc}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-[oklch(0.15_0.03_250)]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14"><div className="section-divider mx-auto mb-8"/><h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "var(--font-heading)" }}><span className="text-white">Questions </span><span className="gold-text italic">fréquentes</span></h2></div>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: "Comment fonctionne la simulation Jevalis ?", a: "Vous renseignez les informations de votre opération immobilière (pays, prix d'achat, prix de vente, date d'acquisition). Notre moteur de calcul analyse instantanément l'impact financier en intégrant la fiscalité locale, les frais de notaire, la plus-value nette et le coût total du crédit. Vous recevez un rapport PDF professionnel complet." },
              { q: "Quels pays sont couverts ?", a: "Jevalis couvre six pays : France, Suisse (cantons inclus), Belgique, Luxembourg, Pays-Bas et Allemagne. Chaque simulation intègre la réglementation fiscale et les barèmes officiels en vigueur." },
              { q: "Que contient le rapport PDF ?", a: "Frais de notaire détaillés, plus-value nette après impôts, impact fiscal complet, coût total du crédit, et recommandations personnalisées. Document professionnel présentable à votre notaire ou conseiller." },
              { q: "Le paiement est-il sécurisé ?", a: "Oui. Paiements traités par Stripe, leader mondial du paiement sécurisé. Vos données bancaires ne transitent jamais par nos serveurs. Paiements uniques, sans abonnement. Satisfait ou remboursé 7 jours." },
              { q: "En combien de temps reçoit-on le rapport ?", a: "Instantanément après paiement. Livré par email et téléchargeable depuis votre espace compte. Processus complet en moins de 3 minutes." },
              { q: "Les résultats sont-ils fiables ?", a: "Jevalis utilise les barèmes fiscaux officiels mis à jour régulièrement. Nos simulations sont indicatives et constituent une aide à la décision. Validation par un professionnel recommandée avant décision définitive." },
              { q: "Puis-je accéder à mes rapports plus tard ?", a: "Oui. En créant un compte gratuit, retrouvez toutes vos simulations et téléchargez vos rapports à tout moment depuis votre espace personnel." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] px-6">
                <AccordionTrigger className="text-white text-left text-sm font-bold py-5 hover:no-underline hover:gold-text" style={{ fontFamily: "var(--font-heading)" }}>{item.q}</AccordionTrigger>
                <AccordionContent className="text-[oklch(0.55_0.02_250)] text-sm leading-relaxed pb-5" style={{ fontFamily: "var(--font-body)" }}>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 border-t border-[oklch(0.15_0.03_250)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>Prêt à prendre une <span className="gold-text italic">décision éclairée</span> ?</h2>
          <p className="text-[oklch(0.50_0.02_250)] mb-8 max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>Rejoignez les 200+ professionnels qui utilisent Jevalis pour anticiper l&apos;impact financier de leurs opérations immobilières.</p>
          <Button onClick={scrollToSim} className="gold-bg text-[#0B1628] font-black px-10 py-6 rounded-none hover:opacity-90 text-base gap-2" style={{ fontFamily: "var(--font-heading)" }}>Lancer ma simulation gratuite <ArrowRight className="w-5 h-5"/></Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[oklch(0.15_0.03_250)] py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-10 mb-10">
            {[{ icon: Shield, label: "Paiement sécurisé Stripe" }, { icon: Zap, label: "Livraison immédiate email" }, { icon: FileText, label: "Données confidentielles" }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[oklch(0.45_0.02_250)]"><Icon className="w-4 h-4"/><span className="text-sm" style={{ fontFamily: "var(--font-caption)" }}>{label}</span></div>
            ))}
          </div>
          <div className="text-center space-y-4">
            <p className="font-black text-lg tracking-widest" style={{ fontFamily: "var(--font-heading)" }}><span className="text-white">JE</span><span className="gold-text">V</span><span className="text-white">ALIS</span></p>
            <p className="text-[oklch(0.40_0.02_250)] text-xs max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "var(--font-caption)" }}>Jevalis fournit des simulations indicatives à des fins d&apos;aide à la décision. Les résultats ne constituent pas un conseil fiscal ou juridique.</p>
            <div className="flex justify-center gap-6 text-xs text-[oklch(0.45_0.02_250)]">
              <Link href="/blog"><span className="hover:text-[oklch(0.70_0.20_70)] transition-colors cursor-pointer">Blog & FAQ</span></Link>
              <Link href="/mentions-legales"><span className="hover:text-[oklch(0.70_0.20_70)] transition-colors cursor-pointer">Mentions légales</span></Link>
              <Link href="/confidentialite"><span className="hover:text-[oklch(0.70_0.20_70)] transition-colors cursor-pointer">Confidentialité</span></Link>
              <Link href="/cgv"><span className="hover:text-[oklch(0.70_0.20_70)] transition-colors cursor-pointer">CGV</span></Link>
            </div>
            <p className="text-[oklch(0.35_0.02_250)] text-xs" style={{ fontFamily: "var(--font-caption)" }}>© 2026 Jevalis. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
