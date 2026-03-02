/**
 * Générateur de preview ebook — 7 premières pages gratuites
 * Contenu : Couverture + Introduction + Chapitre 1 France
 */

import PDFDocument from "pdfkit";

// ─── Couleurs ───────────────────────────────────────────────────────────────

const NAVY = "#0A1628";
const NAVY_LIGHT = "#142238";
const GOLD = "#D4A843";
const WHITE = "#FFFFFF";
const GRAY = "#8899AA";
const LIGHT_GRAY = "#C0CDD8";

// ─── Générateur ─────────────────────────────────────────────────────────────

export function generateEbookPreview(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      bufferPages: true,
      info: {
        Title: "Guide Fiscal Immobilier Européen - Aperçu gratuit",
        Author: "Jevalis",
        Subject: "Aperçu gratuit du guide fiscal immobilier",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width - 100;
    let y = 0;

    // ─── Helper functions ───────────────────────────────────────────────

    const addPage = () => {
      doc.addPage();
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
      doc.rect(50, 40, pageWidth, 1).fill(GOLD);
      doc.fontSize(8).font("Helvetica").fillColor(GOLD).text("JEVALIS", 50, 50);
      y = 90;
    };

    const addTitle = (title: string) => {
      doc.fontSize(22).font("Helvetica-Bold").fillColor(WHITE).text(title, 50, y);
      y += 40;
    };

    const addSubtitle = (subtitle: string) => {
      doc.fontSize(11).font("Helvetica").fillColor(GRAY).text(subtitle, 50, y);
      y += 30;
    };

    const addParagraph = (text: string) => {
      doc.fontSize(10).font("Helvetica").fillColor(LIGHT_GRAY).text(text, 50, y, { width: pageWidth, lineGap: 4, align: "justify" });
      y = doc.y + 15;
    };

    const addSectionTitle = (title: string) => {
      doc.fontSize(14).font("Helvetica-Bold").fillColor(GOLD).text(title, 50, y);
      y += 25;
    };

    const addBullet = (text: string) => {
      doc.fontSize(10).font("Helvetica").fillColor(LIGHT_GRAY);
      doc.circle(55, y + 5, 2).fill(GOLD);
      doc.text(text, 70, y, { width: pageWidth - 20, lineGap: 3 });
      y = doc.y + 8;
    };

    const addBox = (title: string, content: string) => {
      const boxHeight = 80;
      doc.rect(50, y, pageWidth, boxHeight).fill(NAVY_LIGHT);
      doc.rect(50, y, 4, boxHeight).fill(GOLD);
      doc.fontSize(11).font("Helvetica-Bold").fillColor(GOLD).text(title, 65, y + 10, { width: pageWidth - 30 });
      doc.fontSize(9).font("Helvetica").fillColor(LIGHT_GRAY).text(content, 65, y + 30, { width: pageWidth - 30, lineGap: 3 });
      y += boxHeight + 15;
    };

    const addFooter = () => {
      doc.rect(50, doc.page.height - 60, pageWidth, 1).fill(GOLD);
      doc.fontSize(8).font("Helvetica").fillColor(GRAY).text("Guide Fiscal Immobilier Européen — Jevalis © 2026", 50, doc.page.height - 45, { align: "center", width: pageWidth });
    };

    // ─── Page 1 : Couverture ──────────────────────────────────────────

    doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
    doc.rect(50, 40, pageWidth, 2).fill(GOLD);

    doc.fontSize(32).font("Helvetica-Bold").fillColor(WHITE).text("JEVALIS", 50, 80);
    doc.fontSize(10).font("Helvetica").fillColor(GOLD).text("GUIDE FISCAL IMMOBILIER EUROPÉEN", 50, 120);

    doc.rect(50, 150, 80, 1).fill(GOLD);

    doc.fontSize(28).font("Helvetica-Bold").fillColor(WHITE).text("Tout comprendre", 50, 200);
    doc.fontSize(28).fillColor(GOLD).text("avant d'acheter", 50, 240);
    doc.fontSize(28).fillColor(WHITE).text("ou de vendre", 50, 280);

    doc.fontSize(14).font("Helvetica").fillColor(LIGHT_GRAY).text("France · Suisse · Belgique · Luxembourg · Pays-Bas · Allemagne", 50, 350);

    doc.fontSize(12).font("Helvetica").fillColor(GRAY);
    doc.text("🇫🇷 🇨🇭 🇧🇪 🇱🇺 🇳🇱 🇩🇪", 50, 390);

    doc.rect(50, 450, pageWidth, 1).fill(GOLD);
    
    // Badge "Aperçu gratuit"
    doc.rect(50, 480, pageWidth, 50).fill(NAVY_LIGHT);
    doc.rect(50, 480, 4, 50).fill(GOLD);
    doc.fontSize(12).font("Helvetica-Bold").fillColor(GOLD).text("📖 APERÇU GRATUIT", 65, 490);
    doc.fontSize(9).font("Helvetica").fillColor(LIGHT_GRAY).text("7 premières pages · Introduction + Chapitre France", 65, 510);

    doc.rect(50, doc.page.height - 60, pageWidth, 1).fill(GOLD);
    doc.fontSize(8).font("Helvetica").fillColor(GRAY).text("Document confidentiel — Jevalis © 2026", 50, doc.page.height - 45, { align: "center", width: pageWidth });

    // ─── Pages 2-3 : Introduction ─────────────────────────────────────

    addPage();
    addTitle("Introduction");
    addSubtitle("Pourquoi la fiscalité immobilière est cruciale");

    addParagraph("Acheter ou vendre un bien immobilier est l'une des décisions financières les plus importantes de votre vie. Pourtant, la fiscalité immobilière reste souvent mal comprise, ce qui peut vous coûter des dizaines de milliers d'euros en impôts évitables.");

    addParagraph("Ce guide a été conçu pour vous donner une vision claire et complète de la fiscalité immobilière dans 6 pays européens : France, Suisse, Belgique, Luxembourg, Pays-Bas et Allemagne. Que vous soyez acheteur, vendeur, investisseur ou expatrié, vous trouverez ici les informations essentielles pour prendre des décisions éclairées.");

    addSectionTitle("Ce que ce guide va vous apporter");

    addBullet("Une compréhension claire des frais de notaire et droits de mutation dans chaque pays");
    addBullet("Le calcul précis de la plus-value immobilière et des impôts associés");
    addBullet("Les stratégies d'optimisation fiscale légales et efficaces");
    addBullet("Les pièges à éviter et les erreurs courantes des investisseurs");
    addBullet("Des exemples chiffrés concrets pour chaque situation");

    addFooter();

    addPage();
    addSectionTitle("Comment utiliser ce guide");

    addParagraph("Ce guide est organisé par pays, avec pour chacun une analyse détaillée des frais d'acquisition, de la fiscalité sur la plus-value, et des particularités locales. Vous pouvez le lire dans l'ordre ou directement consulter le chapitre du pays qui vous intéresse.");

    addBox("💡 Conseil pratique", "Utilisez ce guide en complément de la simulation Jevalis pour obtenir une analyse personnalisée de votre situation. La simulation prend en compte vos données réelles et applique automatiquement les barèmes fiscaux en vigueur.");

    addParagraph("Chaque chapitre contient des tableaux comparatifs, des exemples chiffrés, et des conseils pratiques pour optimiser votre fiscalité. À la fin du guide, vous trouverez un comparatif européen et une checklist complète avant signature.");

    addSectionTitle("Avertissement");

    addParagraph("Les informations contenues dans ce guide sont fournies à titre informatif et ne constituent pas un conseil fiscal personnalisé. Les barèmes et taux d'imposition peuvent évoluer. Pour une analyse sur mesure, consultez un professionnel ou utilisez la simulation Jevalis.");

    addFooter();

    // ─── Pages 4-7 : Chapitre 1 — France 🇫🇷 ────────────────────────

    addPage();
    addTitle("Chapitre 1 — France 🇫🇷");
    addSubtitle("Fiscalité immobilière française : frais de notaire et plus-value");

    addSectionTitle("1. Les frais de notaire");

    addParagraph("En France, les frais de notaire (ou frais d'acquisition) représentent environ 7 à 8 % du prix d'achat pour un bien ancien, et 2 à 3 % pour un bien neuf. Ces frais se décomposent en trois parties principales :");

    addBullet("Droits de mutation (ou droits d'enregistrement) : environ 5,80 % du prix (variable selon le département)");
    addBullet("Émoluments du notaire : rémunération du notaire, calculée sur un barème dégressif");
    addBullet("Débours et frais divers : environ 0,5 % (frais administratifs, cadastre, etc.)");

    addBox("📊 Exemple concret", "Pour un appartement ancien à 300 000 € à Paris : Droits de mutation = 17 400 €, Émoluments = 3 600 €, Débours = 1 500 €. Total frais de notaire = 22 500 € (7,5 %).");

    addFooter();

    addPage();
    addSectionTitle("2. La plus-value immobilière");

    addParagraph("Lorsque vous vendez un bien immobilier en France, la plus-value réalisée est soumise à l'impôt sur le revenu (19 %) et aux prélèvements sociaux (17,2 %), soit un taux global de 36,2 %. Toutefois, des abattements pour durée de détention s'appliquent :");

    addBullet("Impôt sur le revenu : exonération totale après 22 ans de détention");
    addBullet("Prélèvements sociaux : exonération totale après 30 ans de détention");
    addBullet("Résidence principale : exonération totale immédiate");

    addParagraph("Le calcul de la plus-value se fait en deux étapes : d'abord la plus-value brute (prix de vente - prix d'achat), puis la déduction des charges (frais de notaire, travaux, etc.), pour obtenir la plus-value nette imposable.");

    addBox("⚠️ Attention", "Une surtaxe de 2 à 6 % s'applique sur les plus-values supérieures à 50 000 €. Cette surtaxe peut représenter plusieurs milliers d'euros supplémentaires.");

    addFooter();

    addPage();
    addSectionTitle("3. Optimisation fiscale en France");

    addParagraph("Plusieurs stratégies permettent de réduire légalement votre fiscalité immobilière en France :");

    addBullet("Conserver le bien au moins 22 ans pour une exonération totale d'impôt sur le revenu");
    addBullet("Déduire les travaux de rénovation (avec justificatifs) de la plus-value");
    addBullet("Appliquer l'abattement forfaitaire de 15 % si vous ne pouvez pas justifier les travaux");
    addBullet("Vendre votre résidence principale avant d'acheter un nouveau bien pour bénéficier de l'exonération");

    addBox("💡 Conseil d'expert", "Si vous vendez après 15 ans de détention, l'abattement pour durée réduit déjà significativement votre impôt. Attendez 22 ans si possible pour une exonération totale de l'impôt sur le revenu.");

    addSectionTitle("4. Les pièges à éviter");

    addBullet("Ne pas déclarer les travaux réalisés : vous perdez une déduction importante");
    addBullet("Vendre trop tôt : les abattements ne s'appliquent qu'à partir de la 6ème année");
    addBullet("Oublier la surtaxe : elle peut représenter jusqu'à 6 % supplémentaires sur les grosses plus-values");

    addFooter();

    addPage();
    
    // ─── Page finale : CTA pour ebook complet ────────────────────────

    doc.rect(0, 0, doc.page.width, doc.page.height).fill(NAVY);
    doc.rect(50, 40, pageWidth, 2).fill(GOLD);

    doc.fontSize(10).font("Helvetica").fillColor(GOLD).text("JEVALIS", 50, 50);
    doc.fontSize(22).font("Helvetica-Bold").fillColor(WHITE).text("Continuez votre lecture", 50, 90);

    doc.rect(50, 130, pageWidth, 1).fill(GOLD);

    y = 160;

    doc.fontSize(11).font("Helvetica").fillColor(LIGHT_GRAY).text("Vous venez de lire les 7 premières pages de notre guide fiscal immobilier européen. Pour accéder à l'intégralité du contenu, découvrez nos offres :", 50, y, { width: pageWidth, lineGap: 5 });

    y += 80;

    // Pack Complet
    doc.rect(50, y, pageWidth, 120).fill(NAVY_LIGHT);
    doc.rect(50, y, 4, 120).fill(GOLD);
    doc.fontSize(14).font("Helvetica-Bold").fillColor(GOLD).text("📚 Pack Complet — 9,99 €", 65, y + 15);
    doc.fontSize(10).font("Helvetica").fillColor(LIGHT_GRAY).text("• Guide complet 25 pages (6 pays)\n• Vos résultats de simulation en PDF\n• Calculs détaillés personnalisés\n• Livraison instantanée par email", 65, y + 40, { lineGap: 5 });

    y += 140;

    // Rapport Premium
    doc.rect(50, y, pageWidth, 140).fill(NAVY_LIGHT);
    doc.rect(50, y, 4, 140).fill(GOLD);
    doc.fontSize(14).font("Helvetica-Bold").fillColor(GOLD).text("💎 Rapport Premium — 39,99 €", 65, y + 15);
    doc.fontSize(10).font("Helvetica").fillColor(LIGHT_GRAY).text("• Tout du Pack Complet\n• Graphiques interactifs\n• Comparaison 3 scénarios fiscaux\n• Recommandations personnalisées\n• Simulation stratégies d'économie", 65, y + 40, { lineGap: 5 });

    y += 160;

    doc.rect(50, y, pageWidth, 60).fill(NAVY_LIGHT);
    doc.rect(50, y, pageWidth, 60).stroke(GOLD);
    doc.fontSize(12).font("Helvetica-Bold").fillColor(WHITE).text("🎯 Lancez votre simulation sur Jevalis.com", 65, y + 20);

    doc.rect(50, doc.page.height - 60, pageWidth, 1).fill(GOLD);
    doc.fontSize(8).font("Helvetica").fillColor(GRAY).text("Guide Fiscal Immobilier Européen — Jevalis © 2026", 50, doc.page.height - 45, { align: "center", width: pageWidth });

    doc.end();
  });
}
