import React from 'react';
import { ArrowRight, Sparkles, Users, ShieldCheck, Heart, Clock, Star, MapPin } from 'lucide-react';
import type { Treatment } from '../types/treatment';
import { TreatmentCard } from '../components/TreatmentCard';
import { SPA_FALLBACK_IMAGE } from '../data/treatmentsData';

interface HomePageProps {
  featuredTreatments: Treatment[];
  onNavigate: (view: string) => void;
  onOpenBooking: (treatmentId?: string) => void;
  onViewDetails: (treatment: Treatment) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  featuredTreatments,
  onNavigate,
  onOpenBooking,
  onViewDetails,
}) => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-32 bg-gradient-to-b from-ivory-200/60 via-ivory-100 to-ivory-50">
        {/* Soft background ambient shapes */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-sage-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-gold-200/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-sage-100/90 border border-sage-300/80 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-sage-900 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                <span>Sanctuaire de bien-être exclusif à Joliette</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-sage-950 font-normal tracking-tight leading-[1.15]">
                L’art d’une détente partagée <span className="italic font-normal font-serif text-gold-600 block sm:inline">en toute intimité.</span>
              </h1>

              <p className="text-base sm:text-lg text-taupe-700 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Évadez-vous à deux au sein d’une suite feutrée pensée pour votre sérénité. Duo Spa propose une synchronisation parfaite de deux massothérapeutes certifiées, offrant à chaque invité un soin sur mesure au même instant.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onOpenBooking()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-sage-800 hover:bg-sage-900 text-ivory-50 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-sage-700"
                >
                  <Sparkles className="w-4 h-4 text-gold-300" />
                  <span>Réserver un soin</span>
                </button>

                <button
                  onClick={() => onNavigate('duo')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/90 hover:bg-sand-100 text-taupe-800 border border-sand-300 px-7 py-4 rounded-full text-base font-medium transition-colors"
                >
                  <span>L’Expérience Duo</span>
                  <ArrowRight className="w-4 h-4 text-sage-700" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-sand-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-800 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-taupe-800 block">2 Thérapeutes</span>
                    <span className="text-[11px] text-taupe-500">Synchronie absolue</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-800 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-taupe-800 block">Reçus d’assurance</span>
                    <span className="text-[11px] text-taupe-500">Sous réserve d’accréditation</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-800 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-taupe-800 block">Annulation 24 h</span>
                    <span className="text-[11px] text-taupe-500">Règle de démonstration</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Large Image */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] relative">
                  <img
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80"
                    alt="Espace bien-être et soins Duo Spa"
                    onError={(e) => {
                      e.currentTarget.src = SPA_FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-xs font-semibold tracking-widest uppercase text-gold-300 mb-1 block">
                      Suite Duo Privative
                    </span>
                    <p className="font-serif text-xl sm:text-2xl font-light">
                      Deux tables chauffantes, lumières tamisées et arômes boréaux.
                    </p>
                  </div>
                </div>

                {/* Floating Highlight Card */}
                <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-sand-200 max-w-[240px] hidden sm:block">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex text-gold-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-taupe-800">5.0 / 5 (Illustration)</span>
                  </div>
                  <p className="text-xs text-taupe-600 leading-snug">
                    « Une expérience en duo incomparable à Joliette. Sérénité absolue. »
                  </p>
                  <span className="text-[10px] text-sand-500 block mt-1 font-medium">— Exemple d'avis client (Démo)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section: The Essence of Duo Spa */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-widest text-gold-700 uppercase">
            Notre philosophie
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-sage-950 font-semibold">
            Pourquoi choisir l’expérience Duo Spa ?
          </h2>
          <p className="text-taupe-600 text-sm sm:text-base leading-relaxed">
            Nous avons repensé la réservation et l’expérience du spa pour répondre spécifiquement aux besoins des soins simultanés, sans compromis sur l’intimité ni la qualité thérapeutique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-sand-200 shadow-xs hover:border-sage-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-800 flex items-center justify-center border border-sage-200">
              <Users className="w-6 h-6 text-sage-700" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-sage-900">
              Duo véritablement simultané
            </h3>
            <p className="text-taupe-600 text-sm leading-relaxed">
              Pas de décalage horaire ni d’attente dans le salon : deux massothérapeutes qualifiées débutent et concluent votre rituel à la même seconde dans votre suite commune.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-sand-200 shadow-xs hover:border-sage-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-800 flex items-center justify-center border border-gold-200">
              <Sparkles className="w-6 h-6 text-gold-600" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-sage-900">
              Sur-mesure pour chaque personne
            </h3>
            <p className="text-taupe-600 text-sm leading-relaxed">
              Bien que vous partagiez le même moment, chacun choisit son intensité de massage (détente douce, décongestion profonde, aromathérapie ou pierres chaudes) selon ses envies.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-sand-200 shadow-xs hover:border-sage-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-800 flex items-center justify-center border border-sage-200">
              <Heart className="w-6 h-6 text-sage-700" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-sage-900">
              Ambiance cocon lanaudoise
            </h3>
            <p className="text-taupe-600 text-sm leading-relaxed">
              Musique relaxante apaisante, serviettes tièdes, infusions locales québécoises offertes et temps de repos privatif avant de reprendre le fil de votre journée.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Treatments Carousel / Grid */}
      <section className="bg-sand-50/70 py-20 border-y border-sand-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-gold-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sélection coup de cœur</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-sage-950 font-semibold">
                Nos soins et rituels les plus appréciés
              </h2>
              <p className="text-taupe-600 text-sm sm:text-base mt-2 max-w-xl">
                Découvrez nos formules signatures en duo et nos soins individuels haut de gamme.
              </p>
            </div>

            <button
              onClick={() => onNavigate('soins')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-sage-800 hover:text-sage-950 group self-start md:self-auto"
            >
              <span>Consulter l’ensemble des soins</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTreatments.slice(0, 3).map((treatment) => (
              <TreatmentCard
                key={treatment.id}
                treatment={treatment}
                onViewDetails={onViewDetails}
                onBookTreatment={(t) => onOpenBooking(t.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Duo Spa Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sage-900 text-ivory-50 rounded-3xl overflow-hidden shadow-xl border border-sage-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-6">
              <span className="inline-block text-xs uppercase tracking-widest text-gold-300 font-semibold bg-sage-800/80 px-3 py-1 rounded-full">
                Concept Signature Duo
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
                Une suite intime pensée pour <span className="italic text-gold-300 font-normal">deux personnes</span> en parfaite communion.
              </h2>

              <p className="text-ivory-200 text-sm sm:text-base leading-relaxed font-light">
                Que ce soit en couple, entre amies complices, ou pour un moment parent-enfant précieux, notre suite duo offre une bulle hors du temps. Notre système réserve automatiquement la salle exclusive ainsi que deux massothérapeutes qualifiées libres en même temps.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onOpenBooking('duo-detente-60')}
                  className="bg-gold-500 hover:bg-gold-400 text-taupe-900 font-semibold px-7 py-3.5 rounded-full text-sm transition-all shadow text-center focus-visible:ring-2 focus-visible:ring-gold-300 focus:outline-none"
                >
                  Réserver un soin en duo (dès 115 $ / pers. - Démo)
                </button>
                <button
                  onClick={() => onNavigate('duo')}
                  className="inline-flex items-center justify-center gap-2 border border-ivory-300/40 hover:bg-white/10 text-ivory-100 text-sm px-6 py-3.5 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
                >
                  En savoir plus sur le rituel duo
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 lg:h-full min-h-[360px] relative">
              <img
                src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1000&q=80"
                alt="Ambiance intime soin duo"
                onError={(e) => {
                  e.currentTarget.src = SPA_FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-sage-900 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials from Clients in Lanaudière */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold tracking-widest text-gold-700 uppercase">
            Témoignages (Exemples d’illustration)
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-sage-950 font-semibold">
            Ce que nos clients pourraient vivre
          </h2>
          <p className="text-taupe-600 text-xs sm:text-sm">
            Exemples de retours d’expérience représentatifs rédigés pour le prototype (contenu fictif non vérifié).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex text-gold-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-taupe-700 text-sm italic leading-relaxed">
                « Nous avons réservé le massage détente en duo pour notre anniversaire de mariage. L’accueil chaleureux, la synchronisation des deux thérapeutes et les odeurs d’eucalyptus étaient tout simplement magiques. »
              </p>
            </div>
            <div className="pt-4 border-t border-sand-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-taupe-900 block">Isabelle & Guillaume</span>
                <span className="text-xs text-taupe-500">Joliette (QC)</span>
              </div>
              <span className="text-[11px] bg-sage-100 text-sage-800 px-2 py-0.5 rounded font-medium">Soin Duo 90 min</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex text-gold-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-taupe-700 text-sm italic leading-relaxed">
                « Maman et moi voulions une pause réconfortante. Trouver un spa où l’on est massées dans la même pièce sans sensation de précipitation est rare. Les tables chauffantes et la tisane à la fin sont la touche parfaite. »
              </p>
            </div>
            <div className="pt-4 border-t border-sand-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-taupe-900 block">Camille B.</span>
                <span className="text-xs text-taupe-500">Saint-Charles-Borromée</span>
              </div>
              <span className="text-[11px] bg-sage-100 text-sage-800 px-2 py-0.5 rounded font-medium">Rituel Sérénité</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex text-gold-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-taupe-700 text-sm italic leading-relaxed">
                « Le système de réservation en ligne est tellement simple et clair. Voir le montant du dépôt de 50 % et savoir que mes reçus d’assurance sont prêts dès la fin du soin fait toute la différence. »
              </p>
            </div>
            <div className="pt-4 border-t border-sand-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-taupe-900 block">Alexandre T.</span>
                <span className="text-xs text-taupe-500">Notre-Dame-des-Prairies</span>
              </div>
              <span className="text-[11px] bg-sage-100 text-sage-800 px-2 py-0.5 rounded font-medium">Suédois Thérapeutique</span>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Opening Invitation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ivory-200/70 rounded-3xl p-8 sm:p-12 border border-sand-300 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-sage-800 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-sage-600" />
              Au centre-ville de Joliette
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-sage-950 font-semibold">
              Envie d’une pause bienfaisante ?
            </h3>
            <p className="text-taupe-600 text-sm max-w-lg">
              Stationnement pratique sur place. Réservation en ligne 24h/24 avec choix de vos créneaux et confirmation immédiate.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => onOpenBooking()}
              className="bg-sage-800 hover:bg-sage-900 text-ivory-50 px-8 py-3.5 rounded-full text-sm font-semibold transition-all shadow text-center"
            >
              Choisir un créneau en ligne
            </button>
            <button
              onClick={() => onNavigate('spa-joliette')}
              className="bg-white hover:bg-sand-100 text-taupe-800 px-6 py-3.5 rounded-full text-sm font-medium border border-sand-300 transition-colors text-center"
            >
              Informations d’accès
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
