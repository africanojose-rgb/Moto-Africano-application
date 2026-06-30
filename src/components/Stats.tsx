/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, TrendingUp, Activity, Gauge } from 'lucide-react';

export const Stats: React.FC = () => {
  const {
    activeMotorcycle,
    oilHealth,
    brakesHealth,
    plugsHealth,
    avgWeeklyKm,
    nextService,
    mileageEntries
  } = useApp();

  // Sort mileage entries for the chart
  const activeEntries = mileageEntries
    .filter(e => e.motorcycleId === activeMotorcycle?.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Component lifespan projection variables
  const oilLimit = 5000;
  const brakesLimit = 8000;
  const plugsLimit = 12000;

  // Render SVG Line Chart
  const renderOdometerChart = () => {
    if (activeEntries.length < 2) {
      return (
        <div className="h-48 flex items-center justify-center text-center border border-dashed border-white/10 rounded-xl bg-white/5 p-4">
          <p className="font-mono text-xs text-gray-500 uppercase">Se requieren al menos 2 registros semanales de kilometraje para trazar la telemetría.</p>
        </div>
      );
    }

    const minKm = activeEntries[0].km;
    const maxKm = activeEntries[activeEntries.length - 1].km;
    const rangeKm = maxKm - minKm === 0 ? 100 : maxKm - minKm;

    const width = 500;
    const height = 180;
    const padding = 20;

    // Map entries to SVG coordinates
    const points = activeEntries.map((entry, index) => {
      const x = padding + (index * (width - padding * 2)) / (activeEntries.length - 1);
      const y = height - padding - ((entry.km - minKm) * (height - padding * 2)) / rangeKm;
      return { x, y, ...entry };
    });

    const pathData = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    return (
      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

          {/* Area under line */}
          {points.length > 0 && (
            <path
              d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
              fill="url(#chartGradient)"
              opacity="0.15"
            />
          )}

          {/* Core path */}
          <path
            d={pathData}
            fill="none"
            stroke="#ff5f00"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="drop-shadow-[0_0_4px_rgba(255,95,0,0.5)]"
          />

          {/* Glow points */}
          {points.map((p, i) => (
            <g key={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill="rgba(255,95,0,0.3)"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="3"
                fill="#ff5f00"
              />
            </g>
          ))}

          {/* Gradients */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff5f00" />
              <stop offset="100%" stopColor="#ff5f00" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Labels */}
        <div className="flex justify-between items-center font-mono text-[9px] text-gray-500 uppercase mt-2 px-1">
          <span>{activeEntries[0].date} ({minKm.toLocaleString()} km)</span>
          <span className="font-semibold text-white">Progreso: +{(maxKm - minKm).toLocaleString()} km</span>
          <span>{activeEntries[activeEntries.length - 1].date} ({maxKm.toLocaleString()} km)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1 border-b border-gray-800 pb-4">
        <p className="font-mono text-xs text-[#FF5C00] uppercase tracking-widest font-black">Predicción Técnica Avanzada</p>
        <h2 className="text-2xl md:text-3xl text-white font-black italic uppercase tracking-tighter mt-1">Estadísticas & Proyecciones</h2>
      </header>

      {/* Habits & Telemetry Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-gray-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <TrendingUp className="w-6 h-6 text-[#FF5C00]" />
          </div>
          <div>
            <span className="font-mono text-[9px] text-gray-500 uppercase font-bold">PROMEDIO DE CONDUCCIÓN</span>
            <p className="text-xl font-black italic text-white tracking-tight mt-1">{avgWeeklyKm} KM <span className="text-xs text-gray-500 font-mono font-normal">/ SEMANAL</span></p>
          </div>
        </div>

        <div className="bg-[#111111] border border-gray-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-[#00E676]/10 flex items-center justify-center border border-[#00E676]/20">
            <Calendar className="w-6 h-6 text-[#00E676]" />
          </div>
          <div>
            <span className="font-mono text-[9px] text-gray-500 uppercase font-bold">SIGUIENTE MANTENIMIENTO</span>
            <p className="text-xl font-black italic text-white tracking-tight mt-1">~ {nextService.daysRemaining} DÍAS</p>
          </div>
        </div>

        <div className="bg-[#111111] border border-gray-800 p-5 rounded-xl flex items-center gap-4 md:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Activity className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <span className="font-mono text-[9px] text-gray-500 uppercase font-bold">CONSUMO ESTIMADO</span>
            <p className="text-xl font-black italic text-white tracking-tight mt-1">EFICIENTE <span className="text-xs text-[#00E676] font-mono uppercase font-black">100%</span></p>
          </div>
        </div>
      </section>

      {/* Odometer Chart Container */}
      <section className="bg-[#111111] border border-gray-800 p-6 rounded-xl space-y-4">
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <h3 className="font-black italic text-white text-base uppercase tracking-tighter flex items-center gap-2">
            <Gauge className="w-5 h-5 text-[#FF5C00]" />
            Telemetría de Odómetro Semanal
          </h3>
          <span className="font-mono text-[10px] text-gray-500 uppercase">Frecuencia: Semanal</span>
        </div>
        {renderOdometerChart()}
      </section>

      {/* Projections breakdown */}
      <section className="bg-[#111111] border border-gray-800 p-6 rounded-xl space-y-5">
        <h3 className="font-black italic text-white text-base uppercase tracking-tighter flex items-center gap-2 border-b border-gray-800 pb-4">
          <Sparkles className="w-5 h-5 text-[#FF5C00] animate-pulse" />
          Previsión Inteligente de Piezas Consumibles
        </h3>

        <div className="space-y-5">
          {/* Piece 1: Oil */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white font-black uppercase">Aceite de Motor (Viscosidad)</span>
              <span className="text-gray-400 font-bold">Duración estimada: {oilHealth}% restantes</span>
            </div>
            <div className="h-2 w-full bg-gray-900 rounded-none overflow-hidden">
              <div className="h-full bg-[#FFD600]" style={{ width: `${oilHealth}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>Último cambio: Hace {(5000 - (oilHealth / 100) * 5000).toLocaleString()} km</span>
              <span>Límite preventivo: {oilLimit.toLocaleString()} km</span>
            </div>
          </div>

          {/* Piece 2: Brakes */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white font-black uppercase">Pastillas de Freno (Desgaste)</span>
              <span className="text-gray-400 font-bold">Duración estimada: {brakesHealth}% restantes</span>
            </div>
            <div className="h-2 w-full bg-gray-900 rounded-none overflow-hidden">
              <div className="h-full bg-[#FF1744]" style={{ width: `${brakesHealth}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>Último cambio: Hace {(8000 - (brakesHealth / 100) * 8000).toLocaleString()} km</span>
              <span>Límite preventivo: {brakesLimit.toLocaleString()} km</span>
            </div>
          </div>

          {/* Piece 3: Spark Plugs */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white font-black uppercase">Bujías y Sistema de Ignición</span>
              <span className="text-gray-400 font-bold">Duración estimada: {plugsHealth}% restantes</span>
            </div>
            <div className="h-2 w-full bg-gray-900 rounded-none overflow-hidden">
              <div className="h-full bg-[#00E676]" style={{ width: `${plugsHealth}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>Último cambio: Hace {(12000 - (plugsHealth / 100) * 12000).toLocaleString()} km</span>
              <span>Límite preventivo: {plugsLimit.toLocaleString()} km</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
