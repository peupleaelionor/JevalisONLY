import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Download, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function EbookPreview() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const ebookCheckout = trpc.stripe.createEbookCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: () => {
      window.location.href = '/login';
    },
  });

  const handlePurchase = () => {
    setIsRedirecting(true);
    ebookCheckout.mutate({});
  };

  return (
    <div className="min-h-screen bg-[#0B1628]">
      {/* Navigation */}
      <nav className="border-b border-[oklch(0.18_0.03_250)] bg-[#0B1628]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                Retour
              </span>
            </Link>
          <span
            className="font-bold text-lg tracking-widest"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="text-white">JE</span><span className="gold-text">V</span><span className="text-white">ALIS</span>
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 border-b border-[oklch(0.18_0.03_250)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[oklch(0.70_0.20_70)]/10 border border-[oklch(0.70_0.20_70)]/30 px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-[oklch(0.70_0.20_70)]" />
            <span className="text-[oklch(0.70_0.20_70)] text-sm font-semibold" style={{ fontFamily: "var(--font-caption)" }}>
              APERÇU GRATUIT
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
            Guide Fiscal Immobilier Européen
          </h1>
          
          <p className="text-[oklch(0.60_0.02_250)] text-lg mb-8 max-w-2xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
            Découvrez un extrait de notre guide complet de 20 pages pour maîtriser la fiscalité immobilière dans 6 pays européens          </p>

          <div className="flex items-center justify-center gap-8 text-sm text-[oklch(0.50_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>
            <span>📄 20 pages</span>
            <span>🌍 6 pays</span>
            <span>💰 9,99 € (-50%)</span>
          </div>
        </div>
      </section>

      {/* Table des matières */}
      <section className="py-16 border-b border-[oklch(0.18_0.03_250)]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-heading)" }}>
            📚 Table des matières
          </h2>
          
          <div className="space-y-4">
            {[
              { page: "1-2", title: "Introduction : Pourquoi ce guide ?", free: true },
              { page: "3-4", title: "Chapitre 1 : France - Fiscalité et frais de notaire", free: true },
              { page: "5-6", title: "Chapitre 2 : Suisse - Spécificités cantonales", free: false },
              { page: "7-8", title: "Chapitre 3 : Belgique - Régions et taxation", free: false },
              { page: "9-10", title: "Chapitre 4 : Luxembourg - Avantages fiscaux", free: false },
              { page: "11-12", title: "Chapitre 5 : Pays-Bas - Système hypothécaire", free: false },
              { page: "13-14", title: "Chapitre 6 : Allemagne - Grunderwerbsteuer", free: false },
              { page: "15-18", title: "Tableaux comparatifs détaillés", free: false },
              { page: "19-22", title: "Exemples chiffrés et cas pratiques", free: false },
              { page: "23-25", title: "Checklist notaire et optimisation fiscale", free: false },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  item.free
                    ? "bg-[oklch(0.13_0.025_250)] border-[oklch(0.20_0.03_250)]"
                    : "bg-[oklch(0.10_0.02_250)] border-[oklch(0.15_0.025_250)] opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-[oklch(0.50_0.02_250)] text-sm font-mono" style={{ fontFamily: "var(--font-caption)" }}>
                    p. {item.page}
                  </span>
                  <span className="text-white" style={{ fontFamily: "var(--font-body)" }}>
                    {item.title}
                  </span>
                </div>
                {item.free ? (
                  <span className="text-xs bg-[oklch(0.70_0.20_70)]/20 text-[oklch(0.70_0.20_70)] px-3 py-1 rounded-full font-semibold">
                    Gratuit
                  </span>
                ) : (
                  <span className="text-xs bg-[oklch(0.20_0.03_250)] text-[oklch(0.45_0.02_250)] px-3 py-1 rounded-full">
                    🔒 Premium
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extrait France */}
      <section className="py-16 border-b border-[oklch(0.18_0.03_250)]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-heading)" }}>
            📖 Extrait : Chapitre France
          </h2>
          
          <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-8 rounded-lg space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                1.1 Frais de notaire en France
              </h3>
              <p className="text-[oklch(0.65_0.02_250)] leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
                Les frais de notaire représentent environ <strong className="text-white">7 à 8% du prix d'achat</strong> pour un bien ancien, 
                et <strong className="text-white">2 à 3%</strong> pour un bien neuf. Ces frais se décomposent en trois parties principales :
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[oklch(0.70_0.20_70)] flex-shrink-0 mt-1" />
                  <span className="text-[oklch(0.65_0.02_250)]" style={{ fontFamily: "var(--font-body)" }}>
                    <strong className="text-white">Droits de mutation</strong> (environ 5,8%) : reversés à l'État et aux collectivités locales
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[oklch(0.70_0.20_70)] flex-shrink-0 mt-1" />
                  <span className="text-[oklch(0.65_0.02_250)]" style={{ fontFamily: "var(--font-body)" }}>
                    <strong className="text-white">Émoluments du notaire</strong> (environ 1%) : rémunération réglementée du notaire
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[oklch(0.70_0.20_70)] flex-shrink-0 mt-1" />
                  <span className="text-[oklch(0.65_0.02_250)]" style={{ fontFamily: "var(--font-body)" }}>
                    <strong className="text-white">Frais divers</strong> (environ 0,2%) : débours et formalités administratives
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-[oklch(0.10_0.02_250)] border border-[oklch(0.18_0.03_250)] p-6 rounded-lg">
              <h4 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                💡 Exemple concret
              </h4>
              <p className="text-[oklch(0.65_0.02_250)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Pour un appartement ancien à <strong className="text-white">300 000 €</strong> à Paris, 
                les frais de notaire s'élèvent à environ <strong className="text-white">22 500 €</strong> (7,5%), 
                portant le coût total à <strong className="text-white">322 500 €</strong>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                1.2 Plus-value immobilière
              </h3>
              <p className="text-[oklch(0.65_0.02_250)] leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)" }}>
                La plus-value immobilière est imposée à <strong className="text-white">19%</strong> au titre de l'impôt sur le revenu, 
                auxquels s'ajoutent <strong className="text-white">17,2%</strong> de prélèvements sociaux, 
                soit un taux global de <strong className="text-white">36,2%</strong>.
              </p>
              <p className="text-[oklch(0.65_0.02_250)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                Toutefois, un système d'abattement pour durée de détention permet une exonération totale après :
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.70_0.20_70)]">•</span>
                  <span className="text-[oklch(0.65_0.02_250)]" style={{ fontFamily: "var(--font-body)" }}>
                    <strong className="text-white">22 ans</strong> pour l'impôt sur le revenu
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[oklch(0.70_0.20_70)]">•</span>
                  <span className="text-[oklch(0.65_0.02_250)]" style={{ fontFamily: "var(--font-body)" }}>
                    <strong className="text-white">30 ans</strong> pour les prélèvements sociaux
                  </span>
                </li>
              </ul>
            </div>

            <div className="border-t border-[oklch(0.18_0.03_250)] pt-6 mt-6">
              <p className="text-[oklch(0.50_0.02_250)] text-sm italic text-center" style={{ fontFamily: "var(--font-caption)" }}>
                📄 Cet extrait représente environ 15% du contenu total du guide. 
                Débloquez les 5 autres pays et tous les tableaux comparatifs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ce que vous obtenez */}
      <section className="py-16 border-b border-[oklch(0.18_0.03_250)]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center" style={{ fontFamily: "var(--font-heading)" }}>
            ✨ Ce que vous obtenez avec le guide complet
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: "🇫🇷",
                title: "6 pays couverts",
                desc: "France, Suisse, Belgique, Luxembourg, Pays-Bas, Allemagne avec toutes les spécificités locales"
              },
              {
                icon: "📊",
                title: "Tableaux comparatifs",
                desc: "Comparaison directe des frais de notaire, fiscalité et coûts par pays"
              },
              {
                icon: "💰",
                title: "Exemples chiffrés",
                desc: "Cas pratiques détaillés avec calculs réels pour chaque pays"
              },
              {
                icon: "✅",
                title: "Checklist notaire",
                desc: "Liste complète des documents et démarches avant signature"
              },
              {
                icon: "🎯",
                title: "Optimisation fiscale",
                desc: "Conseils pour réduire légalement vos impôts et frais"
              },
              {
                icon: "📱",
                title: "Format PDF",
                desc: "Téléchargeable, imprimable, consultable sur tous vos appareils"
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-6 rounded-lg hover:border-[oklch(0.75_0.12_85)] transition-colors"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  {item.title}
                </h3>
                <p className="text-[oklch(0.60_0.02_250)] text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 border-t border-[oklch(0.18_0.03_250)]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12" style={{ fontFamily: "var(--font-heading)" }}>
            Ce que disent nos clients
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sophie M.",
                location: "Genève",
                rating: 5,
                text: "Guide très complet qui m'a permis de comparer les frais de notaire entre la France et la Suisse. Les tableaux comparatifs sont clairs et précis."
              },
              {
                name: "Marc L.",
                location: "Paris",
                rating: 5,
                text: "Excellent rapport qualité-prix. Les exemples chiffrés m'ont aidé à anticiper tous les coûts avant de signer chez le notaire."
              },
              {
                name: "Thomas D.",
                location: "Bruxelles",
                rating: 5,
                text: "Indispensable pour tout investisseur transfrontalier. La checklist avant signature est particulièrement utile."
              }
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-6 rounded-lg hover:border-[oklch(0.75_0.12_85)] transition-colors"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <span key={j} className="text-[oklch(0.70_0.20_70)] text-lg">★</span>
                  ))}
                </div>
                <p className="text-[oklch(0.70_0.02_250)] mb-4 italic" style={{ fontFamily: "var(--font-body)" }}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[oklch(0.70_0.20_70)]/20 flex items-center justify-center">
                    <span className="text-[oklch(0.70_0.20_70)] font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                      {testimonial.name}
                    </p>
                    <p className="text-[oklch(0.50_0.02_250)] text-xs" style={{ fontFamily: "var(--font-caption)" }}>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-8 rounded-lg">
            <div className="inline-block bg-[oklch(0.70_0.20_70)]/10 border border-[oklch(0.70_0.20_70)]/30 px-4 py-2 rounded-full mb-6">
              <span className="text-[oklch(0.70_0.20_70)] text-sm font-semibold" style={{ fontFamily: "var(--font-caption)" }}>
                🎁 OFFRE DE LANCEMENT -50%
              </span>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Obtenez le guide complet maintenant
            </h2>

            <div className="flex items-baseline justify-center gap-4 mb-6">
              <span className="text-5xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>9,99 €</span>
              <span className="text-2xl text-[oklch(0.50_0.02_250)] line-through" style={{ fontFamily: "var(--font-body)" }}>19,99 €</span>
            </div>

            <p className="text-[oklch(0.60_0.02_250)] mb-8" style={{ fontFamily: "var(--font-body)" }}>
              20 pages • 6 pays • Tableaux comparatifs • Exemples chiffrés • Checklist complète
            </p>

            <Button
              size="lg"
              className="bg-[oklch(0.70_0.20_70)] hover:bg-[oklch(0.65_0.20_70)] text-white font-semibold px-12 py-6 text-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
              style={{ fontFamily: "var(--font-heading)" }}
              disabled={isRedirecting || ebookCheckout.isPending}
              onClick={handlePurchase}
            >
              {isRedirecting || ebookCheckout.isPending ? (
                "Redirection vers le paiement..."
              ) : (
                <>
                  <Download className="mr-2 w-5 h-5" />
                  Acheter maintenant
                </>
              )}
            </Button>

            <p className="text-[oklch(0.50_0.02_250)] text-sm mt-6" style={{ fontFamily: "var(--font-caption)" }}>
              🔒 Paiement sécurisé par Stripe • 📧 Livraison immédiate par email
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
