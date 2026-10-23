import React from 'react';
import { MapPin, Clock, Phone, Mail, Car, Shield, Sparkles, CheckCircle2, Info } from 'lucide-react';
import { SPA_FALLBACK_IMAGE } from '../data/treatmentsData';

interface AboutLocationSectionProps {
  onOpenBooking: () => void;
}

export const AboutLocationSection: React.FC<AboutLocationSectionProps> = ({ onOpenBooking }) => {
  return (
    <div className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-900 border border-sage-300/80 px-4 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-500" />
          <span>Sanctuaire au cœur de Lanaudière</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-sage-950 font-normal">
          Le Spa & Emplacement à Joliette
        </h1>
        <p className="text-taupe-600 text-base leading-relaxed">
          Niché dans une atmosphère feutrée, Duo Spa vous accueille pour un répit mérité à quelques pas de tous les services du centre-ville de Joliette.
        </p>

        {/* Demo Disclaimer notice */}
        <div className="p-3 bg-sand-100/90 border border-sand-300 rounded-2xl flex items-start gap-2.5 text-left text-xs text-taupe-700 max-w-2xl mx-auto">
          <Info className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-taupe-900">Coordonnées et horaires indicatifs :</span>
            <span className="text-taupe-600 ml-1">
              Les coordonnées, l’adresse exacte et les horaires ci-dessous sont présentés à titre de maquette dans le cadre de la Phase 1 et seront confirmés par Duo Spa avant l’ouverture officielle.
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Spa Details & Location */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-xs space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-sage-900">
              Coordonnées & Horaires (Démo)
            </h2>

            <div className="space-y-4 text-sm text-taupe-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sage-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-taupe-900 font-semibold">Emplacement</strong>
                  <span>Centre-ville de Joliette (Québec)</span>
                  <span className="block text-xs text-taupe-500 mt-0.5">Lanaudière • Adresse finale et stationnement à confirmer</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-sage-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-taupe-900 font-semibold">Horaires d’ouverture (Exemple)</strong>
                  <span>Mardi au Dimanche : 9 h 00 à 20 h 00</span>
                  <span className="block text-xs text-taupe-500 mt-0.5">Lundi : Fermé pour ressourcement</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-sage-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-taupe-900 font-semibold">Téléphone de contact</strong>
                  <span>(450) 000-0000 <span className="text-xs text-taupe-500">(Numéro fictif de démonstration)</span></span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-sage-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-taupe-900 font-semibold">Courriel</strong>
                  <span>contact-demo@duospa-joliette.ca <span className="text-xs text-taupe-500">(Adresse d’essai)</span></span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sand-100 flex items-center gap-3">
              <Car className="w-5 h-5 text-gold-600 shrink-0" />
              <p className="text-xs text-taupe-600">
                Accès facile et stationnement gratuit attenant pour nos clients.
              </p>
            </div>
          </div>

          {/* Privacy & Loi 25 */}
          <div className="bg-sand-50 rounded-3xl p-6 border border-sand-200 text-xs text-taupe-700 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sage-900 text-sm">
              <Shield className="w-4 h-4 text-sage-700" />
              <span>Protection des renseignements personnels (Loi 25)</span>
            </div>
            <p className="leading-relaxed">
              Duo Spa veille rigoureusement à la confidentialité de vos informations de santé et de contact. Conformément aux lois du Québec, vos données médicales et vos coordonnées sont sécurisées et strictement réservées à votre thérapeute pour la dispense de votre soin.
            </p>
          </div>
        </div>

        {/* Visual & Atmosphere Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl overflow-hidden border border-sand-200 shadow-md aspect-[16/10] bg-sand-200 relative">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
              alt="Intérieur reposant du spa"
              onError={(e) => {
                e.currentTarget.src = SPA_FALLBACK_IMAGE;
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs text-gold-300 font-semibold uppercase tracking-wider block">Un espace de calme</span>
              <p className="font-serif text-lg">Suite privée chauffée et musique relaxante pour décrocher en toute tranquillité.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-semibold text-sage-900">
              Ce que vous trouverez à votre arrivée :
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-taupe-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Espace lounge pour savourer une tisane bienfaisante</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Vestiaire avec peignoirs moelleux et casiers sécurisés</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Suite duo avec contrôle indépendant de l’ambiance et température</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Produits botaniques écoresponsables du Québec</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full bg-sage-800 hover:bg-sage-900 text-ivory-50 text-xs font-semibold py-3 rounded-xl transition-all shadow"
              >
                Planifier votre visite en ligne
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
