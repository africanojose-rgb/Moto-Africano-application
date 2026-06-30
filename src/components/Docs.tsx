/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, ShieldAlert, CheckCircle, Copy, FileText, UploadCloud, Edit, X } from 'lucide-react';

export const Docs: React.FC = () => {
  const { documents, activeMotorcycle, updateDocument } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingDocId, setEditingDocId] = useState<'licencia' | 'soat' | 'tecnomecanica' | null>(null);

  // Editing form states
  const [expDate, setExpDate] = useState('');
  const [policyNum, setPolicyNum] = useState('');

  // Current date for comparison is June 29, 2026
  const getDaysRemaining = (expirationDateStr: string): number => {
    const parts = expirationDateStr.split('/');
    if (parts.length !== 3) return 0;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    const year = parseInt(parts[2], 10);
    const expDate = new Date(year, month, day);
    const currentDate = new Date(2026, 5, 29); // June 29, 2026
    const diffTime = expDate.getTime() - currentDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDocStatusAndColor = (days: number) => {
    if (days < 0) return { label: 'CRÍTICO', bg: 'bg-[#FF1744]/10 text-[#FF1744]', border: 'border-[#FF1744]', text: 'text-[#FF1744]', shadow: 'shadow-[#FF1744]/10', percentage: 0 };
    if (days < 3) return { label: 'CRÍTICO', bg: 'bg-[#FF1744]/10 text-[#FF1744]', border: 'border-[#FF1744]', text: 'text-[#FF1744]', shadow: 'shadow-[#FF1744]/10', percentage: Math.round((days / 30) * 100) };
    if (days < 15) return { label: 'ADVERTENCIA', bg: 'bg-[#FFD600]/10 text-[#FFD600]', border: 'border-[#FFD600]', text: 'text-[#FFD600]', shadow: 'shadow-[#FFD600]/10', percentage: Math.round((days / 30) * 100) };
    return { label: 'ÓPTIMO', bg: 'bg-[#00E676]/10 text-[#00E676]', border: 'border-[#00E676]', text: 'text-[#00E676]', shadow: 'shadow-[#00E676]/10', percentage: Math.min(100, Math.round((days / 90) * 100)) };
  };

  const handleEditClick = (doc: typeof documents[0]) => {
    setExpDate(doc.expirationDate);
    setPolicyNum(doc.policyNumberOrCDA);
    setEditingDocId(doc.id);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDocId) return;
    if (!expDate || !policyNum) {
      alert('Complete todos los campos requeridos.');
      return;
    }
    updateDocument(editingDocId, expDate, policyNum);
    setEditingDocId(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1 border-b border-gray-800 pb-4">
        <p className="font-mono text-xs text-[#FF5C00] uppercase tracking-widest font-black">Telemétrica de Documentación Legal</p>
        <h2 className="text-2xl md:text-3xl text-white font-black italic uppercase tracking-tighter mt-1">Estatus Legal (Colombia)</h2>
      </header>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => {
          const days = getDaysRemaining(doc.expirationDate);
          const status = getDocStatusAndColor(days);

          return (
            <div
              key={doc.id}
              className={`bg-[#111111] border ${status.border} rounded-xl p-6 flex flex-col justify-between min-h-[220px] transition-all hover:scale-[1.01]`}
              style={{ boxShadow: `0 0 15px rgba(${status.border === 'border-[#FF1744]' ? '255,23,68' : status.border === 'border-[#FFD600]' ? '255,214,0' : '0,230,118'}, 0.08)` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`px-2 py-0.5 border rounded font-mono text-[9px] font-bold uppercase tracking-wider ${status.bg}`}>
                    {status.label}
                  </span>
                  <h3 className="text-lg font-black italic text-white tracking-tighter uppercase mt-2">{doc.name}</h3>
                  <p className="font-mono text-[11px] text-gray-500 uppercase mt-0.5">{doc.categoryOrDetails}</p>
                </div>

                <div className={`${status.text}`}>
                  {days < 0 ? (
                    <ShieldAlert className="w-8 h-8" />
                  ) : days < 15 ? (
                    <ShieldAlert className="w-8 h-8 animate-pulse" />
                  ) : (
                    <CheckCircle className="w-8 h-8 text-[#00E676]" />
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-1.5 w-full bg-gray-900 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      status.border === 'border-[#FF1744]' ? 'bg-[#FF1744]' : status.border === 'border-[#FFD600]' ? 'bg-[#FFD600]' : 'bg-[#00E676]'
                    }`}
                    style={{ width: `${status.percentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-gray-500 text-[9px] uppercase font-mono block font-bold">Estatus de Vigencia</span>
                    <span className={`font-mono text-xl font-black tracking-tight ${days < 0 ? 'text-[#FF1744]' : 'text-white'}`}>
                      {days < 0 ? 'VENCIDO' : `${days} DÍAS`}
                    </span>
                  </div>

                  <button
                    onClick={() => handleEditClick(doc)}
                    className={`border font-mono text-[10px] uppercase tracking-widest font-black px-3.5 py-1.5 skew-btn transition-all cursor-pointer ${
                      status.border === 'border-[#FF1744]' 
                        ? 'border-[#FF1744] text-[#FF1744] hover:bg-[#FF1744]/10' 
                        : status.border === 'border-[#FFD600]' 
                        ? 'border-[#FFD600] text-[#FFD600] hover:bg-[#FFD600]/10' 
                        : 'border-[#00E676] text-[#00E676] hover:bg-[#00E676]/10'
                    }`}
                  >
                    <span className="skew-btn-inner flex items-center gap-1.5">
                      <Edit className="w-3 h-3" />
                      RENOVAR
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Digital Garage Vault */}
      {activeMotorcycle && (
        <section className="space-y-4 pt-4">
          <h3 className="font-mono text-xs uppercase text-[#FF5C00] tracking-widest font-bold border-l-2 border-[#FF5C00] pl-3.5">
            Bóveda de Identificación de Garaje
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chassis VIN */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center border border-gray-800 text-gray-500 font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-gray-500 block font-bold">Chasis / Número VIN</span>
                  <span className="font-mono text-white text-sm font-semibold uppercase">{activeMotorcycle.chassisVin}</span>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(activeMotorcycle.chassisVin, 'vin')}
                className="text-gray-500 hover:text-[#FF5C00] p-2 transition-colors cursor-pointer"
                title="Copiar VIN"
              >
                {copiedId === 'vin' ? (
                  <span className="font-mono text-[10px] text-[#00E676] uppercase font-bold">Copiado</span>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* License Plate */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-4 flex items-center justify-between transition-all hover:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center border border-gray-800 text-gray-500 font-bold font-mono text-base">
                  #
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-gray-500 block font-bold">Placa del Vehículo</span>
                  <span className="font-mono text-white text-sm font-semibold uppercase">{activeMotorcycle.licensePlate}</span>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(activeMotorcycle.licensePlate, 'plate')}
                className="text-gray-500 hover:text-[#FF5C00] p-2 transition-colors cursor-pointer"
                title="Copiar Placa"
              >
                {copiedId === 'plate' ? (
                  <span className="font-mono text-[10px] text-[#00E676] uppercase font-bold">Copiado</span>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Quick Upload Container */}
      <section className="mt-8">
        <label htmlFor="file-upload" className="w-full h-32 border-2 border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center bg-[#111111]/40 hover:bg-[#111111] transition-colors cursor-pointer group p-6">
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            onChange={() => alert('¡Documento cargado correctamente! El sistema de escaneo inteligente extraerá las fechas clave.')}
          />
          <UploadCloud className="w-8 h-8 text-gray-500 group-hover:text-[#FF5C00] transition-colors mb-2" />
          <p className="font-mono text-xs uppercase text-gray-400 group-hover:text-white transition-colors tracking-widest font-black">Cargar nuevo documento (PDF/JPG)</p>
          <span className="text-[10px] text-gray-600 font-mono uppercase mt-1">Sincroniza licencia, SOAT o Tecnomecánica</span>
        </label>
      </section>

      {/* Edit Document Modal */}
      {editingDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setEditingDocId(null)}></div>
          
          <div className="relative bg-[#111111] border border-gray-800 w-full max-w-md p-6 rounded-2xl flex flex-col gap-5 border-t-2 border-t-[#FF5C00] shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#FF5C00]" />
                Actualizar Documento
              </h3>
              <button onClick={() => setEditingDocId(null)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Fecha de Vencimiento (DD/MM/AAAA) *</label>
                <input
                  type="text"
                  placeholder="Ej. 15/06/2027"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Número de Póliza / CDA / Registro *</label>
                <input
                  type="text"
                  placeholder="Ej. SOAT-991823"
                  value={policyNum}
                  onChange={(e) => setPolicyNum(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded px-3 py-2.5 text-white placeholder-gray-600 outline-none focus:border-[#FF5C00] font-mono text-sm transition-colors"
                  required
                />
              </div>

              {editingDocId === 'licencia' && (
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Categorías de Licencia (Colombia)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['A1', 'A2', 'B1', 'C1'].map((cat) => (
                      <div key={cat} className="bg-black/40 border border-gray-800 py-1.5 text-xs font-mono font-bold text-gray-300 text-center">
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-2 bg-[#FF5C00] hover:bg-orange-600 text-black font-black text-xs py-3.5 uppercase tracking-widest skew-btn transition-all active:scale-95 shadow-lg shadow-orange-950/20"
              >
                <span className="skew-btn-inner text-black">CONFIRMAR RENOVACIÓN</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
