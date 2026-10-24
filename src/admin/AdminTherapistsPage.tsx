import React, { useEffect, useState } from 'react';
import { AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';

export const AdminTherapistsPage: React.FC = () => {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [demoNotice, setDemoNotice] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchTherapists = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/therapists');
      const data = await res.json();
      if (res.ok && data.success) {
        setTherapists(data.therapists || []);
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
    async function loadTherapists() {
      try {
        const res = await fetch('/api/admin/therapists');
        const data = await res.json();
        if (!ignore && res.ok && data.success) {
          setTherapists(data.therapists || []);
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
    loadTherapists();
    return () => {
      ignore = true;
    };
  }, []);

  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-taupe-900">
            Équipe de Massothérapeutes
          </h1>
          <p className="text-xs text-taupe-600 mt-1">
            Roster des professionnels certifiés et profils d'allocation pour les soins en duo simultanés.
          </p>
        </div>
        <button
          onClick={fetchTherapists}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start sm:self-auto bg-white border border-sand-300 hover:bg-sand-50 text-taupe-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Prominent Demo Data Disclaimer */}
      <div className="p-4 bg-gold-50 border border-gold-300 rounded-2xl flex items-start gap-3.5 text-xs text-taupe-800 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-semibold text-gold-950 block">
            Données de démonstration pour développement :
          </strong>
          <p className="text-taupe-700 leading-relaxed">
            {demoNotice ||
              'Ces fiches thérapeutes sont des profils fictifs utilisés exclusivement pour le calcul des disponibilités et les tests de synchronisation en duo. Aucune donnée d’employé réel n’est encore reliée.'}
          </p>
        </div>
      </div>

      {/* Therapists Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-taupe-500 text-xs bg-white rounded-2xl border border-sand-200">
          Chargement des fiches thérapeutes...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {therapists.map((t) => (
            <div
              key={t._id}
              className="bg-white p-5 rounded-2xl border border-sand-200 shadow-xs space-y-4 hover:border-sage-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-sage-800 text-gold-300 flex items-center justify-center font-serif font-bold text-base">
                    {t.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-taupe-900 leading-tight">
                      {t.name}
                    </h3>
                    <span className="text-[11px] text-taupe-500">{t.email}</span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                    t.canDoDuo
                      ? 'bg-gold-100 text-gold-900 border border-gold-300'
                      : 'bg-sand-100 text-taupe-800'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-gold-600" />
                  {t.canDoDuo ? 'Certifiée Duo' : 'Solo'}
                </span>
              </div>

              {/* Skills badges */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-taupe-500 font-semibold block">
                  Compétences & Spécialités :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {t.skills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-sand-100 text-taupe-700 text-[10px] font-medium capitalize"
                    >
                      {skill.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Schedule Days */}
              <div className="pt-3 border-t border-sand-100 space-y-1.5 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-taupe-500 font-semibold block">
                  Disponibilité hebdomadaire :
                </span>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {t.schedule?.map((s: any) => (
                    <div
                      key={s.dayOfWeek}
                      className={`py-1 rounded-md text-[10px] font-semibold ${
                        s.isWorking
                          ? 'bg-sage-100 text-sage-900 border border-sage-200'
                          : 'bg-sand-100/60 text-taupe-400'
                      }`}
                    >
                      <span>{daysOfWeek[s.dayOfWeek]}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-taupe-500 block pt-1">
                  Horaires types : 09 h 00 – 20 h 00 (Lundis fermés)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
