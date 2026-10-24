import React, { useEffect, useState } from 'react';
import {
  Calendar,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
        setRecentBookings(data.recentBookings || []);
      } else {
        setError(data.error || 'Impossible de charger les données du tableau de bord.');
      }
    } catch {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadDashboard() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (!ignore && res.ok && data.success) {
          setStats(data.stats);
          setRecentBookings(data.recentBookings || []);
        } else if (!ignore) {
          setError(data?.error || 'Impossible de charger les données du tableau de bord.');
        }
      } catch {
        if (!ignore) {
          setError('Erreur de connexion au serveur.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadDashboard();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Refresh button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-taupe-900">
            Tableau de bord
          </h1>
          <p className="text-xs text-taupe-600 mt-1">
            Vue synthétique des réservations, de l'occupation et des rendez-vous du spa à Joliette.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-auto bg-white border border-sand-300 hover:bg-sand-50 text-taupe-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center text-sage-800 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-taupe-500 font-semibold block">
              Aujourd'hui
            </span>
            <span className="text-2xl font-serif font-bold text-taupe-900">
              {loading ? '—' : stats?.todayAppointments ?? 0}
            </span>
            <span className="text-[10px] text-taupe-500 block">rendez-vous planifiés</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center text-gold-700 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-taupe-500 font-semibold block">
              À venir
            </span>
            <span className="text-2xl font-serif font-bold text-taupe-900">
              {loading ? '—' : stats?.upcomingBookings ?? 0}
            </span>
            <span className="text-[10px] text-taupe-500 block">séances confirmées</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sand-200/80 flex items-center justify-center text-taupe-800 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-taupe-500 font-semibold block">
              Total réservations
            </span>
            <span className="text-2xl font-serif font-bold text-taupe-900">
              {loading ? '—' : stats?.totalBookings ?? 0}
            </span>
            <span className="text-[10px] text-taupe-500 block">enregistrées en base</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-700 shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-taupe-500 font-semibold block">
              Annulations
            </span>
            <span className="text-2xl font-serif font-bold text-taupe-900">
              {loading ? '—' : stats?.cancelledBookings ?? 0}
            </span>
            <span className="text-[10px] text-taupe-500 block">annulées ou no-show</span>
          </div>
        </div>
      </div>

      {/* Quick Links Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('bookings')}
          className="p-5 rounded-2xl bg-gradient-to-br from-sage-900 to-sage-950 text-ivory-50 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="font-serif font-semibold text-base">Gestion des réservations</span>
            <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-sage-200/80 mt-2 leading-relaxed">
            Consultez le calendrier, effectuez des recherches par invité et modifiez les statuts de rendez-vous.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('services')}
          className="p-5 rounded-2xl bg-white border border-sand-200 hover:border-gold-400 text-taupe-900 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="font-serif font-semibold text-base">Catalogue & Tarifs</span>
            <ArrowRight className="w-4 h-4 text-sage-700 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-taupe-500 mt-2 leading-relaxed">
            {stats?.servicesCount ?? 8} prestations configurées. Ajustez les prix, durées et statuts actifs.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('therapists')}
          className="p-5 rounded-2xl bg-white border border-sand-200 hover:border-gold-400 text-taupe-900 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="font-serif font-semibold text-base">Ressources & Staff (Démo)</span>
            <ArrowRight className="w-4 h-4 text-sage-700 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-taupe-500 mt-2 leading-relaxed">
            {stats?.therapistsCount ?? 4} thérapeutes et {stats?.roomsCount ?? 3} salles de test pour l'allocation des duos.
          </p>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-sand-200 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-taupe-900">
              Dernières réservations reçues
            </h2>
            <p className="text-xs text-taupe-500">
              Affichage des 6 plus récentes commandes enregistrées
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-semibold text-sage-800 hover:text-sage-950 inline-flex items-center gap-1"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-12 text-center text-taupe-500 text-xs">
            {loading ? 'Chargement des réservations...' : 'Aucune réservation enregistrée pour le moment.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50/80 text-taupe-600 font-semibold uppercase text-[10px] tracking-wider border-b border-sand-200">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Client principal</th>
                  <th className="py-3 px-4">Soin</th>
                  <th className="py-3 px-4">Date & Heure</th>
                  <th className="py-3 px-4">Montant</th>
                  <th className="py-3 px-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {recentBookings.map((b) => {
                  const isDuo = b.format === 'duo';
                  return (
                    <tr key={b.bookingCode} className="hover:bg-sand-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-sage-900">
                        {b.bookingCode}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-taupe-900 block">
                          {b.primaryGuest?.firstName} {b.primaryGuest?.lastName}
                        </span>
                        <span className="text-taupe-500 text-[11px]">{b.primaryGuest?.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-taupe-800 block">{b.serviceName}</span>
                        <span className="text-[10px] text-taupe-500">
                          {isDuo ? 'Duo (2 thérapeutes)' : 'Solo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-taupe-700">
                        <span className="block font-medium">{b.date}</span>
                        <span className="text-taupe-500 text-[11px]">{b.timeSlot}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-sage-900">
                        {b.pricing?.totalPrice ? `${b.pricing.totalPrice} $` : '—'}
                      </td>
                      <td className="py-3 px-4">
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
