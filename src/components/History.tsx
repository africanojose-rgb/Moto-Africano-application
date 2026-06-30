/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaintenanceCategory, MaintenanceLog } from '../types';
import { Plus, X, Calendar, Wrench, Coins, Settings, CheckCircle2 } from 'lucide-react';

export const History: React.FC = () => {
  const { maintenanceLogs, activeMotorcycle, addMaintenanceLog } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [km, setKm] = useState('');
  const [category, setCategory] = useState<MaintenanceCategory>('Motor');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<MaintenanceLog['status']>('Completed');

  const categories: string[] = ['Todos', 'Motor', 'Frenos', 'Llantas', 'Transmisión', 'Electrónica', 'Otros'];

  const filteredLogs = selectedFilter === 'Todos'
    ? maintenanceLogs
    : maintenanceLogs.filter(log => log.category === selectedFilter);

  const formattedCost = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getCategoryColor = (cat: MaintenanceCategory) => {
    switch (cat) {
      case 'Motor': return 'border-orange-500/20 bg-orange-500/10 text-orange-400';
      case 'Frenos': return 'border-red-500/20 bg-red-500/10 text-red-400';
      case 'Llantas': return 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400';
      case 'Transmisión': return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400';
      case 'Electrónica': return 'border-green-500/20 bg-green-500/10 text-green-400';
      default: return 'border-gray-500/20 bg-gray-500/10 text-gray-400';
    }
  };

  const getLogBorderColor = (cat: MaintenanceCategory) => {
    switch (cat) {
      case 'Motor': return 'border-l-orange-500';
      case 'Frenos': return 'border-l-red-500';
      case 'Llantas': return 'border-l-cyan-500';
      case 'Transmisión': return 'border-l-yellow-500';
      case 'Electrónica': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleOpenModal = () => {
    setTitle('');
    setCost('');
    setKm(activeMotorcycle ? activeMotorcycle.currentKm.toString() : '');
    setCategory('Motor');
    // Set today's date in format DD/MM/AAAA
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    setDate(`${dd}/${mm}/${yyyy}`);
    setStatus('Completed');
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMotorcycle) return;
    if (!title || !cost || !km || !date) {
      alert('Por favor complete todos los campos requeridos.');
      return;
    }

    const parsedCost = parseFloat(cost);
    const parsedKm = parseInt(km, 10);

    if (isNaN(parsedCost) || isNaN(parsedKm)) {
      alert('Ingrese valores numéricos válidos.');
      return;
    }

    addMaintenanceLog({
      motorcycleId: activeMotorcycle.id,
      date,
      title,
      cost: parsedCost,
      km: parsedKm,
      category,
      status
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 relative">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-800/60 pb-4">
        <div>
          <p className="font-mono text-xs text-[#FF5C00] uppercase tracking-widest font-black">Bitácoras de Rendimiento</p>
          <h2 className="text-2xl md:text-3xl text-white font-black italic uppercase tracking-tighter mt-1">Historial de Mantenimiento</h2>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-[#FF5C00] text-black font-black text-xs px-5 py-3 uppercase tracking-wider skew-btn hover:bg-orange-400 transition-colors cursor-pointer self-start md:self-auto"
        >
          <span className="skew-btn-inner text-black">+ NUEVO REGISTRO</span>
        </button>
      </header>

      {/* Filter Chips Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-gray-800 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-all border whitespace-nowrap active:scale-95 cursor-pointer ${
              selectedFilter === cat
                ? 'border-[#FF5C00] bg-[#FF5C00]/10 text-[#FF5C00] font-black'
                : 'border-gray-800 text-gray-500 hover:text-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List of Maintenance Interventions */}
      <div className="space-y-4">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`bg-[#111111] border border-gray-800 p-5 rounded-xl border-l-4 ${getLogBorderColor(log.category)} relative overflow-hidden flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:bg-white/5`}
            >
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] text-gray-500 uppercase font-bold">{log.date}</span>
                <h4 className="text-base font-black italic tracking-tight text-white uppercase">{log.title}</h4>
                
                <div className="flex items-center gap-4 mt-2.5">
                  <div className="flex items-center gap-1.5 font-mono text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5 text-[#FF5C00]" />
                    <span>{log.km.toLocaleString()} KM</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-gray-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    <span className="uppercase">{log.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-2 border-t sm:border-t-0 border-gray-800 pt-3 sm:pt-0">
                <div className="text-right">
                  <p className="text-xl font-black italic text-[#FF5C00] tracking-tighter">{formattedCost(log.cost)}</p>
                  <span className="font-mono text-[9px] text-gray-500 uppercase block">COP TOTAL</span>
                </div>
                <span className={`px-2 py-0.5 border rounded text-[9px] font-mono font-bold uppercase tracking-wider ${getCategoryColor(log.category)}`}>
                  {log.category}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#111111] border border-dashed border-gray-800 p-12 text-center rounded-xl flex flex-col items-center justify-center">
            <Wrench className="w-10 h-10 text-gray-600 mb-3 animate-pulse" />
            <p className="text-xs text-gray-500 uppercase font-mono tracking-widest font-bold">No se encontraron registros en esta categoría.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={handleOpenModal}
        className="md:hidden fixed right-6 bottom-24 w-14 h-14 bg-[#FF5C00] text-black flex items-center justify-center shadow-xl shadow-orange-950/30 border border-orange-500/30 cursor-pointer active:scale-95 transition-transform z-40 skew-btn"
      >
        <span className="skew-btn-inner text-black">
          <Plus className="w-7 h-7" />
        </span>
      </button>

      {/* Add Maintenance Log Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)}></div>
          
          <div className="relative bg-[#111111] border border-gray-800 w-full max-w-md p-6 rounded-2xl flex flex-col gap-5 border-t-2 border-t-[#FF5C00] shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#FF5C00]" />
                Registrar Servicio
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Título del Servicio *</label>
                <input
                  type="text"
                  placeholder="Ej. Cambio de Pastillas Brembo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Costo total (COP) *</label>
                  <input
                    type="number"
                    placeholder="Ej. 180000"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Kilometraje actual *</label>
                  <input
                    type="number"
                    placeholder="Ej. 12450"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Categoría *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MaintenanceCategory)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                  >
                    <option value="Motor">Motor</option>
                    <option value="Frenos">Frenos</option>
                    <option value="Llantas">Llantas</option>
                    <option value="Transmisión">Transmisión</option>
                    <option value="Electrónica">Electrónica</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Fecha (DD/MM/AAAA) *</label>
                  <input
                    type="text"
                    placeholder="Ej. 29/06/2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Estado del Mantenimiento *</label>
                <div className="flex gap-3">
                  {(['Completed', 'Routine', 'Archived'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex-1 py-2 font-mono text-xs uppercase tracking-wider rounded border cursor-pointer text-center transition-all ${
                        status === s
                          ? 'border-[#FF5C00] bg-[#FF5C00]/10 text-[#FF5C00] font-bold'
                          : 'border-gray-800 bg-[#0a0a0a] text-gray-500'
                      }`}
                    >
                      {s === 'Completed' ? 'Completado' : s === 'Routine' ? 'Rutina' : 'Archivado'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[#FF5C00] hover:bg-orange-600 text-black font-black text-xs py-3.5 uppercase tracking-widest skew-btn transition-all active:scale-95 shadow-lg shadow-orange-950/20"
              >
                <span className="skew-btn-inner text-black">CONFIRMAR REGISTRO</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
