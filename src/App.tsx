import { useState, useEffect } from 'react';
import { AdminRouter } from './admin/AdminRouter';
import { DemoBanner } from './components/DemoBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TreatmentDetailModal } from './components/TreatmentDetailModal';
import { HomePage } from './pages/HomePage';
import { TreatmentsPage } from './pages/TreatmentsPage';
import { DuoExperiencePage } from './pages/DuoExperiencePage';
import { AboutLocationSection } from './pages/AboutLocationSection';
import { FAQSection } from './pages/FAQSection';
import { BookingPage } from './pages/BookingPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { SAMPLE_TREATMENTS } from './data/treatmentsData';
import type { Treatment, BookingState } from './types/treatment';

export function App() {
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  const [currentView, setCurrentView] = useState<string>('accueil');
  const [treatmentsList, setTreatmentsList] = useState<Treatment[]>(SAMPLE_TREATMENTS);
  const [selectedTreatmentDetail, setSelectedTreatmentDetail] = useState<Treatment | null>(null);
  const [bookingPreselectedId, setBookingPreselectedId] = useState<string | null>(null);
  const [latestBooking, setLatestBooking] = useState<BookingState | null>(null);

  // Fetch live active services from backend API on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.services) && data.services.length > 0) {
          setTreatmentsList(data.services);
        }
      })
      .catch(() => {
        // Retain initial mock data if API is loading or offline
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize with URL hash on mount and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validViews = ['accueil', 'soins', 'duo', 'spa-joliette', 'faq', 'reserver', 'confirmation'];
      if (validViews.includes(hash)) {
        setCurrentView(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (treatmentId?: string) => {
    if (treatmentId) {
      setBookingPreselectedId(treatmentId);
    } else {
      setBookingPreselectedId(null);
    }
    navigateTo('reserver');
  };

  const handleBookingComplete = (booking: BookingState) => {
    setLatestBooking(booking);
    navigateTo('confirmation');
  };

  const handleViewDetails = (treatment: Treatment) => {
    setSelectedTreatmentDetail(treatment);
  };

  // If navigating to an admin route, render AdminRouter after unconditional hooks execution
  if (isAdminRoute) {
    return <AdminRouter />;
  }

  const duoTreatments = treatmentsList.filter((t) => t.format === 'duo');

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 text-taupe-800 font-sans">
      {/* Top Prototype Information Banner */}
      <DemoBanner />

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenBooking={handleOpenBooking}
      />

      {/* Dynamic View Content */}
      <main className="flex-1">
        {currentView === 'accueil' && (
          <HomePage
            featuredTreatments={treatmentsList}
            onNavigate={navigateTo}
            onOpenBooking={handleOpenBooking}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentView === 'soins' && (
          <TreatmentsPage
            treatments={treatmentsList}
            onOpenBooking={handleOpenBooking}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentView === 'duo' && (
          <DuoExperiencePage
            duoTreatments={duoTreatments}
            onOpenBooking={handleOpenBooking}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentView === 'spa-joliette' && (
          <AboutLocationSection onOpenBooking={handleOpenBooking} />
        )}

        {currentView === 'faq' && <FAQSection />}

        {currentView === 'reserver' && (
          <BookingPage
            treatments={treatmentsList}
            preselectedTreatmentId={bookingPreselectedId}
            onBookingComplete={handleBookingComplete}
            onNavigateToCatalog={() => navigateTo('soins')}
          />
        )}

        {currentView === 'confirmation' && (
          latestBooking ? (
            <ConfirmationPage
              booking={latestBooking}
              onNewBooking={() => handleOpenBooking()}
              onNavigateHome={() => navigateTo('accueil')}
            />
          ) : (
            <div className="py-20 text-center space-y-4">
              <p className="text-taupe-600">Aucune réservation récente à afficher.</p>
              <button
                onClick={() => navigateTo('accueil')}
                className="bg-sage-800 text-ivory-50 px-6 py-2.5 rounded-full text-xs font-semibold"
              >
                Retourner à l’accueil
              </button>
            </div>
          )
        )}
      </main>

      {/* Treatment Detail Modal (Reusable across cards and pages) */}
      <TreatmentDetailModal
        treatment={selectedTreatmentDetail}
        onClose={() => setSelectedTreatmentDetail(null)}
        onBook={(treatment) => {
          setSelectedTreatmentDetail(null);
          handleOpenBooking(treatment.id);
        }}
      />

      {/* Footer */}
      <Footer onNavigate={navigateTo} onOpenBooking={() => handleOpenBooking()} />
    </div>
  );
}

export default App;
