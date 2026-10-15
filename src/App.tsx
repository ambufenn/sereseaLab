import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, Shipment, PurchaseOrder } from './types';
import { INITIAL_SHIPMENTS, INITIAL_PURCHASE_ORDERS } from './data/mockData';
import { testFirestoreConnection, signOut, auth, onAuthStateChanged } from './lib/firebase';

// Layout & Auth
import { LoginPage } from './components/auth/LoginPage';
import { AppHeader } from './components/layout/AppHeader';
import { AppSidebar } from './components/layout/AppSidebar';
import { SettingsModal } from './components/common/SettingsModal';

// Buyer Components
import { BuyerOverview } from './components/buyer/BuyerOverview';
import { BuyerDemandIntelligence } from './components/buyer/BuyerDemandIntelligence';
import { BuyerSupplierMatching } from './components/buyer/BuyerSupplierMatching';
import { BuyerOrderTracking } from './components/buyer/BuyerOrderTracking';
import { BuyerQualityRisk } from './components/buyer/BuyerQualityRisk';
import { BuyerAIAssistant } from './components/buyer/BuyerAIAssistant';

// Logistics Components
import { LogisticsOverview } from './components/logistics/LogisticsOverview';
import { LogisticsShipmentMonitoring } from './components/logistics/LogisticsShipmentMonitoring';
import { LogisticsColdChain } from './components/logistics/LogisticsColdChain';
import { LogisticsRiskCenter } from './components/logistics/LogisticsRiskCenter';
import { LogisticsWastePrevention } from './components/logistics/LogisticsWastePrevention';
import { LogisticsDocumentation } from './components/logistics/LogisticsDocumentation';
import { LogisticsAIAssistant } from './components/logistics/LogisticsAIAssistant';

// Experience Lab (Reefer Tetris, Seafood Journey, Simulator)
import { ExperienceLab } from './components/experience/ExperienceLab';

// Global Command Center & Real Tracking
import { GlobalCommandCenter } from './components/dashboard/GlobalCommandCenter';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Layout State
  const [currentSection, setCurrentSection] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  // Operational State
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [orders, setOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  // Critical alert count
  const criticalAlertCount = shipments.filter(s => s.riskLevel === 'critical').length;

  useEffect(() => {
    testFirestoreConnection().catch(console.error);
  }, []);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentSection('overview');
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch {
      // Ignored
    }
    setCurrentUser(null);
    setCurrentSection('overview');
    setSelectedShipment(null);
    setSelectedOrder(null);
  };

  const handleSwitchRole = (newRole: UserRole) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      role: newRole,
      name: newRole === 'buyer' ? 'Sarah Lin' : 'Marcus Vance',
      organization: newRole === 'buyer' ? 'Oceanic Procurement Co.' : 'Nordic Cold-Chain Fleet'
    });
    setCurrentSection('overview');
  };

  const handleResetDemoData = () => {
    setShipments(INITIAL_SHIPMENTS);
    setOrders(INITIAL_PURCHASE_ORDERS);
  };

  const handleResolveAlert = (shipmentId: string, alertId: string) => {
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return {
          ...s,
          riskLevel: 'normal',
          currentTemp: s.targetTemp,
          alerts: s.alerts.map(a => a.id === alertId ? { ...a, resolved: true } : a)
        };
      }
      return s;
    }));
  };

  // If user is not logged in: Render strictly the dedicated Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isBuyer = currentUser.role === 'buyer';

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans antialiased">
      {/* Collapsible, Role-Specific Sidebar */}
      <AppSidebar
        role={currentUser.role}
        currentSection={currentSection}
        onSelectSection={(sec) => setCurrentSection(sec)}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* App Header adhering to Top Bar Contract */}
        <AppHeader
          user={currentUser}
          currentSection={currentSection}
          onSwitchRole={handleSwitchRole}
          onLogout={handleLogout}
          criticalAlertCount={criticalAlertCount}
          onViewAlerts={() => {
            if (isBuyer) {
              setCurrentSection('quality');
            } else {
              setCurrentSection('risk');
            }
          }}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* BUYER VIEWS */}
          {isBuyer && (
            <>
              {currentSection === 'overview' && (
                <BuyerOverview
                  orders={orders}
                  shipments={shipments}
                  onNavigate={(sec) => setCurrentSection(sec)}
                  onSelectOrder={(ord) => {
                    setSelectedOrder(ord);
                    setCurrentSection('orders');
                  }}
                />
              )}

              {currentSection === 'tracking' && (
                <GlobalCommandCenter
                  shipments={shipments}
                  role="buyer"
                />
              )}

              {currentSection === 'demand' && (
                <BuyerDemandIntelligence
                  onInitiateOrder={() => setCurrentSection('suppliers')}
                />
              )}

              {currentSection === 'suppliers' && (
                <BuyerSupplierMatching />
              )}

              {currentSection === 'orders' && (
                <BuyerOrderTracking
                  orders={orders}
                  selectedOrder={selectedOrder}
                  onClearSelected={() => setSelectedOrder(null)}
                />
              )}

              {currentSection === 'quality' && (
                <BuyerQualityRisk />
              )}

              {currentSection === 'assistant' && (
                <BuyerAIAssistant />
              )}
            </>
          )}

          {/* LOGISTICS VIEWS */}
          {!isBuyer && (
            <>
              {currentSection === 'overview' && (
                <LogisticsOverview
                  shipments={shipments}
                  onNavigate={(sec) => setCurrentSection(sec)}
                  onSelectShipment={(shp) => {
                    setSelectedShipment(shp);
                  }}
                  onResolveAlert={handleResolveAlert}
                />
              )}

              {currentSection === 'tracking' && (
                <GlobalCommandCenter
                  shipments={shipments}
                  role="logistics"
                  onSelectShipment={(shp) => setSelectedShipment(shp)}
                />
              )}

              {currentSection === 'shipments' && (
                <LogisticsShipmentMonitoring
                  shipments={shipments}
                  onSelectShipment={(shp) => setSelectedShipment(shp)}
                  onNavigateToColdChain={(shp) => {
                    setSelectedShipment(shp);
                    setCurrentSection('coldchain');
                  }}
                />
              )}

              {currentSection === 'coldchain' && (
                <LogisticsColdChain
                  shipments={shipments}
                  selectedShipment={selectedShipment}
                />
              )}

              {currentSection === 'risk' && (
                <LogisticsRiskCenter
                  shipments={shipments}
                  onNavigateToWaste={() => setCurrentSection('waste')}
                />
              )}

              {currentSection === 'waste' && (
                <LogisticsWastePrevention />
              )}

              {currentSection === 'docs' && (
                <LogisticsDocumentation />
              )}

              {currentSection === 'assistant' && (
                <LogisticsAIAssistant />
              )}
            </>
          )}

          {/* SHARED EXPERIENCE LAB (Reefer Tetris, Seafood Journey, Simulator) */}
          {currentSection === 'lab' && (
            <ExperienceLab />
          )}
        </main>
      </div>

      {/* Global Settings & Preferences Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentRole={currentUser.role}
        onRoleChange={(role) => handleSwitchRole(role)}
        tempUnit={tempUnit}
        onTempUnitChange={(unit) => setTempUnit(unit)}
        onResetDemoData={handleResetDemoData}
      />
    </div>
  );
}
