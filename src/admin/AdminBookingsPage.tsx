import React, { useEffect, useState } from 'react';
import { Search, RefreshCw, X } from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings(data.bookings || []);
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erreur lors du chargement des réservations.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (dateFilter) params.append('date', dateFilter);

    fetch(`/api/admin/bookings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success) {
          setBookings(data.bookings || []);
        }
      })
      .catch(() => {
        if (isMounted) setFeedback({ type: 'error', message: 'Erreur lors du chargement des réservations.' });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [statusFilter, dateFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    setActionLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: `Statut mis à jour : ${newStatus}` });
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      } else {
        setFeedback({ type: 'error', message: data.error || 'Erreur lors de la mise à jour.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Impossible de joindre le serveur.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-taupe-900">
            Gestion des réservations
          </h1>
          <p className="text-xs text-taupe-600 mt-1">
            Consultez, recherchez et gérez les rendez-vous pris par les clients.
          </p>
        </div>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-auto bg-white border border-sand-300 hover:bg-sand-50 text-taupe-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs border flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-sage-50 border-sage-300 text-sage-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-taupe-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, courriel ou code DUO-..."
              className="w-full pl-9 pr-3 py-2 bg-sand-50/60 border border-sand-200 rounded-xl text-xs text-taupe-800 focus:outline-none focus:ring-2 focus:ring-sage-600"
            />
          </div>

          <div className="md:col-span-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-sand-50/60 border border-sand-200 rounded-xl text-xs text-taupe-800 focus:outline-none focus:ring-2 focus:ring-sage-600"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-sand-50/60 border border-sand-200 rounded-xl text-xs text-taupe-800 focus:outline-none focus:ring-2 focus:ring-sage-600"
            >
              <option value="all">Tous les statuts</option>
              <option value="confirmed">Confirmés</option>
              <option value="completed">Complétés</option>
              <option value="cancelled">Annulés</option>
            </select>
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-sage-800 hover:bg-sage-900 text-white py-2 rounded-xl text-xs font-semibold shadow-xs"
            >
              Filtrer
            </button>
            {(search || dateFilter || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setDateFilter('');
                  setStatusFilter('all');
                }}
                className="px-2.5 py-2 bg-sand-100 hover:bg-sand-200 text-taupe-700 rounded-xl text-xs"
                title="Réinitialiser"
              >
                ✕
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-taupe-500 text-xs">
            Chargement des réservations en cours...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-taupe-500 text-xs space-y-2">
            <p className="font-semibold text-taupe-700">Aucune réservation trouvée</p>
            <p className="text-[11px]">Essayez de modifier vos filtres ou effectuez une réservation sur le site public.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50/80 text-taupe-600 font-semibold uppercase text-[10px] tracking-wider border-b border-sand-200">
                <tr>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Prestation</th>
                  <th className="py-3.5 px-4">Date & Heure</th>
                  <th className="py-3.5 px-4">Salle assignée</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {bookings.map((b) => {
                  const isDuo = b.format === 'duo';
                  return (
                    <tr key={b.bookingCode} className="hover:bg-sand-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-sage-900">
                        {b.bookingCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-taupe-900 block">
                          {b.primaryGuest?.firstName} {b.primaryGuest?.lastName}
                        </span>
                        <span className="text-[11px] text-taupe-500 block">{b.primaryGuest?.phone}</span>
                        {isDuo && b.secondGuest && (
                          <span className="text-[10px] text-gold-700 font-medium block mt-0.5">
                            + 2ᵉ : {b.secondGuest.firstName} {b.secondGuest.lastName}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-taupe-800 block">{b.serviceName}</span>
                        <span className="text-[10px] text-taupe-500">
                          {isDuo ? 'Duo simultané' : 'Solo'} • {b.durationMinutes} min
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-taupe-800 block">{b.date}</span>
                        <span className="text-taupe-500 text-[11px]">{b.timeSlot}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-taupe-700 font-medium block">
                          {b.assignedRoomName || 'Attribution auto'}
                        </span>
                        {Array.isArray(b.assignedTherapistNames) && (
                          <span className="text-[10px] text-taupe-500 block">
                            {b.assignedTherapistNames.join(', ')}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            b.status === 'confirmed'
                              ? 'bg-sage-100 text-sage-900'
                              : b.status === 'completed'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-red-100 text-red-900'
                          }`}
                        >
                          {b.status === 'confirmed'
                            ? 'Confirmé'
                            : b.status === 'completed'
                            ? 'Complété'
                            : 'Annulé'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-2.5 py-1 bg-sand-100 hover:bg-sand-200 text-taupe-700 rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-taupe-500 font-semibold block">
                  Fiche de réservation
                </span>
                <h3 className="font-serif text-xl font-bold text-taupe-900">
                  {selectedBooking.bookingCode}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-taupe-400 hover:text-taupe-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-sand-50 rounded-xl space-y-1">
                <span className="text-taupe-500 text-[10px] uppercase font-semibold">Prestation :</span>
                <p className="font-semibold text-sm text-taupe-900">{selectedBooking.serviceName}</p>
                <p className="text-taupe-600">
                  Format : {selectedBooking.format === 'duo' ? 'Soin en Duo (2 massothérapeutes)' : 'Individuel'} • {selectedBooking.durationMinutes} min
                </p>
                <p className="text-taupe-600">
                  Date & Heure : <strong>{selectedBooking.date}</strong> à <strong>{selectedBooking.timeSlot}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-sand-50 rounded-xl">
                  <span className="text-taupe-500 text-[10px] uppercase font-semibold block mb-1">
                    Client Principal :
                  </span>
                  <p className="font-semibold text-taupe-900">
                    {selectedBooking.primaryGuest?.firstName} {selectedBooking.primaryGuest?.lastName}
                  </p>
                  <p className="text-taupe-600">{selectedBooking.primaryGuest?.email}</p>
                  <p className="text-taupe-600">{selectedBooking.primaryGuest?.phone}</p>
                  {selectedBooking.primaryGuest?.notes && (
                    <p className="text-taupe-500 italic mt-1 text-[11px]">
                      Notes : « {selectedBooking.primaryGuest.notes} »
                    </p>
                  )}
                </div>

                <div className="p-3 bg-sand-50 rounded-xl">
                  <span className="text-taupe-500 text-[10px] uppercase font-semibold block mb-1">
                    {selectedBooking.format === 'duo' ? '2ᵉ Invité (Duo) :' : 'Attribution :'}
                  </span>
                  {selectedBooking.secondGuest ? (
                    <>
                      <p className="font-semibold text-taupe-900">
                        {selectedBooking.secondGuest.firstName} {selectedBooking.secondGuest.lastName}
                      </p>
                      <p className="text-taupe-600">{selectedBooking.secondGuest.email || '—'}</p>
                      {selectedBooking.secondGuest.notes && (
                        <p className="text-taupe-500 italic mt-1 text-[11px]">
                          Notes : « {selectedBooking.secondGuest.notes} »
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-taupe-500 italic">Soin solo sans 2ᵉ convive.</p>
                  )}
                </div>
              </div>

              <div className="p-3 bg-sand-50 rounded-xl space-y-1">
                <span className="text-taupe-500 text-[10px] uppercase font-semibold block">
                  Ressources & Emplacement :
                </span>
                <p className="text-taupe-800">
                  Salle : <strong>{selectedBooking.assignedRoomName || '—'}</strong>
                </p>
                <p className="text-taupe-800">
                  Massothérapeutes : <strong>{selectedBooking.assignedTherapistNames?.join(', ') || '—'}</strong>
                </p>
              </div>

              <div className="p-3 bg-sand-50 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-taupe-500 text-[10px] uppercase font-semibold block">Paiement :</span>
                  <span className="font-bold text-sm text-taupe-900">
                    Total : {selectedBooking.pricing?.totalPrice ?? 0} $ CAD
                  </span>
                </div>
                <div className="text-right text-[11px] text-taupe-600">
                  <span>Dépôt (50 %) : {selectedBooking.pricing?.depositDue ?? 0} $ (Démo)</span>
                  <span className="block font-medium text-sage-800">
                    Solde dû : {selectedBooking.pricing?.balanceDue ?? 0} $
                  </span>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="pt-2 border-t border-sand-200 flex items-center justify-between">
                <span className="font-semibold text-taupe-700">Changer le statut :</span>
                <div className="flex gap-2">
                  {selectedBooking.status !== 'confirmed' && (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(selectedBooking._id, 'confirmed')}
                      className="px-3 py-1.5 bg-sage-700 hover:bg-sage-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Confirmer
                    </button>
                  )}
                  {selectedBooking.status !== 'completed' && (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(selectedBooking._id, 'completed')}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Marquer Complété
                    </button>
                  )}
                  {selectedBooking.status !== 'cancelled' && (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatus(selectedBooking._id, 'cancelled')}
                      className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
