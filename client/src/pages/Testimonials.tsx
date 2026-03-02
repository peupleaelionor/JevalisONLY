import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Marie Dupont",
      location: "Paris, France",
      rating: 5,
      text: "Jevalis m'a permis de comprendre exactement combien coûterait l'achat de mon appartement. Les calculs sont précis et le rapport PDF est très professionnel. Je l'ai montré à mon notaire qui a confirmé les chiffres. Excellent outil !",
      image: "👩‍💼",
    },
    {
      name: "Jean-Pierre Müller",
      location: "Zurich, Suisse",
      rating: 5,
      text: "En tant qu'investisseur immobilier, j'ai comparé les frais entre la Suisse et la France. Jevalis m'a montré que les déductions hypothécaires suisses me permettraient d'économiser 15 000 € par an. Décision d'investissement prise en 10 minutes.",
      image: "👨‍💼",
    },
    {
      name: "Sophie Lefevre",
      location: "Bruxelles, Belgique",
      rating: 5,
      text: "J'ai utilisé Jevalis pour comparer l'achat en Belgique vs. Luxembourg. Le rapport a clarifié les différences fiscales. Mon agent immobilier a dit que c'était l'analyse la plus complète qu'il ait jamais vue. Vraiment impressionné.",
      image: "👩‍🔬",
    },
    {
      name: "Hans Becker",
      location: "Amsterdam, Pays-Bas",
      rating: 5,
      text: "Jevalis a montré comment les déductions hypothécaires aux Pays-Bas réduisaient mon impôt. Le rapport détaillé a aidé mon banquier à mieux structurer mon prêt. Outil indispensable pour tout acheteur immobilier.",
      image: "👨‍🏫",
    },
    {
      name: "Isabelle Martin",
      location: "Luxembourg",
      rating: 5,
      text: "Excellente plateforme pour comprendre la fiscalité immobilière. J'ai simulé 3 scénarios différents et le rapport PDF m'a aidé à prendre la meilleure décision. Rapport très détaillé, facile à comprendre.",
      image: "👩‍⚖️",
    },
    {
      name: "Thomas Keller",
      location: "Cologne, Allemagne",
      rating: 5,
      text: "Jevalis m'a permis de comparer l'impact fiscal d'un achat en Allemagne vs. Belgique. Les calculs sont exacts et le rapport est très utile pour les négociations avec le vendeur. Fortement recommandé !",
      image: "👨‍💻",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Témoignages de nos clients
          </h1>
          <p className="text-gray-400 text-lg">
            Découvrez comment Jevalis a aidé des milliers d'acheteurs et
            d'investisseurs immobiliers à prendre les meilleures décisions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-800 border-amber-500/30 p-6 text-center">
            <p className="text-4xl font-bold text-amber-500 mb-2">4.9/5</p>
            <p className="text-gray-400">Note moyenne</p>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-500 text-amber-500"
                />
              ))}
            </div>
          </Card>

          <Card className="bg-slate-800 border-amber-500/30 p-6 text-center">
            <p className="text-4xl font-bold text-green-400 mb-2">12,500+</p>
            <p className="text-gray-400">Simulations réalisées</p>
          </Card>

          <Card className="bg-slate-800 border-amber-500/30 p-6 text-center">
            <p className="text-4xl font-bold text-blue-400 mb-2">6 pays</p>
            <p className="text-gray-400">Couverture européenne</p>
          </Card>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-slate-800 border-amber-500/20 p-6 hover:border-amber-500/50 transition-all"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-500 text-amber-500"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                <span className="text-3xl">{testimonial.image}</span>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.location}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Prêt à faire votre simulation et rejoindre nos clients satisfaits ?
          </p>
          <a
            href="/"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition-all"
          >
            Lancer une simulation gratuite
          </a>
        </div>
      </div>
    </div>
  );
}
