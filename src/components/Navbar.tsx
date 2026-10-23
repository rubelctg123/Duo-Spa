import React, { useState } from 'react';
import { Menu, X, Calendar, Sparkles, Phone, MapPin } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenBooking: (treatmentId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenBooking }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'soins', label: 'Nos Soins' },
    { id: 'duo', label: 'L’Expérience Duo' },
    { id: 'spa-joliette', label: 'Le Spa & Emplacement' },
    { id: 'faq', label: 'Foire aux questions' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingClick = () => {
    onOpenBooking();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory-50/95 backdrop-blur-md border-b border-sand-200/80 transition-shadow">
      {/* Top subtle contact bar */}
      <div className="hidden lg:block border-b border-sand-200/50 bg-ivory-100/60 py-1.5 px-6 text-xs text-taupe-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-taupe-700">
              <MapPin className="w-3.5 h-3.5 text-sage-600" />
              Joliette, Lanaudière (QC) <span className="text-[10px] text-taupe-500">(Adresse d’exemple)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-taupe-700">
              <Phone className="w-3.5 h-3.5 text-sage-600" />
              (450) 000-0000 <span className="text-[10px] text-taupe-500">(Numéro démo)</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-taupe-600">
            <span>Mar – Dim : 9 h à 20 h <span className="text-[10px] text-taupe-500">(Exemple)</span></span>
            <span className="inline-block w-1 h-1 rounded-full bg-sand-300"></span>
            <span className="text-sage-800 font-medium">Reçus d’assurance (sous réserve d’accréditation)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('accueil')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-full bg-sage-800 flex items-center justify-center text-gold-300 shadow-sm transition-transform duration-300 group-hover:scale-105 border border-gold-400/30">
              <Sparkles className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-2xl font-bold tracking-wider text-sage-900 block leading-tight">
                Duo Spa
              </span>
              <span className="text-[10px] tracking-widest uppercase text-sand-600 font-medium">
                Joliette • Sanctuaire & Détente
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-sage-900 bg-sage-100/70 font-semibold'
                      : 'text-taupe-700 hover:text-sage-800 hover:bg-sand-100/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Call to Action */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={handleBookingClick}
              className="inline-flex items-center gap-2 bg-sage-800 hover:bg-sage-900 text-ivory-50 px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow hover:-translate-y-0.5 border border-sage-700"
            >
              <Calendar className="w-4 h-4 text-gold-300" />
              <span>Réserver un soin</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleBookingClick}
              className="inline-flex items-center gap-1.5 bg-sage-800 text-ivory-50 px-3.5 py-1.5 rounded-full text-xs font-medium"
            >
              <Calendar className="w-3.5 h-3.5 text-gold-300" />
              <span>Réserver</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-taupe-700 hover:text-sage-900 hover:bg-sand-100 focus:outline-none"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ivory-50 border-b border-sand-300 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                currentView === item.id
                  ? 'bg-sage-100 text-sage-900 font-semibold'
                  : 'text-taupe-700 hover:bg-sand-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-sand-200 mt-2">
            <button
              onClick={handleBookingClick}
              className="w-full flex items-center justify-center gap-2 bg-sage-800 text-ivory-50 py-3 rounded-xl font-medium shadow"
            >
              <Calendar className="w-4 h-4 text-gold-300" />
              Réserver votre rendez-vous
            </button>
            <div className="mt-3 text-center text-xs text-taupe-500">
              Joliette (Québec) • Exemple de contact : (450) 000-0000 (Démo)
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
