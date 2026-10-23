import type { Treatment, AddOnOption } from '../types/treatment';

export const SAMPLE_ADDONS: AddOnOption[] = [
  {
    id: 'addon-aroma',
    name: 'Aromathérapie personnalisée bio',
    description: 'Sélection d’huiles essentielles botaniques adaptées à vos besoins de détente ou de vitalité.',
    price: 18,
    durationExtraMinutes: 0,
  },
  {
    id: 'addon-argan',
    name: 'Huile chaude d’argan & fleur d’oranger',
    description: 'Application d’huile tiédie nourrissante pour le corps, riche en antioxydants.',
    price: 24,
    durationExtraMinutes: 0,
  },
  {
    id: 'addon-collagen-eyes',
    name: 'Masque contour des yeux défatigant',
    description: 'Patchs rafraîchissants à l’acide hyaluronique et collagène végétal durant le soin.',
    price: 26,
    durationExtraMinutes: 10,
  },
  {
    id: 'addon-exfoliation-feet',
    name: 'Gommage velours pieds & mollets',
    description: 'Exfoliation délicate aux sels de mer et beurre de karité suivie d’un enveloppement doux.',
    price: 32,
    durationExtraMinutes: 15,
  },
];

export const SAMPLE_TREATMENTS: Treatment[] = [
  {
    id: 'duo-detente-60',
    name: 'Massage Détente Harmonie en Duo',
    category: 'duo',
    format: 'duo',
    durationMinutes: 60,
    durationLabel: '60 minutes',
    pricePerPerson: 115,
    totalPrice: 230,
    badge: 'Soirée & Duo Vedette',
    popular: true,
    shortDescription: 'Deux personnes massées en simultané par deux thérapeutes dans notre suite intime et tamisée.',
    fullDescription: 'Partagez une parenthèse de sérénité absolue. Deux thérapeutes certifiées vous accueillent ensemble dans notre suite duo spécialement conçue pour créer un cocon feutré. Les manœuvres fluides et enveloppantes apaisent le système nerveux et dénouent les tensions musculaires en parfaite synchronie.',
    benefits: [
      'Synchronisation parfaite de deux thérapeutes dédiées',
      'Atmosphère enveloppante aux lumières chaudes et huiles aromatiques',
      'Relâchement profond du stress et complicité relaxante',
      'Thé d’accueil artisanal offert avant ou après le soin'
    ],
    includes: [
      'Accueil et consultation bien-être personnalisée (10 min)',
      'Massage personnalisé du corps entier (60 min)',
      'Serviettes chaudes aromatisées à l’eucalyptus',
      'Pause hydratation et tisane aux herbes québécoises'
    ],
    restrictions: 'Convient à tous. Aviser lors de la réservation en cas de grossesse.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
    availableAddons: SAMPLE_ADDONS,
  },
  {
    id: 'duo-signature-90',
    name: 'Massage Thérapeutique Signature en Duo',
    category: 'duo',
    format: 'duo',
    durationMinutes: 90,
    durationLabel: '90 minutes',
    pricePerPerson: 160,
    totalPrice: 320,
    badge: 'Expérience Ultime',
    popular: true,
    shortDescription: 'Un temps prolongé de 90 minutes pour un travail musculaire ciblé et une détente corporelle intégrale.',
    fullDescription: 'Notre rituel le plus complet pour couple ou proches souhaitant relâcher chaque nœud musculaire. Chacun reçoit un protocole sur-mesure (pressions modérées ou profondes selon chaque préférence individuelle) tout en partageant la même quiétude dans notre suite duo.',
    benefits: [
      'Approche thérapeutique adaptée au rythme de chacun des deux invités',
      'Durée généreuse permettant un travail approfondi du dos, trapèzes et jambes',
      'Soulagement des raideurs chroniques et amélioration de la circulation',
      'Tables chauffantes ergonomiques haut de gamme'
    ],
    includes: [
      'Évaluation personnalisée des zones de tension pour chaque convive',
      'Massage complet thérapeutique ou californien de 90 minutes',
      'Application de baume chaud aux plantes apaisantes sur le dos',
      'Rituel de fin avec brume florale régénérante'
    ],
    restrictions: 'Informez votre massothérapeute de toute blessure récente.',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80',
    availableAddons: SAMPLE_ADDONS,
  },
  {
    id: 'duo-rituel-boreale',
    name: 'Rituel Forfait Sérénité Boréale en Duo',
    category: 'forfaits',
    format: 'duo',
    durationMinutes: 90,
    durationLabel: '1 h 30',
    pricePerPerson: 185,
    totalPrice: 370,
    badge: 'Forfait Coup de Cœur',
    popular: false,
    shortDescription: 'Massage détente en duo de 60 min couplé à un mini-soin du visage éclat express et rituel pieds.',
    fullDescription: 'Un forfait holistique mariant corps et visage pour deux. Après un massage détente de tout le corps, profitez d’un nettoyage doux du visage et d’un masque hydratant boréal, agrémenté d’un massage du cuir chevelu apaisant.',
    benefits: [
      'Soin combiné complet corps et éclat du teint',
      'Deux professionnelles assurant une continuité fluide du soin',
      'Régénération globale et éclat lumineux de la peau',
      'Cadeau échantillon bien-être pour la maison inclus'
    ],
    includes: [
      'Massage corps bienfaisant (60 min)',
      'Mini-soin visage hydratant boréal (30 min)',
      'Compresses florales tièdes',
      'Dégustation d’infusion locale lanaudoise'
    ],
    restrictions: 'Ne convient pas aux personnes ayant des allergies sévères aux huiles botaniques.',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80',
    availableAddons: SAMPLE_ADDONS,
  },
  {
    id: 'duo-prestige-120',
    name: 'Grand Forfait Harmonie des Sens (Duo)',
    category: 'forfaits',
    format: 'duo',
    durationMinutes: 120,
    durationLabel: '2 heures',
    pricePerPerson: 235,
    totalPrice: 470,
    badge: 'Prestige Privé',
    popular: false,
    shortDescription: 'Deux heures d’immersion totale comprenant massage complet, soin visage et temps privatif avec mignardises.',
    fullDescription: 'L’expérience la plus exclusive de Duo Spa. Deux heures complètes prises en charge par deux thérapeutes dévouées, conclues par 15 minutes de répit privatif dans la suite avec rafraîchissements et mignardises artisanales.',
    benefits: [
      'Privatisation prolongée de la suite duo',
      'Prise en charge intégrale de la tête aux pieds',
      'Parfait pour les anniversaires, mariages ou occasions spéciales',
      'Option de musique d’ambiance personnalisée'
    ],
    includes: [
      'Massage corps enveloppant 75 minutes',
      'Soin visage nourrissant sur mesure 45 minutes',
      'Collation gourmande et boisson pétillante sans alcool locale',
      'Peignoirs moelleux et chaussons offerts sur place'
    ],
    restrictions: 'Réservation recommandée au moins 48 heures à l’avance.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    availableAddons: SAMPLE_ADDONS,
  },
  {
    id: 'solo-suedois-60',
    name: 'Massage Suédois Relaxant ou Thérapeutique',
    category: 'massage',
    format: 'solo',
    durationMinutes: 60,
    durationLabel: '60 minutes',
    pricePerPerson: 105,
    totalPrice: 105,
    badge: 'Classique Essentiel',
    popular: true,
    shortDescription: 'Une séance individuelle sur mesure alliant effleurages apaisants et pétrissages pour détendre vos muscles.',
    fullDescription: 'Le grand classique de la massothérapie québécoise. Effectué par une massothérapeute agréée, ce soin s’adapte à votre condition du moment : relâchement de stress, libération des tensions du haut du dos, ou détente générale.',
    benefits: [
      'Amélioration de la circulation sanguine et lymphatique',
      'Détente musculaire profonde et regain de vitalité',
      'Reçu d’assurance en massothérapie disponible sur demande',
      'Huiles neutres hypoallergéniques de première qualité'
    ],
    includes: [
      'Bilan de santé sommaire pré-séance',
      'Massage individualisé de 60 minutes',
      'Application de serviettes tièdes',
      'Conseils post-soin et hydratation'
    ],
    restrictions: 'Formulaire de santé requis avant le premier rendez-vous.',
    image: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=1200&q=80',
    availableAddons: SAMPLE_ADDONS,
  },
  {
    id: 'solo-visage-eclat',
    name: 'Soin du Visage Éclat & Pureté Botanique',
    category: 'visage',
    format: 'solo',
    durationMinutes: 60,
    durationLabel: '60 minutes',
    pricePerPerson: 120,
    totalPrice: 120,
    badge: 'Soin Visage Vedette',
    popular: false,
    shortDescription: 'Nettoyage en profondeur, exfoliation enzymatique douce et hydratation intense avec actifs québécois.',
    fullDescription: 'Une cure de jouvence sensorielle pour réveiller la clarté de votre peau face aux saisons québécoises. Comprend un démaquillage aux huiles végétales, un gommage délicat, un massage facial drainant et un masque sur mesure.',
    benefits: [
      'Peau désincrustée, repulpée et lumineuse',
      'Massage relaxant du visage, du cou et du décolleté',
      'Produits botaniques respectueux des peaux sensibles',
      'Protection de la barrière cutanée contre les agressions'
    ],
    includes: [
      'Analyse rapide du type de peau',
      'Vapeur douce et extraction délicate au besoin',
      'Massage facial lymphatique',
      'Sérum concentré et crème protectrice finale'
    ],
    restrictions: 'Éviter les exfoliations chimiques agressives 48 h avant.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
    availableAddons: SAMPLE_ADDONS,
  },
  {
    id: 'solo-prenatal',
    name: 'Massage Prénatal Cocon Bienveillant',
    category: 'massage',
    format: 'solo',
    durationMinutes: 60,
    durationLabel: '60 minutes',
    pricePerPerson: 110,
    totalPrice: 110,
    badge: 'Maternité & Douceur',
    popular: false,
    shortDescription: 'Soin délicat en position latérale sécuritaire avec coussins ergonomiques pour futures mamans.',
    fullDescription: 'Conçu spécialement pour accompagner les futures mamans dès le deuxième trimestre (14 semaines et plus). Soulage les lombaires, allège la sensation de jambes lourdes et offre un moment précieux de connexion.',
    benefits: [
      'Soulagement des points de pression au bas du dos et au bassin',
      'Diminution des gonflements des chevilles et des jambes',
      'Installation sécuritaire et coussins de positionnement adaptés',
      'Thérapeute certifiée en massage périnatal'
    ],
    includes: [
      'Questionnaire précaution grossesse',
      'Massage en position latérale confortable',
      'Huile végétale neutre sans huiles essentielles',
      'Reçu d’assurance émis par massothérapeute agréée'
    ],
    restrictions: 'Réservé aux grossesses de plus de 13 semaines sans contre-indication médicale.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
    availableAddons: [SAMPLE_ADDONS[0], SAMPLE_ADDONS[1]],
  },
  {
    id: 'solo-pierres-chaudes',
    name: 'Massage aux Pierres Chaudes Volcaniques',
    category: 'massage',
    format: 'solo',
    durationMinutes: 75,
    durationLabel: '75 minutes',
    pricePerPerson: 140,
    totalPrice: 140,
    badge: 'Chaleur Profonde',
    popular: false,
    shortDescription: 'Pierres de basalte polies et huiles chaudes pour une décontraction musculaire en profondeur.',
    fullDescription: 'La douce chaleur des pierres volcaniques diffuse à travers les couches musculaires pour dénouer les tensions les plus tenaces sans douleur. Une expérience enveloppante particulièrement appréciée en toute saison.',
    benefits: [
      'Diffusion thermique favorisant l’élimination des toxines',
      'Action décontracturante profonde sans manipulation brusque',
      'Calme profond du système nerveux et apaisement mental',
      'Sensation unique de légèreté corporelle'
    ],
    includes: [
      'Chauffe et placement stratégique des galets de basalte',
      'Massage glissé avec pierres chaudes et manuelles',
      'Travail des méridiens du dos et des jambes',
      'Phase de réveil graduel avec serviette rafraîchissante'
    ],
    restrictions: 'Déconseillé en cas de varices sévères ou d’hypertension non contrôlée.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    availableAddons: SAMPLE_ADDONS,
  }
];

