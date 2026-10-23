import { useState, useEffect } from 'react';
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
  const [currentView, setCurrentView] = useState<string>('accueil');
  const [selectedTreatmentDetail, setSelectedTreatmentDetail] = useState<Treatment | null>(null);
  const [bookingPreselectedId, setBookingPreselectedId] = useState<string | null>(null);
  const [latestBooking, setLatestBooking] = useState<BookingState | null>(null);

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

  const duoTreatments = SAMPLE_TREATMENTS.filter((t) => t.format === 'duo');

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
            featuredTreatments={SAMPLE_TREATMENTS}
            onNavigate={navigateTo}
            onOpenBooking={handleOpenBooking}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentView === 'soins' && (
          <TreatmentsPage
            treatments={SAMPLE_TREATMENTS}
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
            treatments={SAMPLE_TREATMENTS}
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
