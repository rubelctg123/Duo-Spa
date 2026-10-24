import React, { useEffect, useState } from 'react';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardPage } from './AdminDashboardPage';
import { AdminBookingsPage } from './AdminBookingsPage';
import { AdminServicesPage } from './AdminServicesPage';
import { AdminTherapistsPage } from './AdminTherapistsPage';
import { AdminRoomsPage } from './AdminRoomsPage';

export const AdminRouter: React.FC = () => {
  const [admin, setAdmin] = useState<any | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  // Synchronize with window pathname on popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Check active admin session on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.admin) {
          setAdmin(data.admin);
          if (window.location.pathname === '/admin/login' || window.location.pathname === '/admin') {
            navigateTo('/admin/dashboard');
          }
        } else {
          setAdmin(null);
          if (window.location.pathname !== '/admin/login') {
            navigateTo('/admin/login');
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setAdmin(null);
          if (window.location.pathname !== '/admin/login') {
            navigateTo('/admin/login');
          }
        }
      })
      .finally(() => {
        if (isMounted) setCheckingAuth(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginSuccess = (adminUser: any) => {
    setAdmin(adminUser);
    navigateTo('/admin/dashboard');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
    setAdmin(null);
    navigateTo('/admin/login');
  };

  const handleNavigateHome = () => {
    window.location.href = '/#accueil';
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-sage-950 flex flex-col items-center justify-center text-ivory-100 text-xs space-y-3">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sage-300">Vérification de la session administrative...</p>
      </div>
    );
  }

  // If not authenticated or on /admin/login
  if (!admin || currentPath === '/admin/login') {
    return (
      <AdminLoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateHome={handleNavigateHome}
      />
    );
  }

  // Derive active tab from currentPath: /admin/bookings -> 'bookings'
  const activeTab = currentPath.replace('/admin/', '').replace('/admin', '') || 'dashboard';

  const handleTabChange = (tabId: string) => {
    navigateTo(`/admin/${tabId}`);
  };

  return (
    <AdminLayout
      admin={admin}
      currentTab={activeTab}
      onNavigateTab={handleTabChange}
      onLogout={handleLogout}
      onNavigateHome={handleNavigateHome}
    >
      {activeTab === 'dashboard' && <AdminDashboardPage onNavigateTab={handleTabChange} />}
      {activeTab === 'bookings' && <AdminBookingsPage />}
      {activeTab === 'services' && <AdminServicesPage />}
      {activeTab === 'therapists' && <AdminTherapistsPage />}
      {activeTab === 'rooms' && <AdminRoomsPage />}
    </AdminLayout>
  );
};
