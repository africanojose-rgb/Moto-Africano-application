/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Settings, HelpCircle, Flame, Plus, CheckCircle2, ChevronRight, MessageCircle, Terminal, Activity } from 'lucide-react';

interface DashboardProps {
  onRegisterMileageClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onRegisterMileageClick }) => {
  const {
    activeMotorcycle,
    oilHealth,
    brakesHealth,
    plugsHealth,
    generalHealth,
    telemetry,
    nextService,
    obdMode,
    obdConnected,
    obdDeviceName,
    obdLogs,
    isConnectingObd,
    setObdMode,
    connectObdBluetooth,
    disconnectObd,
    clearObdLogs
  } = useApp();

  const getHealthColor = (h: number) => {
    if (h > 70) return '#00E676'; // status-safe
    if (h > 30) return '#FFD600'; // status-warning
    return '#FF1744'; // status-urgent
  };

  const getHealthLabel = (h: number) => {
    if (h > 70) return 'Excelente';
    if (h > 30) return 'Estable';
    return 'Requiere Atención';
  };

  const formattedCost = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const whatsappMessage = `Hola, me gustaría agendar un servicio de mantenimiento preventivo para mi moto ${activeMotorcycle?.brand} ${activeMotorcycle?.model}. Próximo servicio requerido: ${nextService.title}.`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=573101234567&text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="space-y-6">
      {/* Active Motorcycle Hero */}
      {activeMotorcycle && (
        <section className="relative rounded-xl overflow-hidden aspect-[16/9] md:aspect-[21/9] border border-gray-800 group">
          <img 
            className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-700" 
            src={activeMotorcycle.photoUrl} 
            alt={activeMotorcycle.model}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl text-white font-black italic tracking-tighter uppercase leading-none">
                {activeMotorcycle.brand} <span className="text-[#FF5C00]">{activeMotorcycle.model}</span>
              </h2>
              <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mt-1.5">
                <Flame className="w-3.5 h-3.5 text-[#FF5C00]" /> ESTRUCTURA DE COMPOSICIÓN: {activeMotorcycle.status}
              </p>
            </div>
            <button 
              onClick={onRegisterMileageClick}
              className="bg-[#FF5C00] text-black font-black text-xs px-6 py-3 uppercase tracking-wider skew-btn hover:bg-orange-400 transition-colors active:scale-95 cursor-pointer"
            >
              <span className="skew-btn-inner text-black">REGISTRAR KILOMETRAJE</span>
            </button>
          </div>
        </section>
      )}

      {/* Stats & Health Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Health Dial Ring */}
        <div className="lg:col-span-1 bg-[#111] border border-gray-800 p-6 rounded-xl flex flex-col items-center justify-center text-center">
          <h3 className="font-mono text-[10px] uppercase text-gray-500 tracking-widest font-black mb-6">SALUD GENERAL</h3>
          <div className="relative w-44 h-44">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="42" stroke="rgba(255,255,255,0.03)" strokeWidth="6"></circle>
              <circle 
                cx="50" 
                cy="50" 
                fill="none" 
                r="42" 
                stroke={getHealthColor(generalHealth)} 
                strokeDasharray="263.8" 
                strokeDashoffset={263.8 - (263.8 * generalHealth) / 100} 
                strokeWidth="6" 
                strokeLinecap="round"
                className="gauge-ring transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 6px ${getHealthColor(generalHealth)})` }}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black italic text-orange-500 leading-none">{generalHealth}%</span>
              <span 
                className="font-mono text-[9px] uppercase tracking-widest font-black mt-2" 
                style={{ color: getHealthColor(generalHealth) }}
              >
                {generalHealth > 80 ? 'ÓPTIMO' : generalHealth > 50 ? 'ESTABLE' : 'CRÍTICO'}
              </span>
            </div>
          </div>
          
          <div className="mt-6 flex gap-4 w-full justify-center">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-gray-500 uppercase font-mono font-bold">ÚLTIMO ESCANEO</span>
              <span className="font-mono text-xs text-white font-semibold mt-0.5 uppercase">
                {obdConnected ? 'VIVO' : 'HACE 2 HORAS'}
              </span>
            </div>
            <div className="w-px h-8 bg-gray-800"></div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-gray-500 uppercase font-mono font-bold">ERRORES CRÍTICOS</span>
              <span className={`font-mono text-xs font-semibold mt-0.5 ${generalHealth < 50 ? 'text-[#FF1744]' : 'text-[#00E676]'}`}>
                {generalHealth < 50 ? '1' : '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry Components Detail */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Oil Card */}
          <div className="bg-[#111] border-l-4 border-[#FFD600] border-y border-r border-gray-800 p-5 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 font-mono font-black text-[10px] uppercase tracking-wider">ACEITE MOTOR</span>
                <span className="px-2 py-0.5 bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/20 rounded text-[9px] font-mono font-bold">PROX: 5K KM</span>
              </div>
              <div className="mb-3">
                <div className="text-xs font-black uppercase text-gray-400">Vida Útil Restante</div>
                <div className="text-3xl font-black italic tracking-tighter text-white mt-1">{oilHealth}%</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#FFD600] rounded-full transition-all duration-1000" style={{ width: `${oilHealth}%` }}></div>
              </div>
              <span className="text-[10px] text-gray-500 font-mono block">LIMITE: 5,000 km</span>
            </div>
          </div>

          {/* Brakes Card */}
          <div className="bg-[#111] border-l-4 border-[#FF1744] border-y border-r border-gray-800 p-5 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 font-mono font-black text-[10px] uppercase tracking-wider">PASTILLAS FRENO</span>
                <span className="px-2 py-0.5 bg-[#FF1744]/10 text-[#FF1744] border border-[#FF1744]/20 rounded text-[9px] font-mono font-bold">PASTILLAS BAJAS</span>
              </div>
              <div className="mb-3">
                <div className="text-xs font-black uppercase text-gray-400">Vida Útil Restante</div>
                <div className="text-3xl font-black italic tracking-tighter text-white mt-1">{brakesHealth}%</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF1744] rounded-full transition-all duration-1000" style={{ width: `${brakesHealth}%` }}></div>
              </div>
              <span className="text-[10px] text-gray-500 font-mono block">LIMITE: 8,000 km</span>
            </div>
          </div>

          {/* Spark Plugs Card */}
          <div className="bg-[#111] border-l-4 border-[#00E676] border-y border-r border-gray-800 p-5 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 font-mono font-black text-[10px] uppercase tracking-wider">BUJÍAS Y SISTEMA</span>
                <span className="px-2 py-0.5 bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20 rounded text-[9px] font-mono font-bold">ESTABLE</span>
              </div>
              <div className="mb-3">
                <div className="text-xs font-black uppercase text-gray-400">Vida Útil Restante</div>
                <div className="text-3xl font-black italic tracking-tighter text-white mt-1">{plugsHealth}%</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#00E676] rounded-full transition-all duration-1000" style={{ width: `${plugsHealth}%` }}></div>
              </div>
              <span className="text-[10px] text-gray-500 font-mono block">LIMITE: 12,000 km</span>
            </div>
          </div>

          {/* Maintenance Alert Callback */}
          <div className="sm:col-span-3 bg-[#111] border border-gray-800 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4 items-center w-full md:w-auto">
              <div className="w-14 h-14 bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                <Flame className="w-7 h-7 text-[#FF5C00]" />
              </div>
              <div>
                <h4 className="text-base font-black italic uppercase tracking-tight text-white">Siguiente Servicio: {nextService.title}</h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Requerido en <span className="text-[#FF5C00] font-bold">{nextService.kmRemaining} km</span> o aproximadamente <span className="text-white font-semibold">{nextService.daysRemaining} días</span>.
                </p>
              </div>
            </div>
            <a 
              href={whatsappUrl}
              target="_blank" 
              rel="noreferrer"
              className="w-full md:w-auto bg-[#25D366] hover:bg-[#20ba56] text-white px-6 py-3 uppercase font-black text-xs skew-btn flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span className="skew-btn-inner flex items-center gap-2">
                <MessageCircle className="w-4 h-4 fill-white text-white" />
                Agendar vía WhatsApp →
              </span>
            </a>
          </div>

        </div>
      </section>

      {/* Live Telemetry Feed */}
      <section className="space-y-3">
        <h3 className="font-mono text-xs uppercase text-[#FF5C00] tracking-widest font-bold flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444] shadow-[0_0_8px_#ef4444]"></span>
          </span>
          Telemetría y Diagnóstico en Vivo
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parameter list */}
          <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden flex flex-col justify-between">
            <div className="p-3 border-b border-gray-800 flex justify-between bg-black/20 text-gray-500 text-[10px] uppercase font-mono font-black">
              <span>Parámetro</span>
              <span>Lectura Actual</span>
              <span className="text-right">Estado</span>
            </div>
            <div className="divide-y divide-gray-800 font-mono text-xs flex-1">
              <div className="p-3.5 flex justify-between items-center hover:bg-white/5 transition-all">
                <span className="text-gray-300 font-bold">RPM (Ralentí)</span>
                <span className="text-white font-semibold">{telemetry.rpm.toLocaleString()} RPM</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded ${
                  telemetry.rpmStatus === 'STABLE' 
                    ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20' 
                    : 'bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/20'
                }`}>
                  {telemetry.rpmStatus === 'STABLE' ? 'ESTABLE' : 'CALENTANDO'}
                </span>
              </div>
              
              <div className="p-3.5 flex justify-between items-center hover:bg-white/5 transition-all">
                <span className="text-gray-300 font-bold">Temperatura Motor</span>
                <span className="text-white font-semibold">{telemetry.coolantTemp}°C</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded ${
                  telemetry.coolantTemp < 90 
                    ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20' 
                    : 'bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/20'
                }`}>
                  {telemetry.coolantTemp < 90 ? 'ESTABLE' : 'ALTA'}
                </span>
              </div>
              
              <div className="p-3.5 flex justify-between items-center hover:bg-white/5 transition-all">
                <span className="text-gray-300 font-bold">Voltaje Batería</span>
                <span className="text-white font-semibold">{telemetry.batteryVoltage}V</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded ${
                  telemetry.batteryVoltage >= 14.0 
                    ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20' 
                    : 'bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/20'
                }`}>
                  {telemetry.batteryVoltage >= 14.0 ? 'ÓPTIMO' : 'BAJO'}
                </span>
              </div>
              
              <div className="p-3.5 flex justify-between items-center hover:bg-white/5 transition-all">
                <span className="text-gray-300 font-bold">Modo de Diagnóstico</span>
                <span className="text-white font-semibold uppercase">{obdMode === 'obd2' ? 'OBD-II Activo' : 'Carburada / Manual'}</span>
                <span className="text-gray-400 font-semibold uppercase text-[10px]">
                  {obdMode === 'obd2' ? 'Inyección' : 'Analítico'}
                </span>
              </div>
            </div>
            
            <div className="p-3 bg-black/40 border-t border-gray-800 text-[10px] text-gray-500 font-mono">
              {obdConnected 
                ? `Conectado a ${obdDeviceName} en tiempo real. Frecuencia de muestreo: 1.5s` 
                : 'Lectura en base a promedios analíticos históricos de conducción.'}
            </div>
          </div>

          {/* Diagnostics Panel & OBD2 setup */}
          <div className="bg-[#111] border border-gray-800 rounded-xl p-5 flex flex-col gap-4 font-mono justify-between">
            <div className="space-y-4">
              {/* Selector / tabs for Mode */}
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="text-white text-xs font-bold uppercase tracking-wide">Tipo de Motor</span>
                <div className="flex bg-black p-0.5 rounded border border-gray-800">
                  <button
                    onClick={() => setObdMode('manual')}
                    className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all cursor-pointer ${
                      obdMode === 'manual' 
                        ? 'bg-[#FF5C00] text-black' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Carburada
                  </button>
                  <button
                    onClick={() => setObdMode('obd2')}
                    className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all cursor-pointer ${
                      obdMode === 'obd2' 
                        ? 'bg-[#FF5C00] text-black' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    OBD-II (Iny)
                  </button>
                </div>
              </div>

              {obdMode === 'manual' ? (
                <div className="space-y-3 py-2">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Las motocicletas <span className="text-white font-bold">Carburadas</span> no poseen computadoras de inyección electrónica (ECU) compatibles con escáneres OBD2.
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Moto-Africano utiliza el algoritmo de <span className="text-[#FF5C00] font-bold">estimación analítica avanzada</span>, calculando el desgaste con base en las actualizaciones manuales de kilometraje, hábitos de conducción y promedios históricos de Colombia de manera 100% offline.
                  </p>
                  <div className="p-3 bg-orange-500/5 rounded border border-orange-500/10 text-[11px] text-orange-400 leading-normal flex gap-2">
                    <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>La seguridad y los cálculos de desgaste de aceite, bujías y pastillas están garantizados analíticamente.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Bluetooth OBD2 dashboard */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center p-3 bg-black/40 border border-gray-800 rounded">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${obdConnected ? 'bg-[#00E676] animate-pulse shadow-[0_0_8px_#00E676]' : 'bg-gray-700'}`}></span>
                        <h4 className="text-xs text-white font-bold uppercase">Escáner Bluetooth ELM327</h4>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {obdConnected ? `Conectado: ${obdDeviceName}` : 'Desconectado de la ECU de la moto'}
                      </p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto shrink-0">
                      {obdConnected ? (
                        <button
                          onClick={disconnectObd}
                          className="w-full sm:w-auto px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 text-[10px] font-black uppercase rounded cursor-pointer transition-colors"
                        >
                          Desconectar
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => connectObdBluetooth(false)}
                            disabled={isConnectingObd}
                            className="flex-1 sm:flex-initial px-3 py-1.5 bg-[#FF5C00] hover:bg-orange-400 text-black text-[10px] font-black uppercase rounded cursor-pointer transition-colors disabled:opacity-50"
                          >
                            {isConnectingObd ? 'Escaneando...' : 'Conectar BT'}
                          </button>
                          <button
                            onClick={() => connectObdBluetooth(true)}
                            disabled={isConnectingObd}
                            className="flex-1 sm:flex-initial px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-[10px] font-black uppercase rounded border border-gray-700 cursor-pointer transition-colors"
                          >
                            Simular
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Scrolling log console */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase font-black">
                      <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-[#FF5C00]" /> Consola de Comandos OBD-II</span>
                      {obdLogs.length > 0 && (
                        <button 
                          onClick={clearObdLogs} 
                          className="hover:text-white transition-colors cursor-pointer"
                        >
                          Limpiar
                        </button>
                      )}
                    </div>
                    
                    <div className="h-28 bg-black border border-gray-800 rounded p-2 overflow-y-auto font-mono text-[9px] text-[#00E676] leading-relaxed flex flex-col-reverse">
                      {obdLogs.length === 0 ? (
                        <span className="text-gray-600 italic">No hay transmisiones registradas en el puerto Bluetooth...</span>
                      ) : (
                        obdLogs.map((log, i) => (
                          <div key={i} className={log.includes('[ERROR]') ? 'text-red-500' : log.includes('[SYSTEM]') ? 'text-blue-400' : 'text-[#00E676]'}>
                            {log}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-800 my-1"></div>

            <div className="text-[10px] text-gray-500 leading-normal flex gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#FF5C00] shrink-0 mt-0.5" />
              <span>
                {obdMode === 'obd2' 
                  ? 'Compatible con scanners Bluetooth OBD2 estandarizados (ELM327 protocol K-Line/CAN).' 
                  : 'Filtro analítico activado. No se requiere Bluetooth ni escáner de hardware.'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
