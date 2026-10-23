import React from 'react';
import { Clock, Users, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Treatment } from '../types/treatment';
import { SPA_FALLBACK_IMAGE } from '../data/treatmentsData';

interface TreatmentCardProps {
  treatment: Treatment;
  onViewDetails: (treatment: Treatment) => void;
  onBookTreatment: (treatment: Treatment) => void;
}

export const TreatmentCard: React.FC<TreatmentCardProps> = ({
  treatment,
  onViewDetails,
  onBookTreatment,
}) => {
  const isDuo = treatment.format === 'duo';

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-sand-200/90 shadow-sm hover:shadow-md hover:border-sage-300 transition-all duration-300 flex flex-col h-full">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-sand-100">
        <img
          src={treatment.image}
          alt={`Illustration du soin ${treatment.name}`}
          onError={(e) => {
            e.currentTarget.src = SPA_FALLBACK_IMAGE;
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          {treatment.badge && (
            <span className="inline-flex items-center gap-1 bg-sage-900/90 backdrop-blur-sm text-gold-300 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
              <Sparkles className="w-3 h-3 text-gold-400" />
              {treatment.badge}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm backdrop-blur-md ${
              isDuo
                ? 'bg-gold-500/90 text-white'
                : 'bg-ivory-100/95 text-taupe-800'
            }`}
          >
            <Users className="w-3 h-3" />
            {isDuo ? 'Soin en Duo (2 thérapeutes)' : 'Soin Individuel'}
          </span>
        </div>

        {/* Duration overlay bottom-left */}
        <div className="absolute bottom-3 left-3 text-ivory-50 text-xs font-medium flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-md">
          <Clock className="w-3.5 h-3.5 text-gold-300" />
          <span>{treatment.durationLabel}</span>
        </div>
      </div>

      {/* Body details */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-sage-900 leading-snug group-hover:text-sage-700 transition-colors">
            {treatment.name}
          </h3>

          <p className="mt-2.5 text-taupe-600 text-sm line-clamp-2 leading-relaxed">
            {treatment.shortDescription}
          </p>

          {/* Key highlights bullets */}
          <div className="mt-3.5 space-y-1.5 border-t border-sand-100 pt-3">
            {treatment.benefits.slice(0, 2).map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-taupe-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-6 pt-4 border-t border-sand-100">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-[11px] text-taupe-500 block uppercase tracking-wider">Tarif d’exemple (démo)</span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-2xl font-bold text-sage-900">
                  {treatment.pricePerPerson} $
                </span>
                <span className="text-xs text-taupe-600 font-medium">
                  {isDuo ? '/ personne' : 'total'}
                </span>
              </div>
            </div>
            {isDuo && (
              <div className="text-right">
                <span className="text-[11px] text-taupe-500 block">Total duo estimé</span>
                <span className="text-xs font-semibold text-sage-800 bg-sand-100 px-2 py-0.5 rounded">
                  {treatment.totalPrice} $ CAD
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(treatment)}
              aria-label={`Voir les détails du soin ${treatment.name}`}
              className="w-full text-center px-3 py-2 rounded-xl text-xs font-medium text-taupe-700 bg-sand-100/80 hover:bg-sand-200/80 focus-visible:ring-2 focus-visible:ring-sage-700 focus:outline-none transition-colors"
            >
              Détails du soin
            </button>
            <button
              onClick={() => onBookTreatment(treatment)}
              aria-label={`Réserver le soin ${treatment.name}`}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-ivory-50 bg-sage-800 hover:bg-sage-900 focus-visible:ring-2 focus-visible:ring-sage-700 focus:outline-none transition-all shadow-sm group/btn"
            >
              <span>Réserver</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
