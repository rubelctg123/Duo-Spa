import React from 'react';
import { Users, Sparkles, Heart, CheckCircle2, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import type { Treatment } from '../types/treatment';
import { SPA_FALLBACK_IMAGE } from '../data/treatmentsData';

interface DuoExperiencePageProps {
  onOpenBooking: (treatmentId?: string) => void;
  duoTreatments: Treatment[];
  onViewDetails: (treatment: Treatment) => void;
}

export const DuoExperiencePage: React.FC<DuoExperiencePageProps> = ({
  onOpenBooking,
  duoTreatments,
  onViewDetails,
}) => {
  return (
    <div className="py-12 sm:py-16 space-y-20">
      {/* Hero of Duo Experience */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-gold-100 text-gold-900 border border-gold-300/80 px-4 py-1.5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>La Signature Duo Spa à Joliette</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-sage-950 font-normal leading-tight">
              Deux personnes massées <span className="italic text-gold-700 font-serif">en même temps</span> dans une suite privée exclusive.
            </h1>

            <p className="text-taupe-700 text-base sm:text-lg leading-relaxed font-light">
              Chez Duo Spa, le soin en duo n’est pas une option secondaire : c’est le cœur même de notre vocation. Nous coordonnons deux massothérapeutes certifiées pour qu’elles œuvrent côte à côte, au même rythme, vous offrant une détente partagée d’une rare intensité.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => onOpenBooking('duo-detente-60')}
                className="inline-flex items-center justify-center gap-2 bg-sage-800 hover:bg-sage-900 text-ivory-50 px-8 py-4 rounded-full text-sm font-semibold transition-all shadow-md"
              >
                <span>Réserver une expérience Duo</span>
                <ArrowRight className="w-4 h-4 text-gold-300" />
              </button>
            </div>

            {/* Quick points */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-taupe-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Deux lits chauffants côte à côte</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Deux massothérapeutes dédiées</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Pression sur mesure pour chacun</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Reçus d’assurance (selon accréditations de l’équipe)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] relative">
              <img
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=80"
                alt="Suite de massage en duo à Joliette"
                onError={(e) => {
                  e.currentTarget.src = SPA_FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-1.5 text-gold-300 text-xs font-semibold uppercase mb-1">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Sanctuaire Complice</span>
                </div>
                <p className="font-serif text-xl sm:text-2xl font-light">
                  Partager le calme, multiplier les bienfaits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Walkthrough */}
      <section className="bg-sand-50 py-16 sm:py-20 border-y border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold tracking-widest text-gold-700 uppercase">
              Déroulement de votre visite
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-sage-950 font-semibold">
              Comment se déroule votre soin en duo ?
            </h2>
            <p className="text-taupe-600 text-sm sm:text-base">
              De votre arrivée jusqu’à votre départ, chaque étape est pensée pour une fluidité sans pareil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="w-10 h-10 rounded-2xl bg-sage-800 text-gold-300 font-serif text-lg font-bold flex items-center justify-center mb-4">
                  01
                </span>
                <h3 className="font-serif text-lg font-semibold text-sage-900 mb-2">
                  Accueil & Consultation
                </h3>
                <p className="text-taupe-600 text-xs sm:text-sm leading-relaxed">
                  Arrivée 15 minutes avant le soin. Bilan de santé pré-massage confidentiel pour comprendre vos attentes et zones de tension respectives.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-100 text-[11px] text-sage-700 font-medium">
                Tisane boréale de bienvenue offerte
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="w-10 h-10 rounded-2xl bg-sage-800 text-gold-300 font-serif text-lg font-bold flex items-center justify-center mb-4">
                  02
                </span>
                <h3 className="font-serif text-lg font-semibold text-sage-900 mb-2">
                  Installation dans la Suite
                </h3>
                <p className="text-taupe-600 text-xs sm:text-sm leading-relaxed">
                  Vous prenez place ensemble dans notre suite duo privée. Tables ergonomiques chauffantes, lumières tamisées et arômes d’eucalyptus bienfaisants.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-100 text-[11px] text-sage-700 font-medium">
                Atmosphère calme et intimité garantie
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="w-10 h-10 rounded-2xl bg-sage-800 text-gold-300 font-serif text-lg font-bold flex items-center justify-center mb-4">
                  03
                </span>
                <h3 className="font-serif text-lg font-semibold text-sage-900 mb-2">
                  Soin Simultané & Synchronisé
                </h3>
                <p className="text-taupe-600 text-xs sm:text-sm leading-relaxed">
                  Vos deux thérapeutes travaillent en synergie. Chacune adapte sa technique (pression douce ou ferme, ciblage dos/épaules/jambes) au profil de son client.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-100 text-[11px] text-sage-700 font-medium">
                Début et fin à la même minute
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <span className="w-10 h-10 rounded-2xl bg-sage-800 text-gold-300 font-serif text-lg font-bold flex items-center justify-center mb-4">
                  04
                </span>
                <h3 className="font-serif text-lg font-semibold text-sage-900 mb-2">
                  Réveil Doux & Reçus
                </h3>
                <p className="text-taupe-600 text-xs sm:text-sm leading-relaxed">
                  Moment de retour au calme sans bousculade. Vos reçus d’assurance officiels sont immédiatement générés pour chaque personne.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand-100 text-[11px] text-sage-700 font-medium">
                Paiement du solde restant sur place
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For whom is it ideal? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-widest text-gold-700 uppercase">Toutes les occasions</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-sage-950 font-semibold">
            Pour qui est pensé le soin en duo ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-sand-100 flex items-center justify-center text-sage-800">
              <Heart className="w-6 h-6 text-gold-600" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-sage-900">Les Couples</h3>
            <p className="text-taupe-600 text-xs sm:text-sm leading-relaxed">
              Pour une escapade romantique, un anniversaire de mariage ou simplement pour décrocher à deux du tourbillon quotidien.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-sand-100 flex items-center justify-center text-sage-800">
              <Users className="w-6 h-6 text-sage-700" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-sage-900">Amis & Complices</h3>
            <p className="text-taupe-600 text-xs sm:text-sm leading-relaxed">
              Une journée cocooning entre meilleures amies, une sortie bien-être ou un rituel de détente partagé.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-sand-200 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-sand-100 flex items-center justify-center text-sage-800">
              <Star className="w-6 h-6 text-gold-600" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-sage-900">Mère & Fille / Proches</h3>
            <p className="text-taupe-600 text-xs sm:text-sm leading-relaxed">
              Offrir un cadeau inestimable de temps et de douceur avec un parent, un frère ou une sœur.
            </p>
          </div>
        </div>
      </section>

      {/* Available Duo Treatments Quick Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-700">Formules dédiées</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-sage-950">
              Les soins disponibles en format Duo
            </h2>
          </div>
          <button
            onClick={() => onOpenBooking()}
            className="text-xs font-semibold text-sage-800 hover:text-sage-950 underline underline-offset-4"
          >
            Accéder directement au calendrier de réservation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {duoTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="bg-white rounded-2xl p-6 border border-sand-200 shadow-xs flex flex-col justify-between hover:border-sage-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gold-100 text-gold-800 px-2.5 py-0.5 rounded-full font-medium">
                    {treatment.durationLabel}
                  </span>
                  <span className="text-xs font-semibold text-sage-900">
                    Tarif d'exemple : {treatment.pricePerPerson} $ / pers.
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-sage-900">
                  {treatment.name}
                </h3>
                <p className="text-xs text-taupe-600 leading-relaxed">
                  {treatment.shortDescription}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sand-100 flex items-center gap-2">
                <button
                  onClick={() => onViewDetails(treatment)}
                  className="w-1/2 py-2 text-xs rounded-xl bg-sand-100 text-taupe-700 font-medium hover:bg-sand-200 transition-colors"
                >
                  Voir les détails
                </button>
                <button
                  onClick={() => onOpenBooking(treatment.id)}
                  className="w-1/2 py-2 text-xs rounded-xl bg-sage-800 hover:bg-sage-900 text-ivory-50 font-semibold transition-colors"
                >
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech / Cahier des Charges Note Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ivory-200/60 border border-sand-300 rounded-3xl p-6 sm:p-8 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-sage-700 shrink-0 mt-1" />
          <div className="space-y-1.5 text-xs sm:text-sm text-taupe-700">
            <h4 className="font-semibold text-sage-900">
              Précision technique conforme au Cahier des Charges :
            </h4>
            <p>
              Pour tout soin en duo, notre système réserve en une seule action : <strong>la suite privée duo</strong> et <strong>deux massothérapeutes qualifiées</strong> libres sur toute la plage horaire. En cas de modification ou d’annulation jusqu’à 24 h avant, les deux rendez-vous liés sont libérés et le dépôt remboursé.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
