import { useState } from "react";
import { ChevronDown, Search, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  readTime: number;
  keywords: string[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "frais-notaire-france",
    title: "Comprendre les frais de notaire en France : barème 2025",
    excerpt: "Les frais de notaire représentent un coût important lors de l'achat d'un bien immobilier. Découvrez comment ils sont calculés et comment les optimiser.",
    content: `Les frais de notaire en France suivent un barème réglementé qui varie selon le prix d'acquisition du bien. En 2025, ce barème s'applique comme suit :

- Jusqu'à 6 500 € : 3,87%
- De 6 500 € à 17 000 € : 1,596%
- De 17 000 € à 60 000 € : 1,064%
- Au-delà de 60 000 € : 0,799%

Ces frais incluent les émoluments du notaire, les taxes d'enregistrement, les débours et les frais divers. Pour un bien de 300 000 €, les frais de notaire s'élèvent généralement à environ 24 000 €, soit 8% du prix d'achat.

Il est important de noter que ces frais sont négociables dans certains cas, notamment pour les acquisitions de biens neufs ou les transactions importantes. Consultez un notaire pour connaître les possibilités de réduction.`,
    category: "France",
    date: "2025-02-07",
    author: "Équipe Jevalis",
    readTime: 5,
    keywords: ["frais notaire", "France", "achat immobilier", "barème 2025"],
  },
  {
    id: "plus-value-immobiliere-suisse",
    title: "Imposition de la plus-value immobilière en Suisse : canton par canton",
    excerpt: "La fiscalité sur les plus-values immobilières varie considérablement selon le canton suisse. Apprenez comment optimiser votre fiscalité.",
    content: `En Suisse, l'imposition des plus-values immobilières dépend du canton et du temps de détention du bien. Contrairement à la France, la Suisse offre une certaine flexibilité fiscale selon le lieu de résidence.

**Taux d'imposition par canton (2025) :**
- Genève : 8% (réduit à 2% après 25 ans de détention)
- Vaud : 7% (réduit à 1,75% après 15 ans)
- Zurich : 6% (réduit à 1,5% après 10 ans)
- Zoug : 3% (très avantageux)

**Stratégies d'optimisation :**
1. Prolonger la durée de détention : plus vous gardez le bien longtemps, plus la réduction d'impôt est importante
2. Considérer un changement de canton : certains cantons offrent une fiscalité plus avantageuse
3. Utiliser les déductions : les frais de rénovation et d'amélioration peuvent être déduits

Pour un bien acheté 500 000 CHF et vendu 700 000 CHF après 15 ans à Vaud, l'impôt sur la plus-value serait d'environ 3 500 CHF au lieu de 14 000 CHF sans réduction.`,
    category: "Suisse",
    date: "2025-02-06",
    author: "Équipe Jevalis",
    readTime: 7,
    keywords: ["plus-value", "Suisse", "imposition", "canton"],
  },
  {
    id: "fiscalite-belgique-luxembourg",
    title: "Fiscalité immobilière en Belgique et Luxembourg : comparaison",
    excerpt: "Comparez les régimes fiscaux belge et luxembourgeois pour optimiser vos investissements immobiliers transfrontaliers.",
    content: `La Belgique et le Luxembourg offrent des régimes fiscaux distincts pour les transactions immobilières. Comprendre ces différences est crucial pour les investisseurs transfrontaliers.

**Belgique :**
- Droits d'enregistrement : 12,5% du prix d'achat
- Plus-value immobilière : 16,5% si détention < 5 ans, 0% si > 5 ans (résidence principale exonérée)
- Frais de notaire : ~1,2% du prix d'achat

**Luxembourg :**
- Droits d'enregistrement : 7% du prix d'achat
- Plus-value immobilière : 0% (exonérée pour résidence principale)
- Frais de notaire : ~1% du prix d'achat

**Exemple comparatif :**
Pour l'achat d'un bien à 400 000 € :
- Belgique : frais totaux ~52 000 € (13%)
- Luxembourg : frais totaux ~28 000 € (7%)

Le Luxembourg offre une fiscalité plus avantageuse, notamment pour les plus-values. Cependant, la Belgique propose une exonération complète après 5 ans de détention.`,
    category: "Belgique & Luxembourg",
    date: "2025-02-05",
    author: "Équipe Jevalis",
    readTime: 6,
    keywords: ["Belgique", "Luxembourg", "fiscalité", "comparaison"],
  },
  {
    id: "investissement-immobilier-pays-bas",
    title: "Investissement immobilier aux Pays-Bas : guide fiscal complet",
    excerpt: "Les Pays-Bas offrent des opportunités intéressantes pour l'investissement immobilier. Découvrez les spécificités fiscales néerlandaises.",
    content: `Les Pays-Bas attirent de nombreux investisseurs immobiliers grâce à leur stabilité économique et leur fiscalité compétitive. Voici ce que vous devez savoir.

**Frais d'acquisition :**
- Droits de mutation : 6% du prix d'achat
- Frais de notaire : ~0,8% du prix d'achat
- Frais totaux : ~6,8%

**Imposition des plus-values :**
- Détention < 2 ans : 30% d'imposition
- Détention 2-5 ans : 20% d'imposition
- Détention > 5 ans : 0% (résidence principale exonérée)

**Avantages pour les investisseurs :**
1. Marché immobilier stable et transparent
2. Bonne rentabilité locative (4-5% brut)
3. Fiscalité favorable après 5 ans
4. Infrastructure juridique solide

**Exemple d'investissement :**
Achat d'un bien à 300 000 € aux Pays-Bas :
- Frais d'acquisition : ~20 400 €
- Revente après 6 ans à 350 000 € : 0% d'impôt sur la plus-value
- Rendement net : excellent`,
    category: "Pays-Bas",
    date: "2025-02-04",
    author: "Équipe Jevalis",
    readTime: 6,
    keywords: ["Pays-Bas", "investissement", "fiscalité", "immobilier"],
  },
  {
    id: "fiscalite-allemagne",
    title: "Fiscalité immobilière en Allemagne : droits et impôts",
    excerpt: "L'Allemagne offre un marché immobilier dynamique. Apprenez les règles fiscales allemandes pour optimiser vos investissements.",
    content: `L'Allemagne est l'une des plus grandes économies européennes avec un marché immobilier robuste. Voici les spécificités fiscales à connaître.

**Frais d'acquisition :**
- Droits de mutation (Grunderwerbsteuer) : 3,5% du prix d'achat
- Frais de notaire : ~1,2% du prix d'achat
- Frais totaux : ~4,7%

**Imposition des plus-values :**
- Détention < 10 ans : 26,375% (Solidaritätszuschlag + Kirchensteuer)
- Détention > 10 ans : 0% (exonérée)
- Résidence principale : toujours exonérée

**Avantages du marché allemand :**
1. Marché stable et transparent
2. Forte demande de logements
3. Rendement locatif intéressant (3-4% brut)
4. Fiscalité favorable après 10 ans

**Stratégie d'optimisation :**
Pour un bien acheté 250 000 € en Allemagne et revendu 300 000 € après 11 ans :
- Frais d'acquisition : ~11 750 €
- Impôt sur la plus-value : 0 € (exonéré après 10 ans)
- Rendement net : excellent

L'attente de 10 ans est clé pour optimiser la fiscalité en Allemagne.`,
    category: "Allemagne",
    date: "2025-02-03",
    author: "Équipe Jevalis",
    readTime: 6,
    keywords: ["Allemagne", "fiscalité", "immobilier", "droits mutation"],
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Comment sont calculés les frais de notaire ?",
    answer: "Les frais de notaire suivent un barème réglementé qui varie selon le prix d'acquisition du bien. Ils incluent les émoluments du notaire, les taxes d'enregistrement, les débours et les frais divers. Utilisez Jevalis pour obtenir une estimation précise selon votre pays et votre prix d'achat.",
    category: "Général",
  },
  {
    id: "faq-2",
    question: "Quelle est la différence entre plus-value et gain en capital ?",
    answer: "La plus-value est la différence entre le prix de vente et le prix d'achat d'un bien immobilier. Le gain en capital est le profit réalisé après déduction des frais et des impôts. Jevalis calcule les deux pour vous donner une vision complète de votre rendement.",
    category: "Fiscalité",
  },
  {
    id: "faq-3",
    question: "Comment optimiser la fiscalité sur une vente immobilière ?",
    answer: "Plusieurs stratégies existent : prolonger la durée de détention (réductions d'impôt après X années), effectuer des rénovations (déductions possibles), ou considérer un changement de résidence fiscale. Consultez un expert fiscal pour votre situation spécifique.",
    category: "Optimisation",
  },
  {
    id: "faq-4",
    question: "Jevalis fournit-il des conseils fiscaux ?",
    answer: "Jevalis fournit des estimations basées sur les barèmes fiscaux actuels. Pour des conseils fiscaux personnalisés, consultez un expert-comptable ou un conseiller fiscal agréé dans votre pays.",
    category: "À propos",
  },
  {
    id: "faq-5",
    question: "Quels pays sont couverts par Jevalis ?",
    answer: "Jevalis couvre actuellement la France, la Suisse, la Belgique, le Luxembourg, les Pays-Bas et l'Allemagne. Nous prévoyons d'ajouter d'autres pays européens prochainement.",
    category: "À propos",
  },
  {
    id: "faq-6",
    question: "Comment puis-je télécharger mon rapport de simulation ?",
    answer: "Après avoir complété une simulation, vous recevrez un rapport PDF professionnel par email. Ce rapport détaille tous les calculs et peut être utilisé pour vos dossiers administratifs ou vos consultations avec des experts.",
    category: "Utilisation",
  },
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.01_250)]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[oklch(0.12_0.02_250)] to-[oklch(0.08_0.01_250)] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Blog & FAQ
          </h1>
          <p className="text-[oklch(0.50_0.02_250)] text-lg">
            Guides complets sur la fiscalité immobilière en Europe
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-[oklch(0.50_0.02_250)]" size={20} />
            <Input
              placeholder="Rechercher des articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[oklch(0.13_0.025_250)] border-[oklch(0.20_0.03_250)] text-white placeholder-[oklch(0.40_0.02_250)]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="bg-[oklch(0.70_0.20_70)] hover:bg-[oklch(0.75_0.22_70)] text-black"
            >
              Tous
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "bg-[oklch(0.70_0.20_70)] hover:bg-[oklch(0.75_0.22_70)] text-black" : "border-[oklch(0.20_0.03_250)] text-[oklch(0.50_0.02_250)]"}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        <div className="grid gap-8 mb-16">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-8 rounded-lg hover:border-[oklch(0.70_0.20_70)] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-[oklch(0.70_0.20_70)] text-black text-xs font-semibold rounded-full mb-3">
                    {post.category}
                  </span>
                  <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    {post.title}
                  </h2>
                </div>
              </div>

              <p className="text-[oklch(0.50_0.02_250)] mb-4">{post.excerpt}</p>

              <div className="flex items-center gap-6 text-sm text-[oklch(0.40_0.02_250)] mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(post.date).toLocaleDateString("fr-FR")}
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  {post.author}
                </div>
                <div>{post.readTime} min de lecture</div>
              </div>

              <div className="prose prose-invert max-w-none mb-4">
                <p className="text-[oklch(0.50_0.02_250)] text-sm whitespace-pre-wrap">{post.content.substring(0, 200)}...</p>
              </div>

              <Button
                variant="outline"
                className="border-[oklch(0.70_0.20_70)] text-[oklch(0.70_0.20_70)] hover:bg-[oklch(0.70_0.20_70)] hover:text-black"
              >
                Lire l'article complet
              </Button>
            </article>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center" style={{ fontFamily: "var(--font-heading)" }}>
            Questions Fréquemment Posées
          </h2>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.id}
                className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-[oklch(0.15_0.03_250)] transition-colors"
                >
                  <span className="text-left text-white font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                    {item.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-[oklch(0.70_0.20_70)] transition-transform ${
                      expandedFAQ === item.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedFAQ === item.id && (
                  <div className="px-6 py-4 bg-[oklch(0.10_0.015_250)] border-t border-[oklch(0.20_0.03_250)]">
                    <p className="text-[oklch(0.50_0.02_250)] leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
