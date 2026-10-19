import React, { useState } from 'react';
import { PGProvider, usePG } from './context/PGContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DemoBanner } from './components/common/DemoBanner';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { TenantsPage } from './pages/TenantsPage';
import { RoomsPage } from './pages/RoomsPage';
import { BillsPage } from './pages/BillsPage';
import { DepositsPage } from './pages/DepositsPage';
import { LifecyclePage } from './pages/LifecyclePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

// Global Modals
import { AddTenantModal } from './components/modals/AddTenantModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { CheckoutWizardModal } from './components/modals/CheckoutWizardModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { QuickTourModal } from './components/modals/QuickTourModal';
import { FeedbackDrawer } from './components/modals/FeedbackDrawer';
import { NotificationsDrawer } from './components/modals/NotificationsDrawer';

const AppContent: React.FC = () => {
  const { activeTab } = usePG();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'tenants':
        return <TenantsPage />;
      case 'rooms':
        return <RoomsPage />;
      case 'bills':
        return <BillsPage />;
      case 'deposits':
        return <DepositsPage />;
      case 'lifecycle':
        return <LifecyclePage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <DemoBanner />
        <Navbar onToggleMobileMenu={() => setMobileOpen(!mobileOpen)} />

        <main className="content-area">
          {renderActivePage()}
        </main>

        {/* Mobile Bottom Navigation Bar (Fixed bottom on <= 768px) */}
        <MobileBottomNav onOpenMenu={() => setMobileOpen(true)} />
      </div>

      {/* Global Modals & Drawers */}
      <AddTenantModal />
      <RecordPaymentModal />
      <CheckoutWizardModal />
      <ReceiptModal />
      <QuickTourModal />
      <FeedbackDrawer />
      <NotificationsDrawer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PGProvider>
      <AppContent />
    </PGProvider>
  );
};

export default App;
