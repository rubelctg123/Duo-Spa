import React, { useState } from 'react';
import { Info, X, Sparkles } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <aside aria-label="Mode démonstration" className="bg-sage-900 text-ivory-100 text-xs sm:text-sm py-2 px-4 border-b border-gold-500/30 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-gold-400 animate-pulse"></span>
          <span className="inline-flex items-center gap-1.5 font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-gold-300" />
            <strong className="font-semibold text-gold-200">Prototype Phase 1 – Duo Spa Joliette :</strong>
            <span className="text-ivory-200 hidden md:inline">
              Interface vitrine & maquette de réservation. La synchronisation GoHighLevel, les créneaux en temps réel, le paiement bancaire effectif et les notifications SMS/courriels ne sont pas encore connectés.
            </span>
            <span className="text-ivory-200 md:hidden">
              Version prototype interactif (sans paiement ni connexion externe).
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1 bg-sage-800/80 text-gold-300 px-2 py-0.5 rounded text-[11px] font-mono border border-sage-700">
            <Info className="w-3 h-3" />
            Mode Démo
          </span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le bandeau d’information"
            className="text-ivory-300 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
