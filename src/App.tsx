import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CatalogView } from './components/CatalogView';
import { AgencyPanelView } from './components/AgencyPanelView';
import { SellMyCarView } from './components/SellMyCarView';
import { AdminSaasPanelView } from './components/AdminSaasPanelView';
import { AiToolsView } from './components/AiToolsView';
import { CarDetailModal } from './components/CarDetailModal';
import { CarFormModal } from './components/CarFormModal';
import { LoginModal } from './components/LoginModal';
import { RedeemCodeModal } from './components/RedeemCodeModal';
import { CompareCarsModal } from './components/CompareCarsModal';
import { CarListing } from './types';
import { Car, Building2, Tag, ShieldCheck, Plus, Sparkles, KeyRound } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentAgency,
    isCompareModalOpen,
    setIsCompareModalOpen,
  } = useApp();
  const [selectedDetailCar, setSelectedDetailCar] = useState<CarListing | null>(null);
  const [isCarFormOpen, setIsCarFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarListing | null>(null);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  const handleOpenCarForm = (car?: CarListing) => {
    setEditingCar(car || null);
    setIsCarFormOpen(true);
  };

  const handleOpenCarDetail = (car: CarListing) => {
    setSelectedDetailCar(car);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-20 md:pb-0 antialiased">
      {/* Top Main Navbar with TallerYa-style light branding & quick tabs */}
      <Navbar
        onOpenCarForm={() => handleOpenCarForm()}
        onOpenSettings={() => setCurrentView('admin-panel')}
        onOpenRedeemCode={() => setIsRedeemModalOpen(true)}
      />

      {/* Main Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {currentView === 'agency-panel' && (
          <AgencyPanelView
            onOpenCarForm={handleOpenCarForm}
            onOpenCarDetail={handleOpenCarDetail}
            onGoToSaasAdmin={() => setCurrentView('admin-panel')}
            onOpenRedeemCode={() => setIsRedeemModalOpen(true)}
          />
        )}

        {currentView === 'catalog' && (
          <CatalogView
            onSelectCar={handleOpenCarDetail}
            onOpenSellCar={() => setCurrentView('sell-my-car')}
            onOpenAgencyPanel={() => setCurrentView('agency-panel')}
          />
        )}

        {currentView === 'sell-my-car' && <SellMyCarView />}

        {currentView === 'admin-panel' && <AdminSaasPanelView />}

        {currentView === 'ai-tools' && <AiToolsView />}
      </main>

      {/* Mobile Bottom Quick Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg flex items-center justify-around py-2 px-1">
        <button
          onClick={() => setCurrentView('agency-panel')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            currentView === 'agency-panel' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px]">Portal Carga</span>
        </button>

        <button
          onClick={() => setCurrentView('catalog')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            currentView === 'catalog' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Car className="w-5 h-5" />
          <span className="text-[10px]">Catálogo</span>
        </button>

        <button
          onClick={() => handleOpenCarForm()}
          className="flex flex-col items-center gap-0.5 py-1.5 px-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md shadow-blue-700/25 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span className="text-[9px]">Cargar</span>
        </button>

        <button
          onClick={() => setCurrentView('sell-my-car')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            currentView === 'sell-my-car' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="text-[10px]">Vender</span>
        </button>

        <button
          onClick={() => setCurrentView('admin-panel')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
            currentView === 'admin-panel' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span className="text-[10px]">Administrador</span>
        </button>
      </nav>

      {/* Global Modals */}
      <CarDetailModal
        car={selectedDetailCar}
        onClose={() => setSelectedDetailCar(null)}
        onEditCar={(car) => {
          setSelectedDetailCar(null);
          handleOpenCarForm(car);
        }}
      />

      <CarFormModal
        isOpen={isCarFormOpen}
        onClose={() => {
          setIsCarFormOpen(false);
          setEditingCar(null);
        }}
        initialCar={editingCar}
      />

      {/* Seller Authentication & Login Modal */}
      <LoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Redeem Single-Use Subscription Code Modal */}
      <RedeemCodeModal
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
      />

      {/* Vehicle Comparison Modal (Side-by-side up to 3 cars) */}
      <CompareCarsModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onSelectCar={handleOpenCarDetail}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
