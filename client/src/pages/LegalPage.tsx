import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

const CONTENT: Record<string, { title: string; sections: { h: string; p: string }[] }> = {
  mentions: {
    title: "Mentions légales",
    sections: [
      { h: "Éditeur du site", p: "Jevalis est un service édité par Jevalis SAS, société par actions simplifiée au capital de 1 000 €. Email : contact@jevalis.com" },
      { h: "Hébergement", p: "Le site Jevalis est hébergé par Vercel Inc., 340 Pine Street Suite 701, San Francisco, California 94104, États-Unis." },
      { h: "Directeur de la publication", p: "Le directeur de la publication est le représentant légal de Jevalis SAS." },
      { h: "Propriété intellectuelle", p: "L'ensemble des contenus présents sur le site Jevalis (textes, images, graphiques, logos) sont la propriété exclusive de Jevalis SAS et sont protégés par les lois françaises et internationales sur la propriété intellectuelle." },
      { h: "Responsabilité", p: "Les simulations fournies par Jevalis sont indicatives et ne constituent pas un conseil fiscal ou juridique. Jevalis décline toute responsabilité quant aux décisions prises sur la base des simulations." },
      { h: "Contact", p: "Pour toute question : support@jevalis.com" },
    ],
  },
  confidentialite: {
    title: "Politique de confidentialité",
    sections: [
      { h: "Données collectées", p: "Jevalis collecte uniquement les données nécessaires à la fourniture du service : nom, adresse email, données de simulation immobilière. Nous ne collectons jamais vos données bancaires (gérées exclusivement par Stripe)." },
      { h: "Utilisation des données", p: "Vos données sont utilisées pour : générer votre rapport PDF personnalisé, envoyer votre rapport par email, maintenir votre espace compte, améliorer nos services." },
      { h: "Base légale", p: "Le traitement de vos données est fondé sur l'exécution du contrat (fourniture du rapport) et votre consentement pour les communications marketing." },
      { h: "Conservation", p: "Vos données sont conservées 3 ans à compter de votre dernière activité. Vos rapports PDF sont accessibles pendant 30 jours via lien sécurisé." },
      { h: "Vos droits (RGPD)", p: "Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition. Pour exercer ces droits : privacy@jevalis.com" },
      { h: "Cookies", p: "Jevalis utilise uniquement des cookies techniques indispensables au fonctionnement du service. Aucun cookie publicitaire ou de tracking tiers n'est utilisé." },
      { h: "Transferts internationaux", p: "Vos données peuvent être traitées par Stripe (États-Unis) et Supabase (UE) dans le cadre strict des clauses contractuelles types approuvées par la Commission européenne." },
    ],
  },
  cgv: {
    title: "Conditions Générales de Vente",
    sections: [
      { h: "Objet", p: "Les présentes CGV régissent les ventes de rapports de simulation fiscale immobilière et du Guide Fiscal Immobilier Européen proposés par Jevalis." },
      { h: "Prix et paiement", p: "Pack Complet (ebook + PDF résultats) : 9,99 € TTC. Rapport Premium : 39,99 € TTC. Les prix sont indiqués en euros TTC. Le paiement est sécurisé via Stripe. Le paiement est unique, sans abonnement." },
      { h: "Livraison", p: "Les rapports PDF sont livrés par email immédiatement après confirmation du paiement. Un lien de téléchargement valable 30 jours est également fourni." },
      { h: "Droit de rétractation", p: "Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques fournis immédiatement après achat. Cependant, Jevalis offre une garantie satisfait ou remboursé de 7 jours." },
      { h: "Garantie de remboursement", p: "Si vous n'êtes pas satisfait de votre rapport dans les 7 jours suivant l'achat, contactez support@jevalis.com pour un remboursement intégral, sans condition." },
      { h: "Limitation de responsabilité", p: "Jevalis fournit des simulations indicatives basées sur les barèmes fiscaux officiels. Les résultats ne constituent pas un conseil fiscal ou juridique. Jevalis ne saurait être tenu responsable des décisions prises sur la base de ces simulations." },
      { h: "Droit applicable", p: "Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire." },
      { h: "Contact", p: "Pour toute question relative à votre commande : support@jevalis.com" },
    ],
  },
};

export default function LegalPage({ page }: { page: "mentions" | "confidentialite" | "cgv" }) {
  const content = CONTENT[page];
  return (
    <div className="min-h-screen py-16 px-4" style={{ background: "#0B1628" }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link href="/"><span className="flex items-center gap-2 text-[oklch(0.50_0.02_250)] hover:text-white transition-colors text-sm mb-8 cursor-pointer" style={{ fontFamily: "var(--font-caption)" }}><ArrowLeft className="w-4 h-4"/> Retour à l&apos;accueil</span></Link>
          <div className="section-divider mb-6"/>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>{content.title}</h1>
          <p className="text-[oklch(0.45_0.02_250)] text-sm mt-2" style={{ fontFamily: "var(--font-caption)" }}>Dernière mise à jour : janvier 2026</p>
        </div>
        <div className="space-y-8">
          {content.sections.map(({ h, p }, i) => (
            <div key={i} className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.18_0.03_250)] p-6">
              <h2 className="text-base font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>{h}</h2>
              <p className="text-[oklch(0.55_0.02_250)] text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{p}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/"><span className="text-[oklch(0.50_0.02_250)] hover:text-white transition-colors text-sm cursor-pointer" style={{ fontFamily: "var(--font-caption)" }}>← Retour à l&apos;accueil</span></Link>
        </div>
      </div>
    </div>
  );
}
