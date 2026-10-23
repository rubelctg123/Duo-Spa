import React from 'react';
import { Sparkles, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  const currentYear = 2026;

  return (
    <footer className="bg-taupe-900 text-ivory-200 pt-16 pb-12 border-t border-sand-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-taupe-700/60">
          {/* Column 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sage-800 flex items-center justify-center text-gold-300 border border-gold-400/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-ivory-50 tracking-wider">
                  Duo Spa
                </span>
                <span className="block text-[11px] uppercase tracking-widest text-sand-400">
                  Joliette • Soins en duo & Massothérapie
                </span>
              </div>
            </div>

            <p className="text-sand-300 text-sm leading-relaxed max-w-md">
              Un sanctuaire raffiné dédié à la déconnexion et au bien-être partagé au cœur de Lanaudière. Notre spécialité signature : des soins en duo parfaitement synchronisés par deux thérapeutes dévouées dans une suite intime privatisée.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-gold-300/90">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Pratique de massothérapie conforme aux normes québécoises (reçus d’assurance sous réserve d’accréditation)</span>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-semibold text-ivory-100 tracking-wide">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-sand-300">
              <li>
                <button
                  onClick={() => { onNavigate('accueil'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-gold-300 transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('soins'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-gold-300 transition-colors"
                >
                  Carte des soins
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('duo'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-gold-300 transition-colors"
                >
                  L’Expérience Duo
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('spa-joliette'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-gold-300 transition-colors"
                >
                  Le Spa & Accès
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-gold-300 transition-colors"
                >
                  Foire aux questions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-semibold text-ivory-100 tracking-wide">
              Coordonnées (Exemple démo)
            </h3>
            <ul className="space-y-2.5 text-sm text-sand-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sage-400 shrink-0 mt-1" />
                <span>Centre-ville de Joliette<br />Lanaudière (QC) • <span className="text-xs text-sand-400">Emplacement démo</span></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sage-400 shrink-0" />
                <span>(450) 000-0000 <span className="text-[10px] text-sand-400">(Numéro démo)</span></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sage-400 shrink-0" />
                <span>contact-demo@duospa-joliette.ca</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Horaires & Action */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-semibold text-ivory-100 tracking-wide">
              Horaires (Exemple démo)
            </h3>
            <div className="space-y-2 text-xs text-sand-300">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-ivory-100 block">Mardi au Dimanche</span>
                  <span>9 h 00 à 20 h 00 (Indicatif)</span>
                </div>
              </div>
              <div className="text-sand-400 pl-6">
                Lundi : Fermé pour ressourcement
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full bg-sage-700 hover:bg-sage-600 text-ivory-50 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm border border-sage-500/40 text-center"
              >
                Réserver en ligne
              </button>
            </div>
          </div>
        </div>

        {/* Prototype & Legal Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sand-400">
          <div>
            <p>
              © {currentYear} Duo Spa Joliette. Tous droits réservés.
              <span className="mx-2 text-sand-600">•</span>
              Protection des renseignements personnels conforme à la <strong>Loi 25 (Québec)</strong>.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sand-400 text-[11px] bg-taupe-800/80 px-3 py-1.5 rounded-lg border border-taupe-700">
            <span>Prototype Phase 1 – Conforme au cahier des charges GHL</span>
            <Heart className="w-3 h-3 text-gold-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
