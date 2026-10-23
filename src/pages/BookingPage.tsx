import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Sparkles,
  Info,
  Check,
  User,
  Heart
} from 'lucide-react';
import type { Treatment, BookingState } from '../types/treatment';
import { DEMO_THERAPISTS, DEMO_TIME_SLOTS } from '../data/treatmentsData';

interface BookingPageProps {
  treatments: Treatment[];
  preselectedTreatmentId?: string | null;
  onBookingComplete: (booking: BookingState) => void;
  onNavigateToCatalog: () => void;
}

// Local date formatter helper ensuring timezone independence
const toLocalDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Generate next 14 available dates excluding Mondays (spa closed)
const generateAvailableDates = (): Date[] => {
  const list: Date[] = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    if (d.getDay() !== 1) {
      list.push(d);
    }
  }
  return list;
};

export const BookingPage: React.FC<BookingPageProps> = ({
  treatments,
  preselectedTreatmentId,
  onBookingComplete,
  onNavigateToCatalog,
}) => {
  // Find initial treatment
  const initialTreatment = useMemo(() => {
    if (preselectedTreatmentId) {
      return treatments.find((t) => t.id === preselectedTreatmentId) || treatments[0];
    }
    return treatments[0];
  }, [preselectedTreatmentId, treatments]);

  // Stepper state (1: Soin & Options, 2: Date & Heure, 3: Coordonnées, 4: Paiement Dépôt)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Booking form state
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment>(initialTreatment);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [therapistPref, setTherapistPref] = useState<string>('auto');

  // Dates: Next 14 available days
  const [availableDates] = useState<Date[]>(() => generateAvailableDates());

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const firstDay = availableDates[0] || new Date();
    return toLocalDateKey(firstDay);
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(DEMO_TIME_SLOTS[1]);

  // Customer coordinates
  const [guest1, setGuest1] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [guest2, setGuest2] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [acceptedPolicy, setAcceptedPolicy] = useState<boolean>(true);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState<boolean>(true);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Simulation loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isDuo = selectedTreatment.format === 'duo';

  // Toggle add-on
  const toggleAddon = (addonId: string) => {
    if (selectedAddonIds.includes(addonId)) {
      setSelectedAddonIds(selectedAddonIds.filter((id) => id !== addonId));
    } else {
      setSelectedAddonIds([...selectedAddonIds, addonId]);
    }
  };

  // Pricing calculations
  const addonsTotal = useMemo(() => {
    return selectedAddonIds.reduce((sum, id) => {
      const addon = selectedTreatment.availableAddons.find((a) => a.id === id);
      return sum + (addon ? addon.price * (isDuo ? 2 : 1) : 0);
    }, 0);
  }, [selectedAddonIds, selectedTreatment, isDuo]);

  const grandTotal = selectedTreatment.totalPrice + addonsTotal;
  const depositDue = Math.round(grandTotal * 0.5);
  const balanceDue = grandTotal - depositDue;

  // Step 3 validation
  const validateStep3 = (): boolean => {
    const errors: string[] = [];
    if (!guest1.firstName.trim()) errors.push('Le prénom du client principal est requis.');
    if (!guest1.lastName.trim()) errors.push('Le nom du client principal est requis.');
    if (!guest1.email.trim() || !guest1.email.includes('@')) errors.push('Un courriel valide est requis.');
    if (!guest1.phone.trim()) errors.push('Le numéro de téléphone est requis.');

    if (isDuo) {
      if (!guest2.firstName.trim()) errors.push('Le prénom du deuxième convive est requis.');
      if (!guest2.lastName.trim()) errors.push('Le nom du deuxième convive est requis.');
    }

    if (!acceptedPolicy) errors.push('Veuillez accepter la politique d’annulation 24 h.');
    if (!acceptedPrivacy) errors.push('Veuillez accepter la politique de protection des renseignements personnels (Loi 25).');

    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 3) {
      if (!validateStep3()) return;
    }
    setFormErrors([]);
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setFormErrors([]);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleConfirmBooking = () => {
    setIsSubmitting(true);

    // Generate random realistic booking code: DUO-XXXXX
    const randomCode = 'DUO-JOL-' + Math.floor(10000 + Math.random() * 90000);

    setTimeout(() => {
      const finalBooking: BookingState = {
        treatment: selectedTreatment,
        selectedAddonIds,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        therapistPreference: therapistPref,
        primaryGuest: guest1,
        secondGuest: guest2,
        acceptedPolicy,
        acceptedPrivacy,
        bookingCode: randomCode,
        calculatedTotal: grandTotal,
        depositDue: depositDue,
        balanceDue: balanceDue,
      };

      setIsSubmitting(false);
      onBookingComplete(finalBooking);
    }, 1200);
  };

  // Format date display
  const formatDateLabel = (isoDateStr: string) => {
    const [year, month, day] = isoDateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('fr-CA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Title & Phase 1 Prototype Callout */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-900 border border-sage-200 px-4 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-500" />
          <span>Réservation en ligne • Expérience Duo & Individuelle</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-sage-950 font-normal">
          Planifiez votre soin chez Duo Spa
        </h1>
        <p className="text-taupe-600 text-sm sm:text-base leading-relaxed">
          Sélectionnez votre formule, choisissez votre créneau vérifié et finalisez votre réservation en quelques étapes simples.
        </p>

        {/* Prototype notice banner */}
        <div className="p-4 bg-gold-50/90 border border-gold-300 rounded-2xl text-left flex items-start gap-3 text-xs text-taupe-700">
          <Info className="w-5 h-5 text-gold-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-semibold text-gold-950 block">Prototype interactif Phase 1 – Non connecté aux services tiers :</strong>
            <p className="text-taupe-700 leading-relaxed">
              La vérification des disponibilités en temps réel, le débit réel du paiement, le traitement automatisé des annulations, les notifications SMS/courriels et la synchronisation GoHighLevel (GHL) ne sont pas encore reliés. Ce flux est une simulation d'expérience utilisateur.
            </p>
          </div>
        </div>
      </div>

      {/* Multi-step progress bar */}
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { step: 1, title: '1. Soin & Options' },
            { step: 2, title: '2. Date & Heure' },
            { step: 3, title: '3. Coordonnées' },
            { step: 4, title: '4. Dépôt (50 %)' },
          ].map((item) => {
            const isPassed = currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <div key={item.step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs mb-1.5 transition-all ${
                    isCurrent
                      ? 'bg-sage-800 text-ivory-50 ring-4 ring-sage-200'
                      : isPassed
                      ? 'bg-sage-600 text-white'
                      : 'bg-sand-200 text-taupe-500'
                  }`}
                >
                  {isPassed ? <Check className="w-4 h-4" /> : item.step}
                </div>
                <span
                  className={`hidden sm:block text-[11px] font-medium ${
                    isCurrent ? 'text-sage-900 font-bold' : 'text-taupe-500'
                  }`}
                >
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="relative mt-2 h-1 bg-sand-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-sage-800 transition-all duration-300 ease-out"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Body & Summary Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Step Form Content (8 columns) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-xs space-y-8">
          {/* STEP 1: SOIN ET OPTIONS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-4">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-sage-900">
                    Sélectionnez votre soin
                  </h2>
                  <p className="text-xs text-taupe-500">
                    Choisissez parmi nos rituels en duo simultanés ou nos soins individuels.
                  </p>
                </div>
                <button
                  onClick={onNavigateToCatalog}
                  className="text-xs font-semibold text-sage-700 hover:text-sage-900 underline underline-offset-4 self-start sm:self-auto"
                >
                  Voir la carte complète
                </button>
              </div>

              {/* Treatment selector cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {treatments.map((treatment) => {
                  const isSelected = selectedTreatment.id === treatment.id;
                  const treatmentIsDuo = treatment.format === 'duo';
                  return (
                    <div
                      key={treatment.id}
                      onClick={() => {
                        setSelectedTreatment(treatment);
                        // reset addons if not in new treatment
                        setSelectedAddonIds([]);
                      }}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-sage-800 bg-sage-50/70 ring-2 ring-sage-700/20'
                          : 'border-sand-200 hover:border-sage-300 hover:bg-sand-50/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                              treatmentIsDuo
                                ? 'bg-gold-100 text-gold-900'
                                : 'bg-sand-200 text-taupe-800'
                            }`}
                          >
                            {treatmentIsDuo ? 'Duo (2 Thérapeutes)' : 'Individuel'}
                          </span>
                          <span className="text-xs text-taupe-500 font-medium">
                            {treatment.durationLabel}
                          </span>
                        </div>

                        <h3 className="font-serif text-base font-semibold text-sage-950 mb-1 leading-snug">
                          {treatment.name}
                        </h3>

                        <p className="text-xs text-taupe-600 line-clamp-2 leading-relaxed">
                          {treatment.shortDescription}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-sand-200/60 flex items-baseline justify-between">
                        <span className="text-xs text-taupe-500">Tarif</span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-sage-900">
                            {treatment.pricePerPerson} $
                          </span>
                          <span className="text-[11px] text-taupe-500">
                            {treatmentIsDuo ? ' / pers.' : ''}
                          </span>
                          {treatmentIsDuo && (
                            <span className="text-[10px] text-taupe-500 block">
                              Total : {treatment.totalPrice} $
                            </span>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 text-sage-800">
                          <CheckCircle2 className="w-5 h-5 fill-sage-100" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add-ons Section */}
              <div className="pt-4 border-t border-sand-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold text-sage-900">
                    Options et compléments facultatifs
                  </h3>
                  <span className="text-xs text-taupe-500">
                    {isDuo ? 'Appliqué pour les 2 convives' : 'Pour 1 personne'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedTreatment.availableAddons.map((addon) => {
                    const isChecked = selectedAddonIds.includes(addon.id);
                    const effectivePrice = addon.price * (isDuo ? 2 : 1);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`cursor-pointer rounded-xl p-3 border text-xs transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'border-gold-500 bg-gold-50/40 text-taupe-900'
                            : 'border-sand-200 hover:border-sand-300 bg-white text-taupe-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                            isChecked
                              ? 'bg-gold-600 border-gold-600 text-white'
                              : 'border-sand-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between font-semibold">
                            <span>{addon.name}</span>
                            <span className="text-sage-800">+{effectivePrice} $</span>
                          </div>
                          <p className="text-taupe-500 text-[11px] mt-0.5 leading-snug">
                            {addon.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preference of therapist */}
              <div className="pt-4 border-t border-sand-100 space-y-2">
                <label htmlFor="therapist-preference-select" className="block text-xs font-semibold text-taupe-700">
                  Préférence de thérapeute (facultative) :
                </label>
                <select
                  id="therapist-preference-select"
                  value={therapistPref}
                  onChange={(e) => setTherapistPref(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-200 rounded-xl px-3.5 py-2.5 text-xs text-taupe-800 focus:outline-none focus:ring-2 focus:ring-sage-600"
                >
                  {DEMO_THERAPISTS.map((th) => (
                    <option key={th.id} value={th.id}>
                      {th.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-taupe-500">
                  Conformément au cahier des charges, le système retient automatiquement deux thérapeutes admissibles coordonnées pour les duos.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: DATE ET HEURE */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-sand-100 pb-4">
                <h2 className="font-serif text-2xl font-semibold text-sage-900">
                  Choisissez la date et l’heure
                </h2>
                <p className="text-xs text-taupe-500">
                  Disponibilités de démonstration pour notre suite {isDuo ? 'Duo (2 thérapeutes simultanées)' : 'individuelle'}.
                </p>
              </div>

              {/* Demo notice for step 2 */}
              <div className="p-3 bg-sand-100/90 border border-sand-300 rounded-xl text-xs text-taupe-700 flex items-start gap-2">
                <Info className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Disponibilités de simulation (Phase 1) :</strong> Les créneaux ci-dessous sont générés pour la démonstration. La lecture en temps réel des agendas GoHighLevel et la réservation instantanée des plages libres seront actives en Phase 2.
                </span>
              </div>

              {/* Date selection pill list */}
              <div>
                <span id="label-select-day" className="block text-xs font-semibold text-taupe-700 mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-sage-700" />
                  Sélectionnez un jour (Mardi au Dimanche) :
                </span>
                <div role="group" aria-labelledby="label-select-day" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {availableDates.map((dateObj) => {
                    const iso = toLocalDateKey(dateObj);
                    const isSelected = selectedDate === iso;
                    const dayName = dateObj.toLocaleDateString('fr-CA', { weekday: 'short' });
                    const dayNum = dateObj.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' });

                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setSelectedDate(iso)}
                        aria-pressed={isSelected}
                        className={`p-3 rounded-2xl border text-center transition-all focus-visible:ring-2 focus-visible:ring-sage-700 focus:outline-none ${
                          isSelected
                            ? 'bg-sage-800 text-ivory-50 border-sage-800 shadow-sm font-semibold'
                            : 'bg-sand-50/60 hover:bg-sand-100 border-sand-200 text-taupe-800'
                        }`}
                      >
                        <span className="block text-[11px] uppercase tracking-wider opacity-80">
                          {dayName}
                        </span>
                        <span className="block text-base font-serif font-bold">
                          {dayNum}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot selection */}
              <div className="pt-4 border-t border-sand-100 space-y-3">
                <span id="label-select-time" className="block text-xs font-semibold text-taupe-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sage-700" />
                  Créneaux libres pour le {formatDateLabel(selectedDate)} :
                </span>

                <div role="group" aria-labelledby="label-select-time" className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {DEMO_TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        aria-pressed={isSelected}
                        className={`py-3 px-2 rounded-xl text-center border text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-sage-700 focus:outline-none ${
                          isSelected
                            ? 'bg-sage-800 text-ivory-50 border-sage-800 shadow-xs font-semibold'
                            : 'bg-white hover:bg-sand-50 border-sand-200 text-taupe-800'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-sage-50 rounded-xl border border-sage-200 text-xs text-sage-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sage-700 shrink-0" />
                  <span>
                    {isDuo
                      ? 'Créneau simulé vérifié : La suite duo et deux thérapeutes synchronisées sont disponibles dans cette maquette.'
                      : 'Créneau simulé vérifié : Thérapeute et salle individuelle réservables immédiatement dans cette maquette.'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: COORDONNÉES */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-sand-100 pb-4">
                <h2 className="font-serif text-2xl font-semibold text-sage-900">
                  Coordonnées des convives
                </h2>
                <p className="text-xs text-taupe-500">
                  {isDuo
                    ? 'Informations requises pour les deux personnes recevant le soin en duo.'
                    : 'Informations requises pour la réservation et la confirmation.'}
                </p>
              </div>

              {/* Demo notice for step 3 */}
              <div className="p-3 bg-sand-100/90 border border-sand-300 rounded-xl text-xs text-taupe-700 flex items-start gap-2">
                <Info className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Formulaire de démonstration :</strong> Les coordonnées saisies restent en mémoire locale dans votre navigateur pour tester le prototype. Aucune fiche client n'est encore envoyée à GoHighLevel ni enregistrée en base de données.
                </span>
              </div>

              {formErrors.length > 0 && (
                <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Veuillez corriger les points suivants :
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-red-700">
                    {formErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Guest 1 (Primary Client) */}
              <div className="space-y-4 bg-sand-50/70 p-4 sm:p-6 rounded-2xl border border-sand-200">
                <div className="flex items-center gap-2 text-sm font-serif font-bold text-sage-900 border-b border-sand-200/80 pb-2">
                  <User className="w-4 h-4 text-sage-700" />
                  <span>Client principal {isDuo && '(Invité 1)'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label htmlFor="primary-guest-firstname" className="block text-taupe-700 font-medium mb-1">Prénom *</label>
                    <input
                      id="primary-guest-firstname"
                      type="text"
                      placeholder="ex. Sophie"
                      autoComplete="given-name"
                      required
                      value={guest1.firstName}
                      onChange={(e) => setGuest1({ ...guest1, firstName: e.target.value })}
                      className="w-full bg-white border border-sand-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sage-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="primary-guest-lastname" className="block text-taupe-700 font-medium mb-1">Nom *</label>
                    <input
                      id="primary-guest-lastname"
                      type="text"
                      placeholder="ex. Tremblay"
                      autoComplete="family-name"
                      required
                      value={guest1.lastName}
                      onChange={(e) => setGuest1({ ...guest1, lastName: e.target.value })}
                      className="w-full bg-white border border-sand-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sage-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="primary-guest-email" className="block text-taupe-700 font-medium mb-1">Courriel *</label>
                    <input
                      id="primary-guest-email"
                      type="email"
                      placeholder="sophie.tremblay@exemple.ca"
                      autoComplete="email"
                      required
                      value={guest1.email}
                      onChange={(e) => setGuest1({ ...guest1, email: e.target.value })}
                      className="w-full bg-white border border-sand-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sage-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="primary-guest-phone" className="block text-taupe-700 font-medium mb-1">Téléphone cellulaire *</label>
                    <input
                      id="primary-guest-phone"
                      type="tel"
                      placeholder="(450) 123-4567"
                      autoComplete="tel"
                      required
                      value={guest1.phone}
                      onChange={(e) => setGuest1({ ...guest1, phone: e.target.value })}
                      className="w-full bg-white border border-sand-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sage-600 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="primary-guest-notes" className="block text-taupe-700 font-medium mb-1">
                      Préférences, zones de tension ou remarques particulières (facultatif)
                    </label>
                    <input
                      id="primary-guest-notes"
                      type="text"
                      placeholder="ex. Pression moyenne, insister sur les trapèzes..."
                      value={guest1.notes}
                      onChange={(e) => setGuest1({ ...guest1, notes: e.target.value })}
                      className="w-full bg-white border border-sand-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sage-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Guest 2 (Only if Duo Booking) */}
              {isDuo && (
                <div className="space-y-4 bg-sand-50/70 p-4 sm:p-6 rounded-2xl border border-sand-200 animate-fadeIn">
                  <div className="flex items-center gap-2 text-sm font-serif font-bold text-sage-900 border-b border-sand-200/80 pb-2">
                    <Heart className="w-4 h-4 text-gold-600" />
                    <span>Deuxième invité(e) (Soin en Duo)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label htmlFor="second-guest-firstname" className="block text-taupe-700 font-medium mb-1">Prénom du deuxième invité *</label>
                      <input
                        id="second-guest-firstname"
                        type="text"
                        placeholder="ex. Marc"
                        required
                        value={guest2.firstName}
                        onChange={(e) => setGuest2({ ...guest2, firstName: e.target.value })}
                        className="w-full bg-white border border-sand-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sage-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="second-guest-lastname" className="block text-taupe-700 font-medium mb-1">Nom du deuxième invité *</label>
                      <input
                        id="second-guest-lastname"
                        type="text"
                        placeholder="ex. Gagnon"
                        required
                        value={guest2.lastName}
                        onChange={(e) => setGuest2({ ...guest2, lastName: e.target.value })}
                        className="w-full bg-white border border-sand-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sage-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="second-guest-email" className="block text-taupe-700 font-medium mb-1">Courriel (facultatif)</label>
                      <input
                        id="second-guest-email"
                        type="email"
                        placeholder="marc.gagnon@exemple.ca"
                        value={guest2.email}
                        onChange={(e) => setGuest2({ ...guest2, email: e.target.value })}
                        className="w-full bg-white border border-sand-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sage-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="second-guest-phone" className="block text-taupe-700 font-medium mb-1">Téléphone (facultatif)</label>
                      <input
                        id="second-guest-phone"
                        type="tel"
                        placeholder="(450) 987-6543"
                        value={guest2.phone}
                        onChange={(e) => setGuest2({ ...guest2, phone: e.target.value })}
                        className="w-full bg-white border border-sand-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sage-600 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="second-guest-notes" className="block text-taupe-700 font-medium mb-1">
                        Besoins particuliers ou préférences du deuxième invité
                      </label>
                      <input
                        id="second-guest-notes"
                        type="text"
                        placeholder="ex. Détente douce, sensible au bas du dos..."
                        value={guest2.notes}
                        onChange={(e) => setGuest2({ ...guest2, notes: e.target.value })}
                        className="w-full bg-white border border-sand-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sage-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Policies & Consents */}
              <div className="space-y-3 pt-2 text-xs text-taupe-700">
                <label htmlFor="policy-check" className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    id="policy-check"
                    type="checkbox"
                    checked={acceptedPolicy}
                    onChange={(e) => setAcceptedPolicy(e.target.checked)}
                    className="mt-0.5 rounded text-sage-800 focus:ring-sage-600"
                  />
                  <span>
                    J’accepte la <strong>politique d’annulation 24 heures</strong> : annulation sans frais ou déplacement possible jusqu’à 24 h avant l’heure du rendez-vous avec remboursement intégral du dépôt (règle du cahier des charges).
                  </span>
                </label>

                <label htmlFor="privacy-check" className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    id="privacy-check"
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="mt-0.5 rounded text-sage-800 focus:ring-sage-600"
                  />
                  <span>
                    J’autorise Duo Spa à conserver mes renseignements de contact et de santé pour la gestion de mon soin, conformément à la <strong>Loi 25 (Québec)</strong>.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: DÉPÔT ET PAIEMENT SIMULÉ */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-sand-100 pb-4">
                <h2 className="font-serif text-2xl font-semibold text-sage-900">
                  Dépôt de garantie en ligne (50 % - Démo)
                </h2>
                <p className="text-xs text-taupe-500">
                  Paiement simulé du dépôt pour valider le flux utilisateur. Le solde de 50 % sera réglé sur place à Joliette.
                </p>
              </div>

              {/* Clear Demo Box */}
              <div className="p-4 bg-gold-50 border-2 border-gold-300 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-gold-950 font-semibold text-sm">
                  <CreditCard className="w-5 h-5 text-gold-700" />
                  <span>Module de paiement prototype – Aucun débit bancaire réel</span>
                </div>
                <p className="text-xs text-taupe-700 leading-relaxed">
                  Ceci est une simulation d’interface. <strong>Aucun montant réel ne sera prélevé de votre compte bancaire.</strong> La passerelle de paiement sécurisée réelle, le calcul des taxes et les remboursements automatisés seront branchés lors de la Phase 2.
                </p>
              </div>

              {/* Simulated Card Form */}
              <div className="space-y-4 bg-sand-50/60 p-5 rounded-2xl border border-sand-200 text-xs">
                <div>
                  <label htmlFor="simulated-card-holder" className="block text-taupe-700 font-medium mb-1">Nom sur la carte</label>
                  <input
                    id="simulated-card-holder"
                    type="text"
                    defaultValue={`${guest1.firstName} ${guest1.lastName}`.trim() || 'Sophie Tremblay'}
                    className="w-full bg-white border border-sand-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sage-600"
                  />
                </div>

                <div>
                  <label htmlFor="simulated-card-num" className="block text-taupe-700 font-medium mb-1">Numéro de carte de crédit (Simulation)</label>
                  <div className="relative">
                    <input
                      id="simulated-card-num"
                      type="text"
                      defaultValue="•••• •••• •••• 4242 (Démo interactive)"
                      disabled
                      className="w-full bg-sand-100 border border-sand-200 rounded-xl px-3 py-2 text-xs font-mono text-taupe-600 cursor-not-allowed"
                    />
                    <CreditCard className="w-4 h-4 text-taupe-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="simulated-card-expiry" className="block text-taupe-700 font-medium mb-1">Expiration (Simulation)</label>
                    <input
                      id="simulated-card-expiry"
                      type="text"
                      defaultValue="12 / 28"
                      disabled
                      className="w-full bg-sand-100 border border-sand-200 rounded-xl px-3 py-2 text-xs font-mono text-taupe-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="simulated-card-cvv" className="block text-taupe-700 font-medium mb-1">CVC (Simulation)</label>
                    <input
                      id="simulated-card-cvv"
                      type="text"
                      defaultValue="•••"
                      disabled
                      className="w-full bg-sand-100 border border-sand-200 rounded-xl px-3 py-2 text-xs font-mono text-taupe-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Recap of deposit terms */}
              <div className="p-4 bg-ivory-100 rounded-2xl border border-sand-200 text-xs text-taupe-700 space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span>Montant du dépôt simulé (50 %) :</span>
                  <span className="font-bold text-sage-900">{depositDue} $ CAD (Non débité)</span>
                </div>
                <div className="flex justify-between text-taupe-500">
                  <span>Solde indicatif à régler sur place :</span>
                  <span>{balanceDue} $ CAD</span>
                </div>
                <p className="text-[11px] text-taupe-500 pt-1 border-t border-sand-200">
                  Une page de confirmation récapitulative vous sera immédiatement affichée à l’étape suivante.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-sand-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-sand-300 text-xs font-medium text-taupe-700 hover:bg-sand-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Étape précédente</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-1.5 bg-sage-800 hover:bg-sage-900 text-ivory-50 px-6 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all"
              >
                <span>Continuer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="inline-flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-white px-8 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Validation du rendez-vous...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmer et simuler le dépôt ({depositDue} $)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right: Booking Summary Sidebar (4 columns) */}
        <div className="lg:col-span-4 bg-sand-50/90 rounded-3xl p-6 border border-sand-200 space-y-6 sticky top-28">
          <div>
            <span className="text-[11px] font-bold text-gold-700 uppercase tracking-widest block mb-1">
              Récapitulatif
            </span>
            <h3 className="font-serif text-xl font-bold text-sage-950">
              Votre sélection
            </h3>
          </div>

          {/* Treatment preview snippet */}
          <div className="space-y-3 pb-4 border-b border-sand-200">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  isDuo ? 'bg-gold-200 text-gold-900' : 'bg-sand-200 text-taupe-800'
                }`}
              >
                {isDuo ? 'Soin en Duo' : 'Soin Individuel'}
              </span>
              <span className="text-xs text-taupe-500">{selectedTreatment.durationLabel}</span>
            </div>

            <h4 className="font-serif text-base font-semibold text-sage-900 leading-snug">
              {selectedTreatment.name}
            </h4>

            {isDuo && (
              <p className="text-[11px] text-sage-700 font-medium">
                2 massothérapeutes • 1 suite privée à Joliette
              </p>
            )}
          </div>

          {/* Schedule Summary */}
          <div className="space-y-2 pb-4 border-b border-sand-200 text-xs text-taupe-700">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-sage-700 shrink-0" />
              <span>{formatDateLabel(selectedDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sage-700 shrink-0" />
              <span>Heure : {selectedTimeSlot}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sage-700 shrink-0" />
              <span>Convives : {isDuo ? '2 personnes (Duo)' : '1 personne'}</span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-taupe-600">
              <span>Soin de base :</span>
              <span>{selectedTreatment.totalPrice} $ CAD</span>
            </div>

            {selectedAddonIds.length > 0 && (
              <div className="flex justify-between text-taupe-600">
                <span>Options ({selectedAddonIds.length}) :</span>
                <span>+{addonsTotal} $ CAD</span>
              </div>
            )}

            <div className="pt-2 border-t border-sand-200 flex justify-between font-bold text-sm text-sage-950">
              <span>Total estimé :</span>
              <span>{grandTotal} $ CAD</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-sand-200 space-y-1.5 mt-2">
              <div className="flex justify-between text-gold-700 font-semibold text-xs">
                <span>Dépôt simulé (50 %) :</span>
                <span>{depositDue} $ CAD (Démo)</span>
              </div>
              <div className="flex justify-between text-taupe-500 text-[11px]">
                <span>Solde indicatif sur place :</span>
                <span>{balanceDue} $ CAD</span>
              </div>
            </div>
          </div>

          {/* Reassurance pills */}
          <div className="pt-2 space-y-2 text-[11px] text-taupe-600 border-t border-sand-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sage-700 shrink-0" />
              <span>Reçus d’assurance (sous réserve d’accréditation)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sage-700 shrink-0" />
              <span>Annulation sans frais jusqu’à 24 h (démo)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
