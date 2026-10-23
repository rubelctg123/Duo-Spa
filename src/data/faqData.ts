export interface FAQItem {
  question: string;
  answer: string;
  category: 'duo' | 'reservation' | 'politiques' | 'general';
}

export const FAQ_DATA: FAQItem[] = [
  {
    category: 'duo',
    question: 'En quoi consiste exactement l’expérience de soin en duo ?',
    answer: 'Notre spécialité signature permet à deux personnes de recevoir leur soin simultanément dans la même suite privée feutrée. Deux massothérapeutes professionnelles et synchronisées prennent soin de vous côte à côte, créant un moment privilégié de connexion et de quiétude partagée.',
  },
  {
    category: 'reservation',
    question: 'Comment s’effectue le paiement du dépôt ?',
    answer: 'Conformément à nos politiques, un dépôt de 50 % du montant total est requis lors de la réservation en ligne pour bloquer les ressources (les deux thérapeutes et la suite duo). Le solde de 50 % restant est payable sur place lors de votre visite, par carte de débit, crédit ou comptant.',
  },
  {
    category: 'politiques',
    question: 'Quelle est la politique d’annulation et de modification ?',
    answer: 'Vous pouvez annuler ou déplacer sans aucuns frais votre rendez-vous jusqu’à 24 heures avant l’heure prévue (avec remboursement intégral immédiat de votre dépôt). À moins de 24 heures de préavis, le dépôt est conservé afin de compenser les deux thérapeutes mobilisées.',
  },
  {
    category: 'general',
    question: 'Délivrez-vous des reçus pour les assurances collectives ?',
    answer: 'Dans le cadre réel d’exploitation, l’émission des reçus d’assurance en massothérapie dépendra des adhésions professionnelles confirmées de chaque thérapeute de l’équipe (ex. FQM, RMPQ, etc.). Cette mention est présentée ici à titre d’illustration pour le prototype.',
  },
  {
    category: 'general',
    question: 'Combien de temps à l’avance devons-nous arriver ?',
    answer: 'Nous vous invitons à vous présenter 15 minutes avant votre heure de soin afin de profiter de notre espace d’accueil, déguster une tisane et compléter votre formulaire de santé confidentiel (conforme à la Loi 25 sur la protection des données).',
  },
  {
    category: 'reservation',
    question: 'Peut-on personnaliser nos soins dans le duo ?',
    answer: 'Oui, tout à fait. Même si vous partagez la même suite, chaque thérapeute adapte ses manœuvres, la pression (douce, moyenne, profonde) et les options choisies (aromathérapie, pierres, etc.) selon les besoins spécifiques de chaque personne.',
  }
];
