# Duo Spa – Site Web & Prototype de Réservation (Phase 1 : Frontend Premium)

Site vitrine haut de gamme et prototype interactif de réservation en ligne pour **Duo Spa** situé à Joliette, Québec (Lanaudière). Développé conformément aux spécifications du *Cahier des charges – Version 2.0*.

---

## 🌿 Aperçu du Projet (Phase 1)

Ce projet livre l'ensemble de l'interface utilisateur cliente et le parcours complet de réservation en mode prototype. **Aucune API externe, passerelle bancaire ou automatisation GoHighLevel (GHL) n'a été raccordée à ce stade** (prévu en Phase 2).

### 🎨 Direction Visuelle & Design System
- **Palette chromatique apaisante :** Ivoire chaleureux (`#FAF7F0`), blanc pur, vert sauge tamisé (`#3C533A`, `#648561`), beige sable doux et accents dorés retenus (`#CCA04D`, `#B88628`).
- **Typographie élégante :** Titres en *Playfair Display* (sérif noble et raffiné) et corps de texte en *Plus Jakarta Sans* (lisibilité maximale et fluidité moderne).
- **Adaptabilité totale :** Conçu pour mobile, tablette et écran d'ordinateur de bureau.
- **Ton & Langue :** Français québécois soigné et naturel, respectant la législation locale (Loi 25 sur la protection des données) et les normes de la massothérapie agréée.

---

## 📑 Pages et Composants Réalisés

1. **Accueil (`HomePage.tsx`) :**
   - Section héro avec proposition de valeur claire (« L'art d'une détente partagée en toute intimité ») et appel à l'action principal *Réserver un soin*.
   - 4 piliers de confiance (2 thérapeutes en synchronie, suite privative feutrée, reçus d'assurance, politique 24 h).
   - Sélection vedette de soins (cartes interactives avec prix par personne et total duo).
   - Mise en lumière de l'expérience exclusive de soins en duo simultanés.
   - Témoignages clients authentiques de Joliette et Lanaudière.
   - Accès et localisation à Joliette.

2. **Nos soins (`TreatmentsPage.tsx`) :**
   - Filtrage par catégorie (*Tous les soins*, *Soins en Duo*, *Massothérapie*, *Soins du Visage*, *Rituels & Forfaits*).
   - Filtrage par format (*Tous*, *Duo seulement*, *Individuel seulement*) et tri dynamique (prix, durée, recommandés).
   - Cartes de soins réutilisables affichant badge, durée, tarif par personne, tarif duo total, bienfaits et bouton d'action.
   - Mention claire de données de démonstration / prototype.

3. **L’Expérience Duo (`DuoExperiencePage.tsx`) :**
   - Page dédiée expliquant le concept différenciateur : 2 clients massés en même temps par 2 thérapeutes certifiées dans la même pièce.
   - Guide pas à pas de la visite (Accueil & consultation, Installation en suite duo, Soin synchronisé, Réveil & reçus).
   - Présentation des occasions privilégiées (couples, amies, mère-fille).

4. **Détail du soin (`TreatmentDetailModal.tsx`) :**
   - Modale réutilisable accessible au clic sur n'importe quel soin.
   - Décomposition détaillée de la durée, tarif par personne, calcul du dépôt de 50 % en ligne et solde sur place.
   - Liste des bienfaits ciblés, inclusions et déroulement du soin.
   - Module des options complémentaires facultatives (aromathérapie bio, huile chaude d'argan, masque collagène, etc.).
   - Précautions médicales et avis de confidentialité Loi 25.

5. **Réservation (`BookingPage.tsx`) :**
   - Parcours de réservation en 4 étapes intuitives :
     1. *Soin & Options :* Choix de la prestation, compléments facultatifs, préférence de thérapeute.
     2. *Date & Heure :* Calendrier interactif (30 jours, hors lundis de fermeture) et créneaux horaires avec validation de ressource (suite duo + 2 thérapeutes disponibles).
     3. *Coordonnées :* Client principal + **formulaire du 2ᵉ invité pour les soins en duo** (prénom, nom, courriel, préférences de pression/tensions).
     4. *Dépôt (50 %) & Récapitulatif :* Simulation sécurisée de paiement par carte avec avertissement explicite de mode démo (aucun débit réel).

6. **Confirmation (`ConfirmationPage.tsx`) :**
   - Page récapitulative avec numéro de réservation démo généré (`DUO-JOL-XXXXX`).
   - Synthèse complète : Soin, date, heure, nom des 2 invités, montant du dépôt simulé et solde à régler au spa.
   - Rappel de la politique d'annulation 24 h.
   - Présentation de l'architecture Phase 2 (courriel avec fichier `.ics`, rappel SMS 24 h, synchronisation GHL).
   - Options d'impression et nouvelle réservation.

7. **Composants d'encadrement :**
   - `DemoBanner.tsx` : Bandeau discret informant les visiteurs du mode démonstration Phase 1.
   - `Navbar.tsx` : Navigation fluide avec liens d'ancrage, indicateur actif, raccourci réservation et menu mobile réactif.
   - `Footer.tsx` : Coordonnées complètes à Joliette, horaires, politique Loi 25, et liens rapides.

---

## 🛠️ Stack Technique

- **Framework :** React 19 + TypeScript + Vite
- **Styles :** Tailwind CSS avec palette personnalisée (ivory, sage, sand, gold, taupe)
- **Icônes :** Lucide React
- **Linter & Contrôles :** Oxlint (0 erreurs, 0 avertissements), TypeScript `tsc -b` (0 erreurs)

---

## 🚀 Commandes Disponibles

```bash
# Lancer le serveur de développement
npm run dev

# Vérifier la qualité du code (linter)
npm run lint

# Compiler pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

---

## 🔮 Feuille de Route pour la Phase 2 (Backend & Intégrations)

1. **Raccordement GoHighLevel (GHL) :**
   - Connexion à l'API GHL pour lire en temps réel les disponibilités des thérapeutes admissibles et croiser les créneaux communs pour les duos.
   - Réservation automatique de la suite duo et création simultanée des deux rendez-vous liés rattachés au client.
   - Gestion des conflits et prévention du double-booking.
2. **Passerelle de Paiement Réelle :**
   - Intégration de la solution de paiement certifiée du spa pour le prélèvement réel de l'acompte de 50 %.
   - Gestion des remboursements automatiques en cas d'annulation avec plus de 24 h de préavis.
3. **Automatisations & Notifications :**
   - Envoi du courriel de confirmation avec fichier calendrier (`.ics` Google/Apple).
   - Déclenchement du SMS de confirmation et du rappel automatique 24 h avant le rendez-vous.
   - Ajout automatique d'une ligne de suivi dans le Google Sheet interne de gestion.
4. **Catalogue officiel & Formulaire de santé numérique :**
   - Synchronisation de la liste finale des soins et thérapeutes officiels de Duo Spa.
   - Formulaire d'évaluation de santé pré-soin conforme à la Loi 25.
