import React from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Download,
  ArrowRight,
  ShieldCheck,
  Mail
} from 'lucide-react';
import type { BookingState } from '../types/treatment';

interface ConfirmationPageProps {
  booking: BookingState;
  onNewBooking: () => void;
  onNavigateHome: () => void;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  booking,
  onNewBooking,
  onNavigateHome,
}) => {
  const isDuo = booking.treatment?.format === 'duo';

  // Format date display
  const formatDateLabel = (isoDateStr: string) => {
    if (!isoDateStr) return '';
    const [year, month, day] = isoDateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('fr-CA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handlePrintOrDownload = () => {
    window.print();
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fadeIn">
      {/* Top Banner Prototype notice */}
      <div className="p-4 bg-sage-900 text-ivory-100 rounded-2xl flex items-start gap-3 text-xs sm:text-sm border border-gold-500/30">
        <Sparkles className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-semibold text-gold-300 block">
            Simulation de confirmation (Prototype Phase 1) – Aucun débit ni réservation réelle
          </strong>
          <p className="text-ivory-200 leading-relaxed text-xs">
            Cette page illustre la confirmation reçue par le client à l’issue d’une réservation réussie. <strong>Aucun créneau réel n’a été réservé dans GoHighLevel, aucun paiement n'a été débité sur votre carte bancaire, et aucun SMS ou courriel réel n'est expédié à ce stade.</strong> L'interconnexion globale sera activée en Phase 2.
          </p>
        </div>
      </div>

      {/* Main Confirmation Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sand-300 shadow-md space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-3 pb-8 border-b border-sand-200">
          <div className="w-16 h-16 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center mx-auto shadow-xs border border-sage-300">
            <CheckCircle2 className="w-10 h-10 text-sage-700" />
          </div>

          <div className="inline-block bg-sand-100 text-taupe-700 text-xs px-3 py-1 rounded-full font-mono font-medium">
            Référence Démo : {booking.bookingCode || 'DUO-JOL-84729'}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-sage-950">
            Votre rendez-vous est réservé !
          </h1>

          <p className="text-taupe-600 text-sm max-w-lg mx-auto">
            Merci <strong>{booking.primaryGuest.firstName}</strong>. Votre moment de ressourcement chez Duo Spa à Joliette est enregistré avec succès.
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          {/* Left: Treatment & Scheduling */}
          <div className="space-y-4 bg-sand-50/70 p-5 rounded-2xl border border-sand-200">
            <h3 className="font-serif text-base font-bold text-sage-900 border-b border-sand-200 pb-2">
              Détails du soin
            </h3>

            <div>
              <span className="text-[11px] text-taupe-500 block uppercase tracking-wider">Soin choisi</span>
              <span className="font-serif text-lg font-semibold text-sage-950 block">
                {booking.treatment?.name}
              </span>
              <span className="text-xs text-taupe-600 font-medium">
                {isDuo ? 'Expérience en Duo • 2 thérapeutes' : 'Soin individuel'} ({booking.treatment?.durationLabel})
              </span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-2 text-taupe-800">
                <Calendar className="w-4 h-4 text-sage-700 shrink-0" />
                <span className="font-medium capitalize">{formatDateLabel(booking.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-taupe-800">
                <Clock className="w-4 h-4 text-sage-700 shrink-0" />
                <span>Heure d’arrivée conseillée : <strong>{booking.timeSlot}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-taupe-800">
                <MapPin className="w-4 h-4 text-sage-700 shrink-0" />
                <span>Duo Spa, Centre-ville de Joliette (QC)</span>
              </div>
            </div>
          </div>

          {/* Right: Guests & Financials */}
          <div className="space-y-4 bg-sand-50/70 p-5 rounded-2xl border border-sand-200">
            <h3 className="font-serif text-base font-bold text-sage-900 border-b border-sand-200 pb-2">
              Convives & Règlement
            </h3>

            <div className="space-y-1">
              <span className="text-[11px] text-taupe-500 block uppercase tracking-wider">Convives enregistrés</span>
              <p className="font-medium text-taupe-900">
                1. {booking.primaryGuest.firstName} {booking.primaryGuest.lastName}
                <span className="text-xs text-taupe-500 block">({booking.primaryGuest.email} • {booking.primaryGuest.phone})</span>
              </p>
              {isDuo && booking.secondGuest.firstName && (
                <p className="font-medium text-taupe-900 pt-1">
                  2. {booking.secondGuest.firstName} {booking.secondGuest.lastName}
                  <span className="text-xs text-taupe-500 block">(Deuxième convive en suite duo)</span>
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-sand-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Total estimé du soin :</span>
                <span className="font-semibold">{booking.calculatedTotal} $ CAD</span>
              </div>
              <div className="flex justify-between text-gold-700 font-bold">
                <span>Dépôt réglé en ligne (50 %) :</span>
                <span>{booking.depositDue} $ CAD (Simulé)</span>
              </div>
              <div className="flex justify-between text-taupe-600">
                <span>Solde restant payable sur place :</span>
                <span>{booking.balanceDue} $ CAD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2 Automation Preview Box (Directly from Cahier des charges section 10) */}
        <div className="bg-ivory-100 rounded-2xl p-5 border border-sand-200 space-y-3 text-xs text-taupe-700">
          <div className="flex items-center gap-2 font-semibold text-sage-900 text-sm">
            <Mail className="w-4 h-4 text-sage-700" />
            <span>Automatisations et notifications (Architecture Phase 2)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-white rounded-xl border border-sand-200 space-y-1">
              <span className="font-semibold text-taupe-800 block">1. Courriel au client</span>
              <span className="text-taupe-500 text-[11px] block">
                Reçu officiel, politique d’annulation 24h et pièce jointe calendrier (.ics pour Google/Apple).
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-sand-200 space-y-1">
              <span className="font-semibold text-taupe-800 block">2. Rappel SMS (24 h avant)</span>
              <span className="text-taupe-500 text-[11px] block">
                Notification automatique envoyée au {booking.primaryGuest.phone || 'numéro indiqué'}.
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-sand-200 space-y-1">
              <span className="font-semibold text-taupe-800 block">3. Synchronisation GHL</span>
              <span className="text-taupe-500 text-[11px] block">
                Verrouillage des agendas des 2 thérapeutes et de la suite duo dans GoHighLevel.
              </span>
            </div>
          </div>
        </div>

        {/* Policies Reassurance */}
        <div className="p-4 bg-sand-50 rounded-2xl border border-sand-200 flex items-start gap-3 text-xs text-taupe-600">
          <ShieldCheck className="w-5 h-5 text-sage-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-taupe-800 block mb-0.5">
              Politique d’annulation et de modification (24 heures)
            </span>
            <span>
              Vous pouvez annuler ou déplacer ce rendez-vous sans aucuns frais jusqu’à 24 heures avant l’heure prévue (dépôt intégralement remboursé). En cas d’imprévu à moins de 24 h, veuillez nous joindre directement par téléphone au (450) 000-0000 (Numéro d’exemple démo).
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-sand-200">
          <button
            onClick={handlePrintOrDownload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-sand-300 hover:bg-sand-100 text-taupe-800 px-5 py-2.5 rounded-full text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-taupe-600" />
            <span>Imprimer / Sauvegarder le récapitulatif</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onNewBooking}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-full border border-sand-300 text-taupe-700 text-xs hover:bg-sand-100 transition-colors"
            >
              Autre réservation
            </button>
            <button
              onClick={onNavigateHome}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-1.5 bg-sage-800 hover:bg-sage-900 text-ivory-50 px-6 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Retour à l’accueil</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
