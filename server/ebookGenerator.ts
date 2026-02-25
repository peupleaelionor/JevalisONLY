/**
 * Générateur d'ebook professionnel — Guide Fiscal Immobilier Européen
 * Design : Swiss Private Banking (navy + or)
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

export function generateEbook(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      bufferPages: true,
      info: {
        Title: "Guide Fiscal Immobilier Européen",
        Author: "Jevalis",
        Subject: "Guide complet de la fiscalité immobilière en Europe",
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
    doc.fontSize(10).font("Helvetica").fillColor(LIGHT_GRAY).text("25 pages · 6 pays · Édition 2026", 50, 470);

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

    addBox("\ud83d\udcca Exemple concret", "Pour un appartement ancien à 300\u202f000\u202f€ à Paris : Droits de mutation = 17\u202f400\u202f€, Émoluments = 3\u202f600\u202f€, Débours = 1\u202f500\u202f€. Total frais de notaire = 22\u202f500\u202f€ (7,5\u202f%).");

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
    addSectionTitle("5. Checklist France");

    addParagraph("Avant d'acheter ou de vendre en France, vérifiez ces points essentiels :");

    addBullet("✓ Calculer les frais de notaire (7-8 % ancien, 2-3 % neuf)");
    addBullet("✓ Estimer la plus-value nette après abattements");
    addBullet("✓ Vérifier si la surtaxe s'applique (plus-value > 50 000 €)");
    addBullet("✓ Rassembler les justificatifs de travaux pour déduction");
    addBullet("✓ Consulter un notaire pour une simulation précise");

    addBox("🎯 Action recommandée", "Utilisez la simulation Jevalis pour obtenir une estimation précise de vos frais de notaire et de votre plus-value imposable en quelques clics.");

    addFooter();

    // ─── Pages 8-10 : Chapitre 2 — Suisse 🇨🇭 ───────────────────────

    addPage();
    addTitle("Chapitre 2 — Suisse 🇨🇭");
    addSubtitle("Le système cantonal suisse : fiscalité variable selon les cantons");

    addSectionTitle("1. Le système cantonal");

    addParagraph("La Suisse fonctionne sur un système fédéral où chaque canton fixe ses propres règles fiscales. Les différences peuvent être considérables : les droits de mutation varient de 0 % (Zurich, Schwyz) à 3,3 % (Genève), et l'impôt sur les gains immobiliers peut atteindre 40 % dans certains cantons.");

    addBullet("Genève : droits de mutation 3 %, impôt sur les gains jusqu'à 40 %");
    addBullet("Vaud : droits de mutation 2,2 %, impôt sur les gains jusqu'à 30 %");
    addBullet("Zurich : pas de droits de mutation, impôt sur les gains progressif");
    addBullet("Berne : droits de mutation 1,8 %, impôt sur les gains jusqu'à 25 %");

    addBox("\ud83d\udcca Exemple concret", "Pour un bien à 800\u202f000\u202fCHF à Genève : Droits de mutation = 26\u202f400\u202fCHF (3,3\u202f%). À Zurich : 0\u202fCHF. La différence est considérable\u202f!");

    addFooter();

    addPage();
    addSectionTitle("2. L'impôt sur les gains immobiliers");

    addParagraph("En Suisse, l'impôt sur les gains immobiliers (LHID) est prélevé au niveau cantonal. Le taux dépend de deux facteurs : le montant de la plus-value et la durée de détention. Plus vous conservez le bien longtemps, plus le taux diminue.");

    addBullet("Détention < 2 ans : taux maximum (jusqu'à 40 % dans certains cantons)");
    addBullet("Détention 2-5 ans : taux intermédiaire (20-30 %)");
    addBullet("Détention > 10 ans : taux réduit (10-15 %)");
    addBullet("Détention > 20 ans : taux minimal (5-10 %)");

    addBox("💡 Conseil pratique", "En Suisse, il est crucial de conserver le bien au moins 10 ans pour bénéficier d'un taux réduit. Vendre avant 2 ans peut coûter jusqu'à 40 % de la plus-value en impôts.");

    addFooter();

    addPage();
    addSectionTitle("3. Particularités suisses");

    addParagraph("La Suisse présente plusieurs spécificités importantes pour les investisseurs étrangers et les résidents :");

    addBullet("Lex Koller : restriction sur l'achat immobilier pour les non-résidents (sauf résidence secondaire dans certaines zones touristiques)");
    addBullet("Résidence principale : certains cantons offrent des exonérations partielles si vous réinvestissez dans une nouvelle résidence principale");
    addBullet("Frais de courtage : souvent à la charge de l'acheteur (2-3 % du prix)");

    addBox("⚠️ Attention", "Si vous êtes étranger non-résident, vérifiez d'abord si vous êtes autorisé à acheter (Lex Koller). Les restrictions sont strictes et varient selon les cantons.");

    addSectionTitle("4. Checklist Suisse");

    addBullet("✓ Identifier le canton et ses taux spécifiques");
    addBullet("✓ Calculer les droits de mutation (0 % à 3,3 %)");
    addBullet("✓ Estimer l'impôt sur les gains selon la durée de détention");
    addBullet("✓ Vérifier les restrictions Lex Koller si non-résident");
    addBullet("✓ Prévoir les frais de courtage (2-3 %)");

    addFooter();

    // ─── Pages 11-13 : Chapitre 3 — Belgique 🇧🇪 ────────────────────

    addPage();
    addTitle("Chapitre 3 — Belgique 🇧🇪");
    addSubtitle("Fiscalité immobilière belge : différences régionales marquées");

    addSectionTitle("1. Les droits d'enregistrement");

    addParagraph("En Belgique, les droits d'enregistrement (ou droits de mutation) varient selon les régions : Flandre, Wallonie et Bruxelles-Capitale. Ces droits représentent la part la plus importante des frais d'acquisition.");

    addBullet("Flandre : 3 % (habitation familiale) ou 12 % (autres biens)");
    addBullet("Wallonie : 12,5 % (taux standard)");
    addBullet("Bruxelles : 12,5 % (taux standard)");

    addBox("\ud83d\udcca Exemple concret", "Pour un bien à 350\u202f000\u202f€ : Flandre (habitation familiale) = 10\u202f500\u202f€. Wallonie/Bruxelles = 43\u202f750\u202f€. La différence est de 33\u202f250\u202f€\u202f!");

    addFooter();

    addPage();
    addSectionTitle("2. La plus-value immobilière");

    addParagraph("En Belgique, la plus-value immobilière n'est généralement pas imposée pour les particuliers, sauf dans deux cas spécifiques :");

    addBullet("Plus-value spéculative : vente dans les 5 ans suivant l'achat (taux de 16,5 % + taxes communales)");
    addBullet("Activité professionnelle : si vous êtes considéré comme marchand de biens (taux progressif jusqu'à 50 %)");

    addParagraph("Pour les particuliers qui conservent leur bien plus de 5 ans, la plus-value est totalement exonérée d'impôt. C'est un avantage fiscal majeur par rapport à la France ou la Suisse.");

    addBox("💡 Conseil pratique", "En Belgique, conservez votre bien au moins 5 ans pour éviter l'impôt sur la plus-value spéculative. Au-delà, la vente est totalement exonérée.");

    addFooter();

    addPage();
    addSectionTitle("3. Le précompte immobilier");

    addParagraph("Le précompte immobilier est un impôt annuel sur la propriété, calculé sur le revenu cadastral du bien. Il varie selon les régions et les communes, mais représente généralement entre 0,5 % et 2 % de la valeur du bien par an.");

    addSectionTitle("4. Avantages fiscaux");

    addBullet("Abattement pour habitation familiale en Flandre : droits réduits à 3 % (au lieu de 12 %)");
    addBullet("Chèque habitat (Wallonie) : réduction d'impôt pour les primo-accédants");
    addBullet("Bonus logement (Bruxelles) : déduction fiscale des intérêts d'emprunt");

    addSectionTitle("5. Checklist Belgique");

    addBullet("✓ Identifier la région (Flandre, Wallonie, Bruxelles)");
    addBullet("✓ Calculer les droits d'enregistrement (3 % à 12,5 %)");
    addBullet("✓ Vérifier l'éligibilité aux abattements (habitation familiale)");
    addBullet("✓ Prévoir le précompte immobilier annuel");
    addBullet("✓ Conserver le bien au moins 5 ans pour éviter l'impôt sur la plus-value");

    addFooter();

    // ─── Pages 14-16 : Chapitre 4 — Luxembourg 🇱🇺 ───────────────────

    addPage();
    addTitle("Chapitre 4 — Luxembourg 🇱🇺");
    addSubtitle("Fiscalité immobilière luxembourgeoise : avantages pour les résidents");

    addSectionTitle("1. Les droits d'enregistrement et de transcription");

    addParagraph("Au Luxembourg, l'achat d'un bien immobilier entraîne deux types de frais : les droits d'enregistrement (6 % du prix) et les droits de transcription (1 % du prix), soit un total de 7 % du prix d'achat.");

    addBullet("Droits d'enregistrement : 6 % du prix d'achat");
    addBullet("Droits de transcription : 1 % du prix d'achat");
    addBullet("Frais de notaire : environ 1 à 2 % du prix");

    addBox("\ud83d\udcca Exemple concret", "Pour un bien à 600\u202f000\u202f€ : Droits d'enregistrement = 36\u202f000\u202f€, Droits de transcription = 6\u202f000\u202f€, Frais de notaire = 12\u202f000\u202f€. Total = 54\u202f000\u202f€ (9\u202f%).");

    addFooter();

    addPage();
    addSectionTitle("2. L'impôt sur la plus-value (bénéfice de cession)");

    addParagraph("Au Luxembourg, la plus-value immobilière est imposée uniquement si vous vendez dans les 2 ans suivant l'achat. Au-delà de 2 ans, la plus-value est totalement exonérée pour les particuliers.");

    addBullet("Vente < 2 ans : plus-value imposée au taux progressif de l'impôt sur le revenu (jusqu'à 45,78 %)");
    addBullet("Vente > 2 ans : exonération totale");

    addBox("💡 Conseil pratique", "Au Luxembourg, conservez votre bien au moins 2 ans pour bénéficier de l'exonération totale. C'est l'un des délais les plus courts d'Europe.");

    addFooter();

    addPage();
    addSectionTitle("3. Le crédit d'impôt \"Bëllegen Akt\"");

    addParagraph("Le Luxembourg offre un crédit d'impôt (Bëllegen Akt) pour les primo-accédants qui achètent leur résidence principale. Ce crédit peut atteindre 20 000 € sur 10 ans, soit 2 000 € par an.");

    addSectionTitle("4. Particularités pour les frontaliers");

    addParagraph("Les frontaliers (résidents français, belges ou allemands travaillant au Luxembourg) peuvent acheter au Luxembourg, mais doivent vérifier les conventions fiscales pour éviter la double imposition.");

    addSectionTitle("5. Checklist Luxembourg");

    addBullet("✓ Calculer les droits d'enregistrement et de transcription (7 %)");
    addBullet("✓ Prévoir les frais de notaire (1-2 %)");
    addBullet("✓ Conserver le bien au moins 2 ans pour l'exonération de plus-value");
    addBullet("✓ Vérifier l'éligibilité au crédit d'impôt Bëllegen Akt");
    addBullet("✓ Consulter les conventions fiscales si frontalier");

    addFooter();

    // ─── Pages 17-18 : Chapitre 5 — Pays-Bas 🇳🇱 ─────────────────────

    addPage();
    addTitle("Chapitre 5 — Pays-Bas 🇳🇱");
    addSubtitle("Fiscalité immobilière néerlandaise : système de Box 3");

    addSectionTitle("1. Le \"overdrachtsbelasting\" (droits de mutation)");

    addParagraph("Aux Pays-Bas, les droits de mutation (overdrachtsbelasting) s'élèvent à 2 % du prix d'achat pour les habitations, et 10,4 % pour les biens commerciaux. Les primo-accédants de moins de 35 ans bénéficient d'une exonération jusqu'à 440 000 €.");

    addBullet("Habitations : 2 % du prix d'achat");
    addBullet("Biens commerciaux : 10,4 % du prix d'achat");
    addBullet("Exonération primo-accédants < 35 ans : jusqu'à 440\u202f000\u202f€");

    addBox("\ud83d\udcca Exemple concret", "Pour un bien à 400\u202f000\u202f€ : Droits de mutation (overdrachtsbelasting) = 8\u202f000\u202f€ (2\u202f%). Si primo-accédant < 35 ans : 0\u202f€ (exonération).");

    addFooter();

    addPage();
    addSectionTitle("2. L'imposition en Box 3 (patrimoine)");

    addParagraph("Aux Pays-Bas, les biens immobiliers (hors résidence principale) sont imposés dans la Box 3, qui taxe le patrimoine net. Le taux effectif est d'environ 1,2 % par an sur la valeur du bien.");

    addSectionTitle("3. Déductibilité des intérêts hypothécaires");

    addParagraph("Les intérêts d'emprunt pour l'achat de la résidence principale sont déductibles du revenu imposable, ce qui réduit significativement le coût du crédit.");

    addSectionTitle("4. Particularités pour les expatriés");

    addParagraph("Les expatriés bénéficient d'un régime fiscal avantageux (30 % ruling) qui peut réduire l'imposition sur le patrimoine pendant 5 ans.");

    addSectionTitle("5. Checklist Pays-Bas");

    addBullet("✓ Calculer les droits de mutation (2 % ou exonération si < 35 ans)");
    addBullet("✓ Prévoir l'imposition en Box 3 pour les biens locatifs");
    addBullet("✓ Déduire les intérêts hypothécaires de la résidence principale");
    addBullet("✓ Vérifier l'éligibilité au 30 % ruling si expatrié");

    addFooter();

    // ─── Pages 19-20 : Chapitre 6 — Allemagne 🇩🇪 ────────────────────

    addPage();
    addTitle("Chapitre 6 — Allemagne 🇩🇪");
    addSubtitle("Fiscalité immobilière allemande : système fédéral par Land");

    addSectionTitle("1. Le \"Grunderwerbsteuer\" (droits de mutation)");

    addParagraph("En Allemagne, les droits de mutation (Grunderwerbsteuer) varient selon les Länder, de 3,5 % (Bavière, Saxe) à 6,5 % (Brandebourg, Sarre, Thuringe, Schleswig-Holstein).");

    addBullet("Bavière, Saxe : 3,5 %");
    addBullet("Berlin, Hambourg : 6 %");
    addBullet("Brandebourg, Sarre, Thuringe, Schleswig-Holstein : 6,5 %");

    addBox("\ud83d\udcca Exemple concret", "Pour un bien à 500\u202f000\u202f€ : Bavière = 17\u202f500\u202f€ (Grunderwerbsteuer 3,5\u202f%). Brandebourg = 32\u202f500\u202f€ (6,5\u202f%). Différence de 15\u202f000\u202f€ selon le Land.");

    addFooter();

    addPage();
    addSectionTitle("2. La plus-value immobilière (Spekulationssteuer)");

    addParagraph("En Allemagne, la plus-value immobilière est imposée uniquement si vous vendez dans les 10 ans suivant l'achat. Au-delà de 10 ans, la plus-value est totalement exonérée.");

    addBullet("Vente < 10 ans : plus-value imposée au taux progressif de l'impôt sur le revenu (jusqu'à 45 %)");
    addBullet("Vente > 10 ans : exonération totale");

    addBox("💡 Conseil pratique", "En Allemagne, conservez votre bien au moins 10 ans pour l'exonération totale. C'est un délai long mais avantageux.");

    addSectionTitle("3. L'impôt foncier (Grundsteuer)");

    addParagraph("L'impôt foncier (Grundsteuer) est un impôt annuel sur la propriété, calculé sur la valeur cadastrale. Il varie selon les communes, mais représente généralement entre 0,3 % et 1 % de la valeur du bien par an.");

    addSectionTitle("4. Checklist Allemagne");

    addBullet("✓ Identifier le Land et son taux de Grunderwerbsteuer (3,5 % à 6,5 %)");
    addBullet("✓ Conserver le bien au moins 10 ans pour l'exonération de plus-value");
    addBullet("✓ Prévoir la Grundsteuer annuelle (0,3 % à 1 %)");

    addFooter();

    // ─── Pages 21-22 : Chapitre 7 — Comparatif Européen ──────────────

    addPage();
    addTitle("Chapitre 7 — Comparatif Européen");
    addSubtitle("Quel pays est le plus avantageux selon votre profil ?");

    addSectionTitle("Tableau comparatif des 6 pays");

    doc.fontSize(9).font("Helvetica-Bold").fillColor(WHITE);
    const tableY = y;
    const colWidth = pageWidth / 4;

    // Headers
    doc.text("Pays", 50, tableY, { width: colWidth });
    doc.text("Frais achat", 50 + colWidth, tableY, { width: colWidth });
    doc.text("Plus-value", 50 + colWidth * 2, tableY, { width: colWidth });
    doc.text("Exonération", 50 + colWidth * 3, tableY, { width: colWidth });

    y = tableY + 20;
    doc.rect(50, y, pageWidth, 0.5).fill(GOLD);
    y += 10;

    const rows = [
      ["🇫🇷 France", "7-8 %", "36,2 %", "22-30 ans"],
      ["🇨🇭 Suisse", "0-3,3 %", "5-40 %", "10-20 ans"],
      ["🇧🇪 Belgique", "3-12,5 %", "16,5 %", "5 ans"],
      ["🇱🇺 Luxembourg", "7 %", "45,78 %", "2 ans"],
      ["🇳🇱 Pays-Bas", "2 %", "Box 3", "N/A"],
      ["🇩🇪 Allemagne", "3,5-6,5 %", "45 %", "10 ans"],
    ];

    doc.font("Helvetica").fillColor(LIGHT_GRAY);
    rows.forEach((row) => {
      doc.text(row[0], 50, y, { width: colWidth });
      doc.text(row[1], 50 + colWidth, y, { width: colWidth });
      doc.text(row[2], 50 + colWidth * 2, y, { width: colWidth });
      doc.text(row[3], 50 + colWidth * 3, y, { width: colWidth });
      y += 18;
    });

    y += 10;

    addFooter();

    addPage();
    addSectionTitle("Quel pays choisir selon votre profil ?");

    addBullet("Investisseur court terme (< 5 ans) : Belgique (exonération après 5 ans) ou Luxembourg (exonération après 2 ans)");
    addBullet("Investisseur long terme (> 10 ans) : France, Suisse ou Allemagne (exonérations progressives)");
    addBullet("Primo-accédant : Pays-Bas (exonération < 35 ans) ou Flandre (droits réduits à 3 %)");
    addBullet("Expatrié : Suisse (Zurich, pas de droits de mutation) ou Pays-Bas (30 % ruling)");

    addSectionTitle("Les erreurs courantes des investisseurs transfrontaliers");

    addBullet("Ne pas vérifier les conventions fiscales : risque de double imposition");
    addBullet("Sous-estimer les frais d'acquisition : ils peuvent représenter jusqu'à 12,5 % du prix");
    addBullet("Vendre trop tôt : perdre les abattements pour durée de détention");
    addBullet("Oublier les impôts annuels : précompte immobilier, Grundsteuer, Box 3");

    addFooter();

    // ─── Pages 23-24 : Chapitre 8 — Checklist & Conseils ─────────────

    addPage();
    addTitle("Chapitre 8 — Checklist & Conseils Pratiques");
    addSubtitle("Les 10 questions à poser avant d'acheter");

    addBullet("1. Quel est le montant exact des frais d'acquisition (notaire, droits de mutation, courtage) ?");
    addBullet("2. Quelle est la fiscalité sur la plus-value si je revends dans 5, 10 ou 20 ans ?");
    addBullet("3. Existe-t-il des abattements ou exonérations fiscales pour mon profil (primo-accédant, résidence principale, etc.) ?");
    addBullet("4. Quels sont les impôts annuels à prévoir (précompte immobilier, Grundsteuer, Box 3) ?");
    addBullet("5. Puis-je déduire les intérêts d'emprunt de mes revenus imposables ?");
    addBullet("6. Quelles sont les restrictions pour les non-résidents (Lex Koller en Suisse, etc.) ?");
    addBullet("7. Quel est le coût total du crédit (intérêts + assurances) ?");
    addBullet("8. Quels travaux puis-je déduire de la plus-value future ?");
    addBullet("9. Quelles sont les conventions fiscales si je suis frontalier ou expatrié ?");
    addBullet("10. Quel est le délai optimal de détention pour minimiser la fiscalité ?");

    addFooter();

    addPage();
    addSectionTitle("Les 5 erreurs fiscales à éviter absolument");

    addBullet("1. Vendre trop tôt : perdre les abattements pour durée de détention (5, 10, 22 ans selon les pays)");
    addBullet("2. Ne pas déclarer les travaux : perdre une déduction importante sur la plus-value");
    addBullet("3. Oublier la surtaxe : elle peut représenter jusqu'à 6 % supplémentaires en France");
    addBullet("4. Sous-estimer les frais d'acquisition : prévoir 7 à 12 % du prix d'achat selon les pays");
    addBullet("5. Ignorer les conventions fiscales : risque de double imposition pour les frontaliers");

    addSectionTitle("Checklist complète avant signature chez le notaire");

    addBullet("✓ Simulation complète des frais d'acquisition (notaire, droits, courtage)");
    addBullet("✓ Estimation de la plus-value future selon plusieurs scénarios de revente");
    addBullet("✓ Vérification des abattements et exonérations applicables");
    addBullet("✓ Calcul du coût total du crédit (intérêts + assurances)");
    addBullet("✓ Consultation d'un professionnel (notaire, conseiller fiscal)");

    addFooter();

    // ─── Page 25 : Conclusion + CTA ──────────────────────────────────

    addPage();
    addTitle("Conclusion");
    addSubtitle("Passez à l'action avec Jevalis");

    addParagraph("Vous avez maintenant une vision complète de la fiscalité immobilière dans 6 pays européens. Que vous soyez acheteur, vendeur, investisseur ou expatrié, vous disposez des clés pour prendre des décisions éclairées et optimiser votre fiscalité.");

    addSectionTitle("Résumé des points clés");

    addBullet("Les frais d'acquisition varient de 2 % (Pays-Bas) à 12,5 % (Belgique, Wallonie)");
    addBullet("La plus-value est exonérée après 2 ans (Luxembourg), 5 ans (Belgique), 10 ans (Allemagne), 22 ans (France)");
    addBullet("Les abattements et exonérations peuvent réduire significativement votre fiscalité");
    addBullet("Conserver le bien au moins 10 ans est souvent la stratégie la plus avantageuse");

    addBox("🎯 Passez à l'action maintenant", "Lancez votre simulation personnalisée sur Jevalis.com pour obtenir une analyse précise de votre situation. En quelques clics, vous obtiendrez vos frais de notaire, votre plus-value estimée, et des recommandations d'optimisation fiscale.");

    y += 20;

    doc.rect(50, y, pageWidth, 80).fill(NAVY_LIGHT);
    doc.fontSize(14).font("Helvetica-Bold").fillColor(GOLD).text("Rapport Premium : Analyse Complète", 70, y + 15, { width: pageWidth - 40 });
    doc.fontSize(10).font("Helvetica").fillColor(LIGHT_GRAY).text("Pour une analyse sur mesure avec graphiques interactifs, comparaison de 3 scénarios fiscaux, et recommandations personnalisées, passez au Rapport Premium (39,99 €).", 70, y + 40, { width: pageWidth - 40, lineGap: 4 });

    y += 100;

    addSectionTitle("Avertissement");

    doc.fontSize(8).font("Helvetica").fillColor(GRAY).text("Les informations contenues dans ce guide sont fournies à titre informatif et ne constituent pas un conseil fiscal personnalisé. Les barèmes et taux d'imposition peuvent évoluer. Pour une analyse sur mesure, consultez un professionnel ou utilisez la simulation Jevalis. Ce document est confidentiel et réservé à un usage personnel.", 50, y, { width: pageWidth, lineGap: 3 });

    addFooter();

    doc.end();
  });
}
