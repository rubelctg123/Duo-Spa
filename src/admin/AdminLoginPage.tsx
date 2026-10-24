import React, { useState } from 'react';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: (admin: any) => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(data.admin);
      } else {
        setError(data.error || 'Identifiants invalides. Veuillez vérifier votre adresse et mot de passe.');
      }
    } catch {
      setError('Impossible de joindre le serveur d’authentification. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sage-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-gold-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex w-14 h-14 rounded-full bg-sage-900 border border-gold-400/40 items-center justify-center text-gold-300 shadow-md">
          <Sparkles className="w-7 h-7 text-gold-400" />
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-wide text-ivory-50">
          Duo Spa Joliette
        </h1>
        <p className="text-xs uppercase tracking-widest text-gold-400/90 font-medium">
          Espace d’administration sécurisé
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-sage-900/90 border border-sage-800 shadow-2xl rounded-2xl p-8 backdrop-blur-sm space-y-6">
          {error && (
            <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email-input" className="block text-xs font-semibold text-ivory-200 mb-1.5">
                Courriel administratif :
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sage-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-sage-950/90 border border-sage-700/80 rounded-xl text-sm text-ivory-50 placeholder:text-taupe-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password-input" className="block text-xs font-semibold text-ivory-200 mb-1.5">
                Mot de passe :
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sage-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-sage-950/90 border border-sage-700/80 rounded-xl text-sm text-ivory-50 placeholder:text-taupe-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider bg-gold-500 hover:bg-gold-600 text-sage-950 transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <span>Accéder au tableau de bord</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-sage-800/80 text-center">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs text-sage-400 hover:text-ivory-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retourner au site public</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
