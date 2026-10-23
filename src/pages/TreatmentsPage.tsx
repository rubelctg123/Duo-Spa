import React, { useState, useMemo } from 'react';
import { Sparkles, Info, Filter, Users, User, ArrowUpDown } from 'lucide-react';
import type { Treatment, CategoryType } from '../types/treatment';
import { TreatmentCard } from '../components/TreatmentCard';

interface TreatmentsPageProps {
  treatments: Treatment[];
  onOpenBooking: (treatmentId?: string) => void;
  onViewDetails: (treatment: Treatment) => void;
}

export const TreatmentsPage: React.FC<TreatmentsPageProps> = ({
  treatments,
  onOpenBooking,
  onViewDetails,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'duo' | 'solo'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'duration'>('recommended');

  const categories = [
    { id: 'all', label: 'Tous les soins' },
    { id: 'duo', label: 'Soins en Duo (2 Thérapeutes)' },
    { id: 'massage', label: 'Massothérapie' },
    { id: 'visage', label: 'Soins du Visage' },
    { id: 'forfaits', label: 'Rituels & Forfaits' },
  ];

  const filteredTreatments = useMemo(() => {
    let list = treatments.filter((item) => {
      const matchCat =
        activeCategory === 'all'
          ? true
          : activeCategory === 'duo'
          ? item.format === 'duo'
          : item.category === activeCategory;

      const matchFormat =
        selectedFormat === 'all' ? true : item.format === selectedFormat;

      return matchCat && matchFormat;
    });

    // Sorting
    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.pricePerPerson - a.pricePerPerson);
    } else if (sortBy === 'duration') {
      list = [...list].sort((a, b) => a.durationMinutes - b.durationMinutes);
    }

    return list;
  }, [treatments, activeCategory, selectedFormat, sortBy]);

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* Header section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-sage-100/90 text-sage-900 border border-sage-200 px-4 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-500" />
          <span>Menu des soins & Expériences bien-être</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-sage-950 font-normal tracking-tight">
          Notre carte de soins à Joliette
        </h1>

        <p className="text-taupe-600 text-base max-w-2xl mx-auto leading-relaxed">
          Prenez le temps de vous ressourcer. Chaque soin est prodigué par nos thérapeutes agréées avec des huiles végétales de qualité et une attention personnalisée à chaque instant.
        </p>

        {/* Demo Data Disclaimer */}
        <div className="max-w-3xl mx-auto mt-4 p-3.5 bg-sand-100/90 border border-sand-300 rounded-2xl flex items-start sm:items-center gap-3 text-left text-xs text-taupe-700">
          <Info className="w-4 h-4 text-gold-600 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <strong className="font-semibold text-taupe-900">Échantillon de catalogue (Contenu de démonstration) :</strong>
            <span className="text-taupe-600 ml-1">
              Les soins, durées et tarifs ci-dessous constituent une maquette représentative pour la Phase 1. Le catalogue officiel de Duo Spa sera synchronisé lors de la mise en service avec GoHighLevel.
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Category Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as CategoryType)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-sage-800 text-ivory-50 shadow-sm font-semibold'
                  : 'bg-white text-taupe-700 hover:bg-sand-100 border border-sand-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary filters: format and sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sand-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-taupe-500 font-medium inline-flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Format :
            </span>
            <div className="inline-flex rounded-lg bg-sand-100 p-0.5 border border-sand-200">
              <button
                onClick={() => setSelectedFormat('all')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedFormat === 'all'
                    ? 'bg-white text-sage-900 font-semibold shadow-xs'
                    : 'text-taupe-600 hover:text-taupe-900'
                }`}
              >
                Tous ({treatments.length})
              </button>
              <button
                onClick={() => setSelectedFormat('duo')}
                className={`px-3 py-1 rounded-md inline-flex items-center gap-1 transition-colors ${
                  selectedFormat === 'duo'
                    ? 'bg-white text-sage-900 font-semibold shadow-xs'
                    : 'text-taupe-600 hover:text-taupe-900'
                }`}
              >
                <Users className="w-3 h-3 text-gold-600" />
                Duo ({treatments.filter((t) => t.format === 'duo').length})
              </button>
              <button
                onClick={() => setSelectedFormat('solo')}
                className={`px-3 py-1 rounded-md inline-flex items-center gap-1 transition-colors ${
                  selectedFormat === 'solo'
                    ? 'bg-white text-sage-900 font-semibold shadow-xs'
                    : 'text-taupe-600 hover:text-taupe-900'
                }`}
              >
                <User className="w-3 h-3" />
                Individuel ({treatments.filter((t) => t.format === 'solo').length})
              </button>
            </div>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-treatments-select" className="text-taupe-600 font-medium inline-flex items-center gap-1 cursor-pointer">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Trier par :
            </label>
            <select
              id="sort-treatments-select"
              aria-label="Trier la liste des soins"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-sand-200 text-taupe-800 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-sage-600"
            >
              <option value="recommended">Recommandés</option>
              <option value="price-asc">Prix (croissant)</option>
              <option value="price-desc">Prix (décroissant)</option>
              <option value="duration">Durée du soin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Treatment Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredTreatments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-sand-200 p-8 space-y-3">
            <p className="text-taupe-600 font-medium">Aucun soin ne correspond à ces critères de sélection.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedFormat('all');
              }}
              className="text-sage-800 text-xs font-semibold underline underline-offset-4"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTreatments.map((treatment) => (
              <TreatmentCard
                key={treatment.id}
                treatment={treatment}
                onViewDetails={onViewDetails}
                onBookTreatment={(t) => onOpenBooking(t.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reassurance Footer Banner on Treatments */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-sage-100/70 border border-sage-200/90 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-sage-900">
              Besoin d’aide pour choisir votre soin ?
            </h3>
            <p className="text-xs sm:text-sm text-taupe-600">
              Notre équipe à Joliette répond avec plaisir à vos questions concernant les soins prénataux, les forfaits ou les besoins spécifiques.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenBooking()}
              className="bg-sage-800 hover:bg-sage-900 text-ivory-50 px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs"
            >
              Accéder à la réservation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
