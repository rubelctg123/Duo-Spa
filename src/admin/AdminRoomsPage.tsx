import React, { useEffect, useState } from 'react';
import { AlertTriangle, Users, RefreshCw, CheckCircle2 } from 'lucide-react';

export const AdminRoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [demoNotice, setDemoNotice] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/rooms');
      const data = await res.json();
      if (res.ok && data.success) {
        setRooms(data.rooms || []);
        setDemoNotice(data.demoNotice || '');
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadRooms() {
      try {
        const res = await fetch('/api/admin/rooms');
        const data = await res.json();
        if (!ignore && res.ok && data.success) {
          setRooms(data.rooms || []);
          setDemoNotice(data.demoNotice || '');
        }
      } catch {
        // Handle error
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadRooms();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-taupe-900">
            Salles & Suites Privatives
          </h1>
          <p className="text-sm text-taupe-600 mt-1">
            Configuration physique des suites duo et cabines solo du spa
          </p>
        </div>
        <button
          onClick={fetchRooms}
          className="self-start sm:self-auto flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-taupe-200 text-taupe-700 bg-white hover:bg-taupe-50 text-xs font-medium transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Rafraîchir</span>
        </button>
      </div>

      {/* Demo Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-amber-900 text-xs sm:text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">Données de Démonstration Uniquement</p>
          <p className="text-amber-800 leading-relaxed">
            {demoNotice ||
              'Ces suites et cabines sont des ressources physiques de démonstration utilisées pour valider les contraintes de capacité et l’allocation des duos.'}
          </p>
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-taupe-400 space-y-3">
          <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">Chargement des salles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const isDuo = room.type === 'duo_suite';
            return (
              <div
                key={room._id || room.code}
                className="bg-white rounded-2xl border border-taupe-100 p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider mb-2 ${
                        isDuo
                          ? 'bg-gold-50 text-gold-700 border border-gold-200'
                          : 'bg-sage-50 text-sage-700 border border-sage-200'
                      }`}
                    >
                      {isDuo ? 'Suite Duo Prestige' : 'Cabine Solo Sérénité'}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-taupe-900">{room.name}</h3>
                    <p className="text-xs text-taupe-400 font-mono mt-0.5">Code : {room.code}</p>
                  </div>
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs ${
                      room.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{room.isActive ? 'Active' : 'Inactive'}</span>
                  </span>
                </div>

                <div className="border-t border-taupe-100 pt-4 space-y-2 text-xs text-taupe-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-taupe-500">
                      <Users className="w-3.5 h-3.5" />
                      <span>Capacité maximale :</span>
                    </span>
                    <span className="font-semibold text-taupe-800">
                      {room.capacity} {room.capacity > 1 ? 'personnes' : 'personne'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-taupe-500">Massage en duo :</span>
                    <span
                      className={`font-medium ${
                        isDuo ? 'text-gold-700 font-semibold' : 'text-taupe-400'
                      }`}
                    >
                      {isDuo ? 'Compatible & Équipée' : 'Non compatible'}
                    </span>
                  </div>
                </div>

                <div className="bg-taupe-50 rounded-lg p-3 text-[11px] text-taupe-500 italic">
                  Ressource réservée automatiquement par le moteur de disponibilité lors de la prise de
                  rendez-vous.
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
