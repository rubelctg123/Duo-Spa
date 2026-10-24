import React from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  Sparkle,
  Users,
  DoorOpen,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface AdminLayoutProps {
  admin: any;
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  admin,
  currentTab,
  onNavigateTab,
  onLogout,
  onNavigateHome,
  children,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'bookings', label: 'Réservations', icon: Calendar },
    { id: 'services', label: 'Prestations & Tarifs', icon: Sparkle },
    { id: 'therapists', label: 'Thérapeutes (Démo)', icon: Users },
    { id: 'rooms', label: 'Salles & Suites (Démo)', icon: DoorOpen },
  ];

  return (
    <div className="min-h-screen bg-sand-50/70 text-taupe-800 flex flex-col font-sans selection:bg-gold-500 selection:text-white">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-sage-950 text-ivory-50 border-b border-sage-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sage-900 border border-gold-400/40 flex items-center justify-center text-gold-300 shrink-0">
                <Sparkles className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-ivory-50 block leading-tight">
                  Duo Spa Joliette
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                  Console d’administration
                </span>
              </div>
            </div>

            {/* Admin Profile & Actions */}
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-ivory-100">{admin?.name || 'Administrateur'}</span>
                <span className="text-[10px] text-gold-400/90 capitalize">{admin?.role || 'superadmin'}</span>
              </div>

              <button
                type="button"
                onClick={onNavigateHome}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sage-900 hover:bg-sage-800 text-ivory-200 text-xs border border-sage-800 transition-colors"
                title="Voir le site client public"
              >
                <span>Site public</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900/80 text-red-200 text-xs border border-red-800/60 transition-colors"
                title="Se déconnecter de la session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Navigation Bar / Tabs */}
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-sage-800/80 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigateTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-gold-500 text-sage-950 shadow-sm'
                      : 'text-sage-200 hover:text-white hover:bg-sage-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Subtle Footer */}
      <footer className="py-4 border-t border-sand-200/80 text-center text-[11px] text-taupe-500 bg-sand-100/40">
        Duo Spa Joliette • Module d'administration protégé (Loi 25 & Accès authentifié)
      </footer>
    </div>
  );
};
