/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Stats } from './components/Stats';
import { Docs } from './components/Docs';
import { Garage } from './components/Garage';
import { 
  Gauge, 
  History as HistoryIcon, 
  TrendingUp, 
  FileText, 
  Warehouse, 
  Settings, 
  Flame, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Coins 
} from 'lucide-react';

function AppContent() {
  const { activeMotorcycle, registerMileage, isDbReady } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'stats' | 'docs' | 'garage'>('dashboard');
  const [isMileageModalOpen, setIsMileageModalOpen] = useState(false);
  const [newMileage, setNewMileage] = useState('');

  const handleMileageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(newMileage, 10);
    if (isNaN(parsed) || parsed <= 0) {
      alert('Por favor ingrese un kilometraje válido.');
      return;
    }
    registerMileage(parsed);
    setIsMileageModalOpen(false);
    setNewMileage('');
  };

  const handleOpenMileageModal = () => {
    if (activeMotorcycle) {
      setNewMileage(activeMotorcycle.currentKm.toString());
    }
    setIsMileageModalOpen(true);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onRegisterMileageClick={handleOpenMileageModal} />;
      case 'history':
        return <History />;
      case 'stats':
        return <Stats />;
      case 'docs':
        return <Docs />;
      case 'garage':
        return <Garage onRegisterMileageClick={handleOpenMileageModal} />;
      default:
        return <Dashboard onRegisterMileageClick={handleOpenMileageModal} />;
    }
  };

  if (!isDbReady) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-gray-100 font-mono select-none">
        <div className="w-full max-w-sm border border-gray-800 bg-[#0d0d0d] p-6 rounded-xl flex flex-col gap-4 relative overflow-hidden">
          {/* Animated top indicator */}
          <div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF5C00] to-transparent w-full animate-pulse"></div>
          
          <div className="flex justify-between items-center text-[#FF5C00] font-black italic text-lg tracking-tighter">
            <span>MOTO-AFRICANO v2.1</span>
            <span className="animate-pulse">● LIVE OS</span>
          </div>
          
          <div className="h-px bg-gray-800"></div>
          
          <div className="space-y-1.5 text-[10px] text-gray-500 uppercase tracking-widest">
            <p className="flex justify-between"><span>[INIT] SECURE DB MOUNT</span> <span className="text-[#00E676]">Succeeded</span></p>
            <p className="flex justify-between"><span>[BOOT] SYSTEM LOGIC</span> <span className="text-[#00E676]">Active</span></p>
            <p className="flex justify-between"><span>[INDEXED_DB] READ/WRITE</span> <span className="text-gray-400">Loading...</span></p>
            <p className="flex justify-between"><span>[ECU] OBD2 DECODERS</span> <span className="text-[#FFD600]">Awaiting</span></p>
          </div>
          
          <div className="h-px bg-gray-800"></div>
          
          <div className="flex items-center gap-3 mt-1">
            {/* Spinning indicator */}
            <div className="w-4 h-4 border-2 border-t-transparent border-[#FF5C00] rounded-full animate-spin shrink-0"></div>
            <span className="text-xs uppercase text-gray-300 font-bold tracking-wider">Iniciando base de datos IndexedDB...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans flex flex-col md:flex-row overflow-x-hidden selection:bg-[#FF5C00]/30">
      
      {/* Sidebar - Visible on Desktop */}
      <aside className="hidden md:flex w-20 border-r border-[#FF5C00]/20 bg-[#0d0d0d] flex-col items-center py-8 justify-between shrink-0">
        <div className="flex flex-col items-center gap-10 w-full">
          <div 
            className="text-[#FF5C00] font-black text-2xl italic tracking-tighter cursor-pointer transition-all hover:scale-105" 
            onClick={() => setActiveTab('dashboard')}
          >
            MA
          </div>
          <nav className="flex flex-col gap-6 text-center text-[10px] font-bold uppercase tracking-tighter w-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-1.5 py-3 transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'text-[#FF5C00] border-r-2 border-[#FF5C00]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Gauge className="w-5 h-5" />
              <span>DASH</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center gap-1.5 py-3 transition-all cursor-pointer ${
                activeTab === 'history' ? 'text-[#FF5C00] border-r-2 border-[#FF5C00]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <HistoryIcon className="w-5 h-5" />
              <span>HIST</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex flex-col items-center gap-1.5 py-3 transition-all cursor-pointer ${
                activeTab === 'stats' ? 'text-[#FF5C00] border-r-2 border-[#FF5C00]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>STAT</span>
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex flex-col items-center gap-1.5 py-3 transition-all cursor-pointer ${
                activeTab === 'docs' ? 'text-[#FF5C00] border-r-2 border-[#FF5C00]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>DOCS</span>
            </button>
            <button
              onClick={() => setActiveTab('garage')}
              className={`flex flex-col items-center gap-1.5 py-3 transition-all cursor-pointer ${
                activeTab === 'garage' ? 'text-[#FF5C00] border-r-2 border-[#FF5C00]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Warehouse className="w-5 h-5" />
              <span>GARAGE</span>
            </button>
          </nav>
        </div>

        <button 
          onClick={() => setActiveTab('garage')}
          className="text-gray-500 hover:text-[#FF5C00] transition-colors p-1"
          title="Ficha Técnica"
        >
          <Settings className="w-5 h-5" />
        </button>
      </aside>

      {/* Top Mobile Bar - Visible on Mobile */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0d0d0d] border-b border-gray-800 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="text-[#FF5C00] font-black text-xl italic">MA</div>
          <span className="font-sans text-lg font-black tracking-tighter text-[#FF5C00]">MOTO-AFRICANO</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenMileageModal}
            className="bg-[#FF5C00] text-black font-black text-[10px] px-3 py-1.5 uppercase tracking-wide skew-btn transition-colors hover:bg-orange-400 active:scale-95"
          >
            <span className="skew-btn-inner">+ KM</span>
          </button>
          <button 
            onClick={() => setActiveTab('garage')}
            className="text-gray-400 p-1"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 max-w-7xl w-full mx-auto flex flex-col gap-6">
          
          {/* Main Top Header - Visible on Desktop */}
          <section className="hidden md:flex justify-between items-start border-b border-gray-800/60 pb-6">
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">
                {activeMotorcycle?.brand} <span className="text-[#FF5C00]">{activeMotorcycle?.model}</span>
              </h1>
              <div className="flex items-center gap-4 mt-2 text-xs font-mono text-gray-500">
                <span className="border border-gray-800 px-2 py-0.5">VIN: {activeMotorcycle?.chassisVin}</span>
                <span>KMS: {activeMotorcycle?.currentKm.toLocaleString()} KM</span>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <button 
                onClick={handleOpenMileageModal}
                className="bg-[#FF5C00] text-black font-black text-xs px-6 py-3 uppercase tracking-wider skew-btn hover:bg-orange-400 transition-colors cursor-pointer"
              >
                <span className="skew-btn-inner">+ Actualizar KM</span>
              </button>
              <div className="w-12 h-12 border border-[#FF5C00]/30 bg-[#0d0d0d] flex items-center justify-center rounded-full overflow-hidden text-lg">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdxFwEXdT9uHLzQB3vcduSu4GVX4SLAeUukSpQDFGGAo3AxsQaPCh1jlNynQdyBs3czzE_REucdDxiHu4VX_T1tVdnB1sx1NWJJHOIXlcNLJmqHIX1zmTGf27NbyCOlKZ2RceLnMajIeechzfVVJDLBFqKnAD2BzM6dfQU8bAxIhdqr_bgkL0MOEevnXMgi9DMETL3F1KzLpdku18l__weMQtL-KvkaKrRjNY2GMOb0sQD6Bg4SI1Xs1KHMBEyE-1fNcHcDa5TG_n8" 
                  alt="Racer Profile"
                />
              </div>
            </div>
          </section>

          {/* Current view tab render */}
          <div className="flex-1 min-h-0">
            {renderActiveTab()}
          </div>

          {/* High Density Footer */}
          <footer className="mt-auto pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start">
              <span>LAT: 6.2442° N</span>
              <span>LON: 75.5812° W</span>
              <span>ALTI: 1495M</span>
            </div>
            <div>Moto-Africano Telemetry System v2.1 // COLOMBIA</div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0d0d0d]/95 backdrop-blur-md border-t border-gray-800 z-50 flex justify-around items-center px-2">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all active:scale-90 ${
            activeTab === 'dashboard' ? 'text-[#FF5C00]' : 'text-gray-500'
          }`}
        >
          <Gauge className="w-5 h-5" />
          <span className="font-mono text-[8px] uppercase tracking-tighter mt-1 font-bold">DASH</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all active:scale-90 ${
            activeTab === 'history' ? 'text-[#FF5C00]' : 'text-gray-500'
          }`}
        >
          <HistoryIcon className="w-5 h-5" />
          <span className="font-mono text-[8px] uppercase tracking-tighter mt-1 font-bold">HIST</span>
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all active:scale-90 ${
            activeTab === 'stats' ? 'text-[#FF5C00]' : 'text-gray-500'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="font-mono text-[8px] uppercase tracking-tighter mt-1 font-bold">STAT</span>
        </button>
        <button 
          onClick={() => setActiveTab('docs')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all active:scale-90 ${
            activeTab === 'docs' ? 'text-[#FF5C00]' : 'text-gray-500'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="font-mono text-[8px] uppercase tracking-tighter mt-1 font-bold">DOCS</span>
        </button>
        <button 
          onClick={() => setActiveTab('garage')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-all active:scale-90 ${
            activeTab === 'garage' ? 'text-[#FF5C00]' : 'text-gray-500'
          }`}
        >
          <Warehouse className="w-5 h-5" />
          <span className="font-mono text-[8px] uppercase tracking-tighter mt-1 font-bold">GARAGE</span>
        </button>
      </nav>

      {/* Odometer Update Modal */}
      {isMileageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsMileageModalOpen(false)}></div>
          
          <div className="relative bg-[#111111] border border-gray-800 w-full max-w-sm p-6 rounded-2xl flex flex-col gap-5 border-t-2 border-t-[#FF5C00] shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
                <Gauge className="w-5 h-5 text-[#FF5C00]" />
                Odómetro Semanal
              </h3>
              <button 
                onClick={() => setIsMileageModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeMotorcycle && (
              <form onSubmit={handleMileageSubmit} className="space-y-4">
                <div className="bg-[#0a0a0a] p-4 border border-gray-800 space-y-1">
                  <span className="font-mono text-[9px] text-gray-500 uppercase block">Vehículo Seleccionado</span>
                  <span className="text-sm font-bold text-white uppercase">{activeMotorcycle.brand} {activeMotorcycle.model}</span>
                  <p className="font-mono text-xs text-gray-400 mt-1">Odómetro actual: <span className="text-[#FF5C00] font-bold">{activeMotorcycle.currentKm.toLocaleString()} KM</span></p>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block">Nuevo Kilometraje *</label>
                  <input
                    type="number"
                    placeholder="Ingrese el nuevo odómetro"
                    value={newMileage}
                    onChange={(e) => setNewMileage(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-base font-semibold transition-colors"
                    required
                  />
                  <span className="text-[10px] text-gray-500 font-mono block mt-1 leading-normal uppercase">Registrar el kilometraje actual permite calcular los desgastes y proyectar las alertas.</span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-[#FF5C00] hover:bg-orange-600 text-black font-black text-xs py-3.5 uppercase tracking-widest skew-btn transition-all active:scale-95 shadow-lg shadow-orange-950/20"
                >
                  <span className="skew-btn-inner text-black">Registrar Odómetro</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
