import React, { useEffect } from 'react';
import { X, Clock, Users, Check, Sparkles, AlertCircle, PlusCircle, ArrowRight, Info } from 'lucide-react';
import type { Treatment } from '../types/treatment';
import { SPA_FALLBACK_IMAGE } from '../data/treatmentsData';

interface TreatmentDetailModalProps {
  treatment: Treatment | null;
  onClose: () => void;
  onBook: (treatment: Treatment) => void;
}

export const TreatmentDetailModal: React.FC<TreatmentDetailModalProps> = ({
  treatment,
  onClose,
  onBook,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (treatment) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [treatment, onClose]);

  if (!treatment) return null;

  const isDuo = treatment.format === 'duo';
  const depositAmount = Math.round(treatment.totalPrice * 0.5);
  const balanceOnSite = treatment.totalPrice - depositAmount;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-treatment-title"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-sand-300 max-h-[92vh] flex flex-col my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Fermer la fenêtre de détail"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-64 sm:h-72 w-full bg-sand-200 shrink-0">
          <img
            src={treatment.image}
            alt={`Illustration du soin ${treatment.name}`}
            onError={(e) => {
              e.currentTarget.src = SPA_FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 bg-gold-500/90 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                <Users className="w-3 h-3" />
                {isDuo ? 'Expérience Duo (2 Thérapeutes)' : 'Soin Individuel (1 Thérapeute)'}
              </span>
              {treatment.badge && (
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-ivory-100 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  <Sparkles className="w-3 h-3 text-gold-300" />
                  {treatment.badge}
                </span>
              )}
            </div>
            <h2 id="modal-treatment-title" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              {treatment.name}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Demo disclaimer banner */}
          <div className="p-3 bg-sand-100/90 border border-sand-300 rounded-xl flex items-start gap-2.5 text-xs text-taupe-700">
            <Info className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-taupe-900">Fiche de présentation prototype :</span>
              <span className="text-taupe-600 ml-1">
                Les descriptions, durées et tarifs sont fournis à titre de démonstration pour valider la maquette Phase 1.
              </span>
            </div>
          </div>

          {/* Key metrics bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-sand-50 border border-sand-200">
            <div>
              <span className="text-[11px] font-semibold text-taupe-500 uppercase tracking-wider block">Durée</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-sage-900 text-base">
                <Clock className="w-4 h-4 text-sage-600" />
                {treatment.durationLabel}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-taupe-500 uppercase tracking-wider block">Tarif d’exemple</span>
              <span className="text-base font-semibold text-sage-900">
                {treatment.pricePerPerson} $ CAD <span className="text-xs font-normal text-taupe-600">{isDuo ? '/ pers.' : ''}</span>
              </span>
              {isDuo && (
                <span className="text-xs text-taupe-500 block">Total duo : {treatment.totalPrice} $</span>
              )}
            </div>
            <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-sand-200">
              <span className="text-[11px] font-semibold text-taupe-500 uppercase tracking-wider block">Dépôt requis (50 % démo)</span>
              <span className="text-sm font-semibold text-gold-700">
                {depositAmount} $ (Simulé)
              </span>
              <span className="text-xs text-taupe-500 block">Solde de {balanceOnSite} $ sur place</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-taupe-500 uppercase tracking-wider mb-2">Description du soin</h3>
            <p className="text-taupe-700 leading-relaxed text-sm sm:text-base">
              {treatment.fullDescription}
            </p>
          </div>

          {/* Bienfaits */}
          <div>
            <h3 className="text-xs font-bold text-taupe-500 uppercase tracking-wider mb-3">Bienfaits & Effets recherchés</h3>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {treatment.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-taupe-700">
                  <div className="w-5 h-5 rounded-full bg-sage-100 flex items-center justify-center shrink-0 mt-0.5 text-sage-700">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ce qui est inclus */}
          <div>
            <h3 className="text-xs font-bold text-taupe-500 uppercase tracking-wider mb-3">Déroulement & Inclusions</h3>
            <ul className="space-y-2 text-sm text-taupe-700">
              {treatment.includes.map((inc, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0"></span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Add-ons placeholder section */}
          <div className="border border-sand-200 rounded-2xl p-4 bg-ivory-50/70">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-sage-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-gold-600" />
                Options complémentaires disponibles lors de la réservation
              </h3>
              <span className="text-xs text-taupe-500 font-mono">Facultatif</span>
            </div>
            <div className="space-y-2">
              {treatment.availableAddons.map((addon) => (
                <div key={addon.id} className="flex items-center justify-between text-xs sm:text-sm bg-white p-2.5 rounded-xl border border-sand-200">
                  <div>
                    <span className="font-semibold text-taupe-800">{addon.name}</span>
                    <span className="text-taupe-500 block text-xs">{addon.description}</span>
                  </div>
                  <span className="font-semibold text-sage-800 ml-3 whitespace-nowrap">
                    +{addon.price} $ CAD
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Restrictions / Notice */}
          {treatment.restrictions && (
            <div className="flex items-start gap-3 p-3.5 bg-sand-100/70 border border-sand-300/80 rounded-xl text-xs text-taupe-700">
              <AlertCircle className="w-4 h-4 text-sand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-taupe-800">Précautions & Remarques :</span> {treatment.restrictions}
                <span className="block mt-1 text-taupe-500">Un bilan de santé confidentiel sera complété avant la séance conformément aux normes de l’ordre et à la Loi 25.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-ivory-50 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-taupe-500 text-center sm:text-left">
            <span>Règle d’annulation 24 h (démo selon cahier des charges).</span>
            <span className="block font-medium text-sage-800">Reçus d’assurance (selon accréditations de l’équipe confirmées).</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-full border border-sand-300 text-taupe-700 text-sm hover:bg-sand-100 transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(treatment);
              }}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 bg-sage-800 hover:bg-sage-900 text-ivory-50 px-6 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all"
            >
              <span>Réserver ce soin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
