import React, { useEffect, useState } from 'react';
import { Edit2, X, RefreshCw } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDuration, setEditDuration] = useState<number>(60);
  const [editIsActive, setEditIsActive] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (res.ok && data.success) {
        setServices(data.services || []);
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erreur lors du chargement des soins.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadServices() {
      try {
        const res = await fetch('/api/admin/services');
        const data = await res.json();
        if (!ignore && res.ok && data.success) {
          setServices(data.services || []);
        }
      } catch {
        if (!ignore) {
          setFeedback({ type: 'error', message: 'Erreur lors du chargement des soins.' });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadServices();
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenEdit = (service: any) => {
    setEditingService(service);
    setEditPrice(service.pricePerPerson || 0);
    setEditDuration(service.durationMinutes || 60);
    setEditIsActive(service.isActive !== false);
    setFeedback(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: editingService.slug || editingService._id,
          pricePerPerson: Number(editPrice),
          durationMinutes: Number(editDuration),
          isActive: Boolean(editIsActive),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: 'Prestation mise à jour avec succès.' });
        setServices((prev) =>
          prev.map((s) => (s._id === editingService._id ? data.service : s))
        );
        setEditingService(null);
      } else {
        setFeedback({ type: 'error', message: data.error || 'Erreur lors de la mise à jour.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Impossible de joindre le serveur.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-taupe-900">
            Catalogue & Tarification des Soins
          </h1>
          <p className="text-xs text-taupe-600 mt-1">
            Gérez les prix par personne, durées et statuts actifs de vos prestations Duo Spa.
          </p>
        </div>
        <button
          onClick={fetchServices}
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

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-taupe-500 text-xs">
            Chargement du catalogue...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50/80 text-taupe-600 font-semibold uppercase text-[10px] tracking-wider border-b border-sand-200">
                <tr>
                  <th className="py-3.5 px-4">Prestation</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Format</th>
                  <th className="py-3.5 px-4">Durée</th>
                  <th className="py-3.5 px-4">Prix / pers.</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {services.map((s) => {
                  const isDuo = s.format === 'duo';
                  return (
                    <tr key={s.slug || s._id} className="hover:bg-sand-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-taupe-900 block">{s.name}</span>
                        <span className="text-[10px] text-taupe-500 line-clamp-1">
                          {s.shortDescription}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 capitalize text-taupe-700">
                        {s.category}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isDuo ? 'bg-gold-100 text-gold-900' : 'bg-sand-100 text-taupe-800'
                          }`}
                        >
                          {isDuo ? 'Duo simultané' : 'Solo'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-taupe-800">
                        {s.durationMinutes} min
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-sage-900">
                        {s.pricePerPerson} $
                      </td>
                      <td className="py-3.5 px-4 font-bold text-taupe-900">
                        {s.totalPrice} $
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            s.isActive !== false
                              ? 'bg-sage-100 text-sage-900'
                              : 'bg-red-100 text-red-900'
                          }`}
                        >
                          {s.isActive !== false ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="px-2.5 py-1 bg-sand-100 hover:bg-sand-200 text-taupe-700 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Modifier</span>
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

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-taupe-500 font-semibold block">
                  Édition du soin
                </span>
                <h3 className="font-serif text-lg font-bold text-taupe-900">
                  {editingService.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="text-taupe-400 hover:text-taupe-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-taupe-700 mb-1">
                  Prix par personne ($ CAD) :
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-200 rounded-xl text-sm font-semibold text-taupe-900 focus:outline-none focus:ring-2 focus:ring-sage-600"
                />
                <span className="text-[10px] text-taupe-500 mt-1 block">
                  Total automatique : {editingService.format === 'duo' ? editPrice * 2 : editPrice} $ CAD
                </span>
              </div>

              <div>
                <label className="block font-semibold text-taupe-700 mb-1">
                  Durée (en minutes) :
                </label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  required
                  value={editDuration}
                  onChange={(e) => setEditDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-200 rounded-xl text-sm font-semibold text-taupe-900 focus:outline-none focus:ring-2 focus:ring-sage-600"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="w-4 h-4 text-sage-600 rounded border-sand-300 focus:ring-sage-500"
                  />
                  <span className="font-semibold text-taupe-800">
                    Soin actif et réservable en ligne
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-sand-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 border border-sand-300 rounded-xl font-medium text-taupe-600 hover:bg-sand-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-sage-800 hover:bg-sage-900 text-white rounded-xl font-semibold shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