export const SPA_FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23E8ECE7'/%3E%3Ccircle cx='400' cy='250' r='50' fill='%23648561' opacity='0.3'/%3E%3Ctext x='400' y='255' font-family='Georgia, serif' font-size='24' fill='%233C533A' text-anchor='middle'%3EDuo Spa Joliette%3C/text%3E%3Ctext x='400' y='290' font-family='sans-serif' font-size='14' fill='%23635B56' text-anchor='middle'%3EAmbiance de ressourcement%3C/text%3E%3C/svg%3E";

export const DEMO_THERAPISTS = [
  { id: 'auto', name: 'Attribution équilibrée automatique (Recommandé - Disponibilité maximale)' },
  { id: 'duo-team-1', name: 'Équipe Duo 1 : Sophie M. & Camille L. (Noms d’exemple pour prototype)' },
  { id: 'duo-team-2', name: 'Équipe Duo 2 : Émilie B. & Maxime G. (Noms d’exemple pour prototype)' },
  { id: 'duo-team-3', name: 'Équipe Duo 3 : Valérie D. & Alexandre R. (Noms d’exemple pour prototype)' },
];

export const DEMO_TIME_SLOTS = [
  '09:30',
  '11:00',
  '13:00',
  '14:45',
  '16:30',
  '18:15',
  '19:45'
];
