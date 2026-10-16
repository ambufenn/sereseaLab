import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, Shipment, PurchaseOrder, CatchBatch, SellerOrder } from './types';
import {
  INITIAL_SHIPMENTS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_CATCH_BATCHES,
  INITIAL_SELLER_ORDERS
} from './data/mockData';
import { testFirestoreConnection, signOut } from './lib/firebase';

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
import { SmartAIAssistant } from './components/common/SmartAIAssistant';

// Seller Components (Fisheries Exporter)
import { SellerOverview } from './components/seller/SellerOverview';
import { SellerCatchInventory } from './components/seller/SellerCatchInventory';
import { SellerOrderFulfillment } from './components/seller/SellerOrderFulfillment';
import { SellerExportCompliance } from './components/seller/SellerExportCompliance';
import { SellerAIPricingAdvisor } from './components/seller/SellerAIPricingAdvisor';

// Logistics Components
import { LogisticsOverview } from './components/logistics/LogisticsOverview';
import { LogisticsShipmentMonitoring } from './components/logistics/LogisticsShipmentMonitoring';
import { LogisticsColdChain } from './components/logistics/LogisticsColdChain';
import { LogisticsRiskCenter } from './components/logistics/LogisticsRiskCenter';
import { LogisticsWastePrevention } from './components/logistics/LogisticsWastePrevention';
import { LogisticsDocumentation } from './components/logistics/LogisticsDocumentation';
import { LogisticsAIAssistant } from './components/logistics/LogisticsAIAssistant';

// Experience Lab (Reefer Tetris, Seafood Journey, Simulator, SupplyChainDiagramDemo)
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
  const [batches, setBatches] = useState<CatchBatch[]>(INITIAL_CATCH_BATCHES);
  const [sellerOrders, setSellerOrders] = useState<SellerOrder[]>(INITIAL_SELLER_ORDERS);

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
    const name = newRole === 'buyer'
      ? 'Sarah Lin'
      : newRole === 'seller'
      ? 'Capt. Budi Hendrawan'
      : 'Marcus Vance';

    const organization = newRole === 'buyer'
      ? 'Oceanic Procurement Co.'
      : newRole === 'seller'
      ? 'PT Batam Samudera Bahari (ID)'
      : 'Nordic Cold-Chain Fleet';

    setCurrentUser({
      ...currentUser,
      role: newRole,
      name,
      organization
    });
    setCurrentSection('overview');
  };

  const handleResetDemoData = () => {
    setShipments(INITIAL_SHIPMENTS);
    setOrders(INITIAL_PURCHASE_ORDERS);
    setBatches(INITIAL_CATCH_BATCHES);
    setSellerOrders(INITIAL_SELLER_ORDERS);
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

  // Seller Action Handlers
  const handleRegisterBatch = (newBatch: CatchBatch) => {
    setBatches(prev => [newBatch, ...prev]);
  };

  const handleUpdateBatch = (updated: CatchBatch) => {
    setBatches(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const handleUpdateOrderStatus = (orderId: string, status: SellerOrder['status']) => {
    setSellerOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleDispatchToLogistics = (order: SellerOrder, containerId: string, carrierName: string) => {
    // 1. Update seller order to dispatched
    setSellerOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'dispatched' as const } : o));

    // 2. Add an active maritime cold-chain shipment conforming to Shipment interface
    const newShipmentId = `SHP-SG${Math.floor(10 + Math.random() * 90)}`;
    const newShipment: Shipment = {
      id: newShipmentId,
      containerId: containerId,
      species: order.species,
      quantityKg: order.weightKg,
      origin: 'Batam Batu Ampar, Indonesia',
      destination: 'Jurong Fishery Port, Singapore',
      carrier: carrierName,
      status: 'in_transit',
      currentTemp: -2.0,
      targetTemp: -2.0,
      riskLevel: 'normal',
      qimFreshnessScore: 1.5,
      shelfLifeRemainingDays: 14,
      eta: 'Today, 14:30 SGT',
      departureDate: new Date().toISOString().split('T')[0],
      buyerName: order.buyerName,
      supplierName: 'PT Batam Samudera Bahari',
      cargoValueUSD: order.totalAmountUSD,
      telemetryHistory: [
        { time: '10:00', temperature: -2.0, humidity: 88, targetTemp: -2.0, doorOpen: false },
        { time: '10:30', temperature: -1.9, humidity: 87, targetTemp: -2.0, doorOpen: false },
        { time: '11:00', temperature: -2.1, humidity: 88, targetTemp: -2.0, doorOpen: false },
        { time: '11:30', temperature: -2.0, humidity: 89, targetTemp: -2.0, doorOpen: false }
      ],
      alerts: []
    };

    setShipments(prev => [newShipment, ...prev]);
  };

  // If user is not logged in: Render strictly the dedicated Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isBuyer = currentUser.role === 'buyer';
  const isSeller = currentUser.role === 'seller';
  const isLogistics = currentUser.role === 'logistics';

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
            } else if (isSeller) {
              setCurrentSection('compliance');
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
                <SmartAIAssistant
                  role={currentUser.role}
                  user={currentUser}
                  shipments={shipments}
                  orders={orders}
                  batches={batches}
                  sellerOrders={sellerOrders}
                  currentSection={currentSection}
                  onNavigate={(sec) => setCurrentSection(sec)}
                />
              )}
            </>
          )}

          {/* SELLER / EXPORTER VIEWS */}
          {isSeller && (
            <>
              {currentSection === 'overview' && (
                <SellerOverview
                  batches={batches}
                  sellerOrders={sellerOrders}
                  shipments={shipments}
                  onNavigate={(sec) => setCurrentSection(sec)}
                  onOpenAddBatch={() => setCurrentSection('inventory')}
                  onDispatchOrder={() => setCurrentSection('orders')}
                />
              )}

              {currentSection === 'inventory' && (
                <SellerCatchInventory
                  batches={batches}
                  onAddBatch={handleRegisterBatch}
                  onUpdateBatchStatus={(batchId, status) =>
                    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status } : b))
                  }
                />
              )}

              {currentSection === 'orders' && (
                <SellerOrderFulfillment
                  orders={sellerOrders}
                  batches={batches}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onDispatchToLogistics={handleDispatchToLogistics}
                />
              )}

              {currentSection === 'compliance' && (
                <SellerExportCompliance
                  batches={batches}
                  orders={sellerOrders}
                />
              )}

              {currentSection === 'pricing' && (
                <SellerAIPricingAdvisor
                  batches={batches}
                />
              )}

              {currentSection === 'tracking' && (
                <GlobalCommandCenter
                  shipments={shipments}
                  role="buyer"
                />
              )}

              {currentSection === 'assistant' && (
                <SmartAIAssistant
                  role={currentUser.role}
                  user={currentUser}
                  shipments={shipments}
                  orders={orders}
                  batches={batches}
                  sellerOrders={sellerOrders}
                  currentSection={currentSection}
                  onNavigate={(sec) => setCurrentSection(sec)}
                />
              )}
            </>
          )}

          {/* LOGISTICS VIEWS */}
          {isLogistics && (
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
                <SmartAIAssistant
                  role={currentUser.role}
                  user={currentUser}
                  shipments={shipments}
                  orders={orders}
                  batches={batches}
                  sellerOrders={sellerOrders}
                  currentSection={currentSection}
                  onNavigate={(sec) => setCurrentSection(sec)}
                />
              )}
            </>
          )}

          {/* SHARED EXPERIENCE LAB (Reefer Tetris, Seafood Journey, Simulator, SupplyChainDiagramDemo) */}
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
