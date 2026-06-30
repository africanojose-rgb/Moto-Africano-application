/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Motorcycle } from '../types';
import { Plus, X, Edit, Gauge, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

interface GarageProps {
  onRegisterMileageClick: () => void;
}

export const Garage: React.FC<GarageProps> = ({ onRegisterMileageClick }) => {
  const {
    motorcycles,
    activeMotorcycleId,
    setActiveMotorcycleId,
    addMotorcycle,
    updateMotorcycle
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit Form States
  const [editBrand, setEditBrand] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editVin, setEditVin] = useState('');
  const [editPlate, setEditPlate] = useState('');

  // Add Form States
  const [addBrand, setAddBrand] = useState('');
  const [addModel, setAddModel] = useState('');
  const [addYear, setAddYear] = useState('');
  const [addInitialKm, setAddInitialKm] = useState('');
  const [addVin, setAddVin] = useState('');
  const [addPlate, setAddPlate] = useState('');
  const [addPhotoUrl, setAddPhotoUrl] = useState('');

  const activeMoto = motorcycles.find(m => m.id === activeMotorcycleId) || motorcycles[0];
  const reserveFleet = motorcycles.filter(m => m.id !== activeMotorcycleId);

  const handleOpenEditModal = () => {
    if (!activeMoto) return;
    setEditBrand(activeMoto.brand);
    setEditModel(activeMoto.model);
    setEditYear(activeMoto.year.toString());
    setEditVin(activeMoto.chassisVin);
    setEditPlate(activeMoto.licensePlate);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMoto) return;
    const parsedYear = parseInt(editYear, 10);
    if (isNaN(parsedYear)) {
      alert('Año inválido.');
      return;
    }
    updateMotorcycle(activeMoto.id, {
      brand: editBrand,
      model: editModel,
      year: parsedYear,
      chassisVin: editVin,
      licensePlate: editPlate
    });
    setIsEditModalOpen(false);
  };

  const handleOpenAddModal = () => {
    setAddBrand('');
    setAddModel('');
    setAddYear(new Date().getFullYear().toString());
    setAddInitialKm('');
    setAddVin('');
    setAddPlate('');
    setAddPhotoUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuDbypDeq-_VDAoN2MLcDeVys6E_B6D5B98C9EP7hZ2PHhHyEegxQdyAE8V5Kk6db9_I2dyEIgF0P9L2SH_JQfprd7BUZZfklcyMpqYoPtzeLYUBXsyP-mV7GUX_0FsW8Tk3_cRv3CE1MlxCe2st0oLZYKmwuwSvDv761H9TSwIHTXbyyWD0aBtsRfyw-Y0mKO1LyIvc5c3sBMi5MsCdCLVugMkiAjHYxyH6b9ritRgyInmrerjPCBDWOVelgrYTRHB7xBU1F2LTpzEU');
    setIsAddModalOpen(true);
  };

  const handleAddMotorcycleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addBrand || !addModel || !addYear || !addInitialKm || !addVin || !addPlate) {
      alert('Complete todos los campos requeridos.');
      return;
    }

    const parsedYear = parseInt(addYear, 10);
    const parsedInitialKm = parseInt(addInitialKm, 10);

    if (isNaN(parsedYear) || isNaN(parsedInitialKm)) {
      alert('Año o kilometraje inválidos.');
      return;
    }

    addMotorcycle({
      brand: addBrand.toUpperCase(),
      model: addModel.toUpperCase(),
      year: parsedYear,
      initialKm: parsedInitialKm,
      photoUrl: addPhotoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbypDeq-_VDAoN2MLcDeVys6E_B6D5B98C9EP7hZ2PHhHyEegxQdyAE8V5Kk6db9_I2dyEIgF0P9L2SH_JQfprd7BUZZfklcyMpqYoPtzeLYUBXsyP-mV7GUX_0FsW8Tk3_cRv3CE1MlxCe2st0oLZYKmwuwSvDv761H9TSwIHTXbyyWD0aBtsRfyw-Y0mKO1LyIvc5c3sBMi5MsCdCLVugMkiAjHYxyH6b9ritRgyInmrerjPCBDWOVelgrYTRHB7xBU1F2LTpzEU',
      chassisVin: addVin.toUpperCase(),
      licensePlate: addPlate.toUpperCase()
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header section with Add button */}
      <section className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-800 pb-4">
        <div>
          <p className="font-mono text-xs text-[#FF5C00] uppercase tracking-widest font-black">Tuning de Garaje</p>
          <h2 className="text-2xl md:text-3xl text-white font-black italic uppercase tracking-tighter mt-1">Garaje Principal</h2>
          <p className="font-mono text-[10px] text-gray-500 uppercase mt-0.5 font-bold">
            {motorcycles.length} Máquinas Registradas • 1 Activa
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[#FF5C00] text-black font-black text-xs px-5 py-3 uppercase tracking-wider skew-btn hover:bg-orange-400 transition-colors cursor-pointer self-start md:self-auto"
        >
          <span className="skew-btn-inner text-black flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            AGREGAR NUEVA
          </span>
        </button>
      </section>

      {/* Main Active Motorcycle Profile */}
      {activeMoto && (
        <section className="space-y-4">
          <h4 className="font-mono text-[10px] uppercase text-gray-500 tracking-widest font-bold">Máquina Activa</h4>
          <div className="relative overflow-hidden bg-[#111111] border border-gray-800 p-1">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FF5C00]"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 flex flex-col justify-between order-2 md:order-1 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest">
                      Flota Activa
                    </span>
                    <span className="bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest">
                      Optimizado
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl text-white font-black italic leading-none tracking-tighter uppercase">
                    {activeMoto.brand} {activeMoto.model}
                  </h3>
                  <p className="font-mono text-[11px] text-gray-400 uppercase mt-1 font-bold">
                    Año {activeMoto.year} • Edición de Rendimiento
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div>
                      <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest font-bold">Odómetro</p>
                      <p className="text-2xl font-black italic text-white tracking-tight mt-0.5">
                        {activeMoto.currentKm.toLocaleString()} <span className="text-xs text-gray-500 font-mono font-normal">KM</span>
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest font-bold">Próximo Límite</p>
                      <p className="text-2xl font-black italic text-[#FFD600] tracking-tight mt-0.5">
                        {(Math.ceil(activeMoto.currentKm / 5000) * 5000).toLocaleString()} <span className="text-xs text-gray-500 font-mono font-normal">KM</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleOpenEditModal}
                    className="flex-1 border border-gray-800 text-gray-300 font-mono text-[10px] uppercase tracking-widest font-bold py-3.5 skew-btn hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <span className="skew-btn-inner text-gray-300">EDITAR PERFIL</span>
                  </button>
                  <button 
                    onClick={onRegisterMileageClick}
                    className="w-14 h-14 border border-gray-800 bg-[#0a0a0a] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                    title="Actualizar Kilometraje"
                  >
                    <Gauge className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative h-56 md:h-full order-1 md:order-2 overflow-hidden bg-black/40">
                <img 
                  src={activeMoto.photoUrl} 
                  alt={activeMoto.model} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent md:bg-gradient-to-l md:from-[#111111]"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reserve Fleet Section */}
      <section className="space-y-4 pt-4">
        <h4 className="font-mono text-[10px] uppercase text-gray-500 tracking-widest font-bold">Flota de Reserva</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reserveFleet.map((moto) => (
            <div
              key={moto.id}
              onClick={() => setActiveMotorcycleId(moto.id)}
              className="bg-[#111111] p-4 rounded-xl flex items-center gap-4 group border border-gray-800 hover:border-[#FF5C00]/30 transition-all cursor-pointer"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-gray-800">
                <img 
                  src={moto.photoUrl} 
                  alt={moto.model} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h5 className="text-base font-black italic text-white truncate uppercase tracking-tighter">
                  {moto.brand} {moto.model}
                </h5>
                <p className="font-mono text-[10px] text-gray-500 uppercase mt-0.5 font-bold">
                  Año {moto.year} • {moto.currentKm.toLocaleString()} KM
                </p>

                <div className="w-full h-1 bg-gray-900 overflow-hidden mt-3 relative">
                  <div className="h-full bg-[#00E676] w-3/4"></div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#FF5C00] transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* Edit Motorcycle Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)}></div>
          
          <div className="relative bg-[#111111] border border-gray-800 w-full max-w-md p-6 rounded-2xl flex flex-col gap-5 border-t-2 border-t-[#FF5C00] shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF5C00]" />
                Modificar Ficha Técnica
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Fabricante / Marca *</label>
                <input
                  type="text"
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Línea o Modelo *</label>
                <input
                  type="text"
                  value={editModel}
                  onChange={(e) => setEditModel(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Año Modelo *</label>
                  <input
                    type="number"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Placa del Vehículo *</label>
                  <input
                    type="text"
                    value={editPlate}
                    onChange={(e) => setEditPlate(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Chasis / Número VIN *</label>
                <input
                  type="text"
                  value={editVin}
                  onChange={(e) => setEditVin(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#FF5C00] hover:bg-orange-600 text-black font-black text-xs py-3.5 uppercase tracking-widest skew-btn transition-all active:scale-95 shadow-lg shadow-orange-950/20"
              >
                <span className="skew-btn-inner text-black">ACTUALIZAR FICHA</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Motorcycle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)}></div>
          
          <div className="relative bg-[#111111] border border-gray-800 w-full max-w-md p-6 rounded-2xl flex flex-col gap-5 border-t-2 border-t-[#FF5C00] shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FF5C00]" />
                Registrar Nueva Máquina
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMotorcycleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Marca (Fabricante) *</label>
                <input
                  type="text"
                  placeholder="Ej. HONDA"
                  value={addBrand}
                  onChange={(e) => setAddBrand(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Línea o Modelo *</label>
                <input
                  type="text"
                  placeholder="Ej. CB1000R"
                  value={addModel}
                  onChange={(e) => setAddModel(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Año *</label>
                  <input
                    type="number"
                    placeholder="Ej. 2024"
                    value={addYear}
                    onChange={(e) => setAddYear(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Kilometraje Inicial *</label>
                  <input
                    type="number"
                    placeholder="Ej. 12000"
                    value={addInitialKm}
                    onChange={(e) => setAddInitialKm(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Número VIN *</label>
                  <input
                    type="text"
                    placeholder="Ej. 9HK-1234-CO"
                    value={addVin}
                    onChange={(e) => setAddVin(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Placa *</label>
                  <input
                    type="text"
                    placeholder="Ej. ABC-123"
                    value={addPlate}
                    onChange={(e) => setAddPlate(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">URL de Foto (Opcional)</label>
                <input
                  type="text"
                  placeholder="URL de imagen"
                  value={addPhotoUrl}
                  onChange={(e) => setAddPhotoUrl(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[#FF5C00] hover:bg-orange-600 text-black font-black text-xs py-3.5 uppercase tracking-widest skew-btn transition-all active:scale-95 shadow-lg shadow-orange-950/20"
              >
                <span className="skew-btn-inner text-black">REGISTRAR MÁQUINA</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
