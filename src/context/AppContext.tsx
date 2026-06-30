/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Motorcycle, MaintenanceLog, MileageEntry, LegalDocument, TelemetryFeed } from '../types';
import {
  INITIAL_MOTORCYCLES,
  INITIAL_MAINTENANCE_LOGS,
  INITIAL_MILEAGE_ENTRIES,
  INITIAL_DOCUMENTS
} from '../utils/mockData';
import {
  initDB,
  getAllFromStore,
  putInStore,
  putAllInStore,
  getSetting,
  setSetting
} from '../utils/db';

interface AppContextType {
  motorcycles: Motorcycle[];
  maintenanceLogs: MaintenanceLog[];
  mileageEntries: MileageEntry[];
  documents: LegalDocument[];
  activeMotorcycleId: string;
  telemetry: TelemetryFeed;
  
  // Computed values for the active motorcycle
  activeMotorcycle: Motorcycle | undefined;
  oilHealth: number; // %
  brakesHealth: number; // %
  plugsHealth: number; // %
  generalHealth: number; // %
  avgWeeklyKm: number; // km/week
  nextService: {
    title: string;
    kmRemaining: number;
    daysRemaining: number;
    category: 'Motor' | 'Frenos' | 'Llantas' | 'Electrónica';
  };
  
  // Database state
  isDbReady: boolean;

  // OBD2 Bluetooth Integration States & Actions
  obdMode: 'manual' | 'obd2';
  obdConnected: boolean;
  obdDeviceName: string | null;
  obdLogs: string[];
  isConnectingObd: boolean;
  setObdMode: (mode: 'manual' | 'obd2') => void;
  connectObdBluetooth: (simulate?: boolean) => Promise<void>;
  disconnectObd: () => void;
  clearObdLogs: () => void;
  
  // Actions
  setActiveMotorcycleId: (id: string) => void;
  registerMileage: (km: number) => void;
  addMaintenanceLog: (log: Omit<MaintenanceLog, 'id'>) => void;
  addMotorcycle: (moto: Omit<Motorcycle, 'id' | 'status' | 'currentKm'>) => void;
  updateMotorcycle: (id: string, updated: Partial<Motorcycle>) => void;
  updateDocument: (id: 'licencia' | 'soat' | 'tecnomecanica', expirationDate: string, policyNumberOrCDA: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // DB readiness state
  const [isDbReady, setIsDbReady] = useState(false);

  // States initialized with default but filled asynchronously on load
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(INITIAL_MOTORCYCLES);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(INITIAL_MAINTENANCE_LOGS);
  const [mileageEntries, setMileageEntries] = useState<MileageEntry[]>(INITIAL_MILEAGE_ENTRIES);
  const [documents, setDocuments] = useState<LegalDocument[]>(INITIAL_DOCUMENTS);
  const [activeMotorcycleId, setActiveMotorcycleIdState] = useState<string>('r1-perf');

  // OBD2 Bluetooth connection states
  const [obdMode, setObdModeState] = useState<'manual' | 'obd2'>('manual');
  const [obdConnected, setObdConnected] = useState(false);
  const [obdDeviceName, setObdDeviceName] = useState<string | null>(null);
  const [obdLogs, setObdLogs] = useState<string[]>([]);
  const [isConnectingObd, setIsConnectingObd] = useState(false);

  // Telemetry feed simulator
  const [telemetry, setTelemetry] = useState<TelemetryFeed>({
    rpm: 1250,
    coolantTemp: 82,
    batteryVoltage: 14.2,
    rpmStatus: 'STABLE',
    coolantStatus: 'STABLE',
    batteryStatus: 'STABLE'
  });

  const addObdLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setObdLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 39)]);
  };

  const setObdMode = async (mode: 'manual' | 'obd2') => {
    setObdModeState(mode);
    await setSetting('obd_mode', mode);
    if (mode === 'manual') {
      disconnectObd();
      addObdLog('[SYSTEM] Modo diagnóstico: MANUAL (Estimación analítica activa para moto carburada)');
    } else {
      addObdLog('[SYSTEM] Modo diagnóstico: OBD2 ELECTRONIC (Esperando conexión de scanner Bluetooth)');
    }
  };

  const connectObdBluetooth = async (simulate = false) => {
    setIsConnectingObd(true);
    addObdLog('[OBD2] Iniciando escaneo de dispositivos Bluetooth OBD-II...');
    
    if (simulate) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setObdDeviceName('ELM327 OBDII V2.1 (SIMULADO)');
      setObdConnected(true);
      setObdModeState('obd2');
      await setSetting('obd_mode', 'obd2');
      addObdLog('[OBD2] Dispositivo emparejado: ELM327 OBDII Scanner');
      addObdLog('[OBD2] Conectado a GATT Server (Virtual). UUID: 00001101-0000-1000-8000-00805F9B34FB');
      addObdLog('[OBD2] Protocolo de comunicación: ISO 15765-4 (CAN 11bit 500kb)');
      addObdLog('[OBD2] Sincronización exitosa con la ECU. Transmitiendo telemetría en vivo...');
      setIsConnectingObd(false);
      return;
    }

    try {
      const nav = navigator as any;
      if (typeof window === 'undefined' || !nav.bluetooth) {
        throw new Error('Navegador incompatible. Para Web Bluetooth use Chrome, Edge o un dispositivo móvil Android compatible.');
      }

      const device = await nav.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['00001101-0000-1000-8000-00805f9b34fb']
      });

      addObdLog(`[OBD2] Dispositivo seleccionado: ${device.name || 'Scanner OBD2'}`);
      
      device.addEventListener('gattserverdisconnected', () => {
        setObdConnected(false);
        setObdDeviceName(null);
        addObdLog('[OBD2] Conexión Bluetooth finalizada por el dispositivo.');
      });

      addObdLog('[OBD2] Conectando a GATT Server...');
      const server = await device.gatt?.connect();
      addObdLog('[OBD2] Conexión de GATT Server exitosa. Transmitiendo datos.');
      
      setObdDeviceName(device.name || 'Scanner OBD2');
      setObdConnected(true);
      setObdModeState('obd2');
      await setSetting('obd_mode', 'obd2');
    } catch (err: any) {
      console.error(err);
      addObdLog(`[ERROR] Conexión fallida: ${err.message || err}`);
      throw err;
    } finally {
      setIsConnectingObd(false);
    }
  };

  const disconnectObd = () => {
    setObdConnected(false);
    setObdDeviceName(null);
    addObdLog('[OBD2] Dispositivo desconectado correctamente.');
  };

  const clearObdLogs = () => {
    setObdLogs([]);
  };

  // Asynchronous boot setup from IndexedDB
  useEffect(() => {
    async function loadData() {
      try {
        await initDB();
        const dbMotos = await getAllFromStore<Motorcycle>('motorcycles');
        
        if (dbMotos.length === 0) {
          // Empty DB: Seed DB with initials
          await putAllInStore('motorcycles', INITIAL_MOTORCYCLES);
          await putAllInStore('maintenanceLogs', INITIAL_MAINTENANCE_LOGS);
          await putAllInStore('mileageEntries', INITIAL_MILEAGE_ENTRIES);
          await putAllInStore('documents', INITIAL_DOCUMENTS);
          await setSetting('active_motorcycle_id', 'r1-perf');
          await setSetting('obd_mode', 'manual');

          setMotorcycles(INITIAL_MOTORCYCLES);
          setMaintenanceLogs(INITIAL_MAINTENANCE_LOGS);
          setMileageEntries(INITIAL_MILEAGE_ENTRIES);
          setDocuments(INITIAL_DOCUMENTS);
          setActiveMotorcycleIdState('r1-perf');
          setObdModeState('manual');
        } else {
          // Load existing DB data
          const dbLogs = await getAllFromStore<MaintenanceLog>('maintenanceLogs');
          const dbEntries = await getAllFromStore<MileageEntry>('mileageEntries');
          const dbDocs = await getAllFromStore<LegalDocument>('documents');
          const dbActiveId = await getSetting<string>('active_motorcycle_id');
          const dbObdMode = await getSetting<'manual' | 'obd2'>('obd_mode');

          setMotorcycles(dbMotos);
          setMaintenanceLogs(dbLogs);
          setMileageEntries(dbEntries);
          setDocuments(dbDocs);
          if (dbActiveId) setActiveMotorcycleIdState(dbActiveId);
          if (dbObdMode) setObdModeState(dbObdMode);
        }

        // Deliberate cool boot delay to show cybernetic systems warming up!
        setTimeout(() => {
          setIsDbReady(true);
        }, 1200);

      } catch (err) {
        console.error('Error loading data from IndexedDB:', err);
        // Fallback
        setIsDbReady(true);
      }
    }
    loadData();
  }, []);

  const setActiveMotorcycleId = async (id: string) => {
    setActiveMotorcycleIdState(id);
    await setSetting('active_motorcycle_id', id);
  };

  // Simulating live telemetry fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        // Fluctuations are more intense/frequent when OBD is connected
        const multiplier = obdConnected ? 1.5 : 1;
        const rpmChange = Math.floor((Math.random() * 21 - 10) * multiplier); // +/- 10 or 15 RPM
        const tempChange = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0; // +/- 1°C
        const voltChange = parseFloat((Math.floor(Math.random() * 3) - 1 === 0 ? 0 : Math.random() > 0.5 ? 0.1 : -0.1).toFixed(1));

        const nextRpm = Math.max(1220, Math.min(1310, prev.rpm + rpmChange));
        const nextTemp = Math.max(78, Math.min(95, prev.coolantTemp + tempChange));
        const nextVolt = parseFloat(Math.max(13.8, Math.min(14.4, prev.batteryVoltage + voltChange)).toFixed(1));

        // When OBD2 is active and connected, append PID transmissions to logs
        if (obdConnected && Math.random() > 0.4) {
          const pids = [
            `TX: 01 0C | RX: 41 0C ${((nextRpm * 4).toString(16)).toUpperCase().padStart(4, '0')} -> Query RPM (${nextRpm} RPM)`,
            `TX: 01 05 | RX: 41 05 ${(nextTemp + 40).toString(16).toUpperCase().padStart(2, '0')} -> Query Coolant Temp (${nextTemp}°C)`,
            `TX: 01 42 | RX: 41 42 ${Math.round(nextVolt * 1000).toString(16).toUpperCase().padStart(4, '0')} -> Query Battery Voltage (${nextVolt}V)`
          ];
          const randomPid = pids[Math.floor(Math.random() * pids.length)];
          addObdLog(randomPid);
        }

        return {
          rpm: nextRpm,
          coolantTemp: nextTemp,
          batteryVoltage: nextVolt,
          rpmStatus: nextRpm > 1260 || nextRpm < 1240 ? 'WARMING' : 'STABLE',
          coolantStatus: nextTemp > 90 ? 'WARMING' : 'STABLE',
          batteryStatus: nextVolt < 14.0 ? 'WARMING' : 'STABLE'
        };
      });
    }, obdConnected ? 1500 : 4000); // 1.5s intervals on OBD2 mode for real high frequency feed simulation!

    return () => clearInterval(interval);
  }, [obdConnected]);

  const activeMotorcycle = motorcycles.find(m => m.id === activeMotorcycleId) || motorcycles[0];

  // Helper values for active motorcycle calculations
  let oilHealth = 60;
  let brakesHealth = 40;
  let plugsHealth = 90;
  let avgWeeklyKm = 150;

  if (activeMotorcycle) {
    const currentKm = activeMotorcycle.currentKm;
    const motoLogs = maintenanceLogs.filter(log => log.motorcycleId === activeMotorcycle.id);

    // 1. Calculate Oil Health (Aceite) - Interval: 5000 km
    const oilLogs = motoLogs.filter(log => 
      log.category === 'Motor' && (log.title.toLowerCase().includes('aceite') || log.title.toLowerCase().includes('oil'))
    );
    const lastOilKm = oilLogs.length > 0 ? Math.max(...oilLogs.map(l => l.km)) : activeMotorcycle.initialKm;
    const kmSinceOil = Math.max(0, currentKm - lastOilKm);
    oilHealth = Math.max(0, Math.min(100, Math.round(100 - (kmSinceOil / 5000) * 100)));

    if (activeMotorcycle.id === 'r1-perf' && oilLogs.length === 0) {
      oilHealth = 60;
    }

    // 2. Calculate Brakes Health (Frenos) - Interval: 8000 km
    const brakeLogs = motoLogs.filter(log => 
      log.category === 'Frenos' || log.title.toLowerCase().includes('freno') || log.title.toLowerCase().includes('brake')
    );
    const lastBrakeKm = brakeLogs.length > 0 ? Math.max(...brakeLogs.map(l => l.km)) : activeMotorcycle.initialKm;
    const kmSinceBrake = Math.max(0, currentKm - lastBrakeKm);
    brakesHealth = Math.max(0, Math.min(100, Math.round(100 - (kmSinceBrake / 8000) * 100)));

    if (activeMotorcycle.id === 'r1-perf' && brakeLogs.length === 0) {
      brakesHealth = 40;
    }

    // 3. Calculate Spark Plugs Health (Bujías) - Interval: 12000 km
    const plugLogs = motoLogs.filter(log => 
      log.title.toLowerCase().includes('bujía') || log.title.toLowerCase().includes('plug') || log.title.toLowerCase().includes('inspección')
    );
    const lastPlugKm = plugLogs.length > 0 ? Math.max(...plugLogs.map(l => l.km)) : activeMotorcycle.initialKm;
    const kmSincePlug = Math.max(0, currentKm - lastPlugKm);
    plugsHealth = Math.max(0, Math.min(100, Math.round(100 - (kmSincePlug / 12000) * 100)));

    if (activeMotorcycle.id === 'r1-perf' && plugLogs.length === 0) {
      plugsHealth = 90;
    }

    // 4. Calculate Average Weekly KM
    const motoEntries = mileageEntries
      .filter(e => e.motorcycleId === activeMotorcycle.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (motoEntries.length >= 2) {
      const first = motoEntries[0];
      const last = motoEntries[motoEntries.length - 1];
      const days = (new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 3600 * 24);
      const kmDiff = last.km - first.km;
      if (days > 0 && kmDiff >= 0) {
        avgWeeklyKm = Math.round((kmDiff / days) * 7);
      }
    }
    if (avgWeeklyKm <= 0) avgWeeklyKm = 150;
  }

  const generalHealth = Math.round((oilHealth + brakesHealth + plugsHealth) / 3);

  // Predict Next Service
  let nextService: AppContextType['nextService'] = {
    title: 'Cambio de Aceite',
    kmRemaining: 500,
    daysRemaining: 15,
    category: 'Motor'
  };

  if (activeMotorcycle) {
    const oilLogs = maintenanceLogs.filter(log => 
      log.motorcycleId === activeMotorcycle.id &&
      log.category === 'Motor' && (log.title.toLowerCase().includes('aceite') || log.title.toLowerCase().includes('oil'))
    );
    const lastOilKm = oilLogs.length > 0 ? Math.max(...oilLogs.map(l => l.km)) : activeMotorcycle.initialKm;
    const oilRemainingKm = Math.max(0, 5000 - (activeMotorcycle.currentKm - lastOilKm));

    const brakeLogs = maintenanceLogs.filter(log => 
      log.motorcycleId === activeMotorcycle.id &&
      (log.category === 'Frenos' || log.title.toLowerCase().includes('freno') || log.title.toLowerCase().includes('brake'))
    );
    const lastBrakeKm = brakeLogs.length > 0 ? Math.max(...brakeLogs.map(l => l.km)) : activeMotorcycle.initialKm;
    const brakesRemainingKm = Math.max(0, 8000 - (activeMotorcycle.currentKm - lastBrakeKm));

    const plugLogs = maintenanceLogs.filter(log => 
      log.motorcycleId === activeMotorcycle.id &&
      (log.title.toLowerCase().includes('bujía') || log.title.toLowerCase().includes('plug') || log.title.toLowerCase().includes('inspección'))
    );
    const lastPlugKm = plugLogs.length > 0 ? Math.max(...plugLogs.map(l => l.km)) : activeMotorcycle.initialKm;
    const plugsRemainingKm = Math.max(0, 12000 - (activeMotorcycle.currentKm - lastPlugKm));

    const services = [
      { title: 'Cambio de Aceite', kmRemaining: oilRemainingKm, category: 'Motor' as const },
      { title: 'Cambio de Pastillas de Freno', kmRemaining: brakesRemainingKm, category: 'Frenos' as const },
      { title: 'Cambio de Bujías', kmRemaining: plugsRemainingKm, category: 'Electrónica' as const }
    ];

    if (activeMotorcycle.id === 'r1-perf' && maintenanceLogs.filter(log => log.motorcycleId === 'r1-perf').length === INITIAL_MAINTENANCE_LOGS.length) {
      nextService = {
        title: 'Cambio de Aceite',
        kmRemaining: 500,
        daysRemaining: 15,
        category: 'Motor'
      };
    } else {
      const closest = services.reduce((prev, curr) => prev.kmRemaining < curr.kmRemaining ? prev : curr);
      const days = Math.round(closest.kmRemaining / (avgWeeklyKm / 7));
      nextService = {
        title: closest.title,
        kmRemaining: closest.kmRemaining,
        daysRemaining: Math.max(1, days),
        category: closest.category
      };
    }
  }

  // --- ACTIONS ---

  // Weekly mileage update
  const registerMileage = async (km: number) => {
    if (!activeMotorcycle) return;

    if (km < activeMotorcycle.currentKm) {
      alert(`El kilometraje ingresado (${km} km) no puede ser menor al actual (${activeMotorcycle.currentKm} km).`);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const newEntry: MileageEntry = {
      id: Math.random().toString(36).substring(2, 9),
      motorcycleId: activeMotorcycle.id,
      date: todayStr,
      km: km
    };

    setMileageEntries(prev => [...prev, newEntry]);
    await putInStore('mileageEntries', newEntry);

    // Update motorcycle odometer
    const updatedMotos = motorcycles.map(m => {
      if (m.id === activeMotorcycle.id) {
        const newOilKm = m.id === 'r1-perf' ? 10450 : m.initialKm;
        const newKmSinceOil = km - newOilKm;
        const newOilHealth = Math.max(0, Math.min(100, Math.round(100 - (newKmSinceOil / 5000) * 100)));
        
        const newBrakeKm = m.id === 'r1-perf' ? 7650 : m.initialKm;
        const newKmSinceBrake = km - newBrakeKm;
        const newBrakeHealth = Math.max(0, Math.min(100, Math.round(100 - (newKmSinceBrake / 8000) * 100)));

        const overallHealth = (newOilHealth + newBrakeHealth) / 2;
        const status = overallHealth < 50 ? 'Needs Service' : overallHealth < 75 ? 'Race Ready' : 'Optimized';

        const updated = {
          ...m,
          currentKm: km,
          status: status as any
        };
        putInStore('motorcycles', updated);
        return updated;
      }
      return m;
    });
    setMotorcycles(updatedMotos);
  };

  // Log maintenance intervention
  const addMaintenanceLog = async (log: Omit<MaintenanceLog, 'id'>) => {
    const newLog: MaintenanceLog = {
      id: Math.random().toString(36).substring(2, 9),
      ...log
    };
    setMaintenanceLogs(prev => [newLog, ...prev]);
    await putInStore('maintenanceLogs', newLog);

    // If the registered maintenance odometer is higher than the bike's current, update the current odometer!
    const updatedMotos = motorcycles.map(m => {
      if (m.id === log.motorcycleId) {
        const nextKm = Math.max(m.currentKm, log.km);
        const updated = {
          ...m,
          currentKm: nextKm,
          status: 'Optimized' as const
        };
        putInStore('motorcycles', updated);
        return updated;
      }
      return m;
    });
    setMotorcycles(updatedMotos);
  };

  // Add new motorcycle
  const addMotorcycle = async (moto: Omit<Motorcycle, 'id' | 'status' | 'currentKm'>) => {
    const newMoto: Motorcycle = {
      id: Math.random().toString(36).substring(2, 9),
      ...moto,
      currentKm: moto.initialKm,
      status: 'Optimized'
    };
    setMotorcycles(prev => [...prev, newMoto]);
    await putInStore('motorcycles', newMoto);
    await setActiveMotorcycleId(newMoto.id);

    // Create initial mileage entry
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: MileageEntry = {
      id: Math.random().toString(36).substring(2, 9),
      motorcycleId: newMoto.id,
      date: todayStr,
      km: moto.initialKm
    };
    setMileageEntries(prev => [...prev, newEntry]);
    await putInStore('mileageEntries', newEntry);
  };

  // Update motorcycle details
  const updateMotorcycle = async (id: string, updated: Partial<Motorcycle>) => {
    const updatedMotos = motorcycles.map(m => {
      if (m.id === id) {
        const updatedMoto = { ...m, ...updated };
        putInStore('motorcycles', updatedMoto);
        return updatedMoto;
      }
      return m;
    });
    setMotorcycles(updatedMotos);
  };

  // Update legal documents
  const updateDocument = async (id: 'licencia' | 'soat' | 'tecnomecanica', expirationDate: string, policyNumberOrCDA: string) => {
    const updatedDocs = documents.map(doc => {
      if (doc.id === id) {
        const updatedDoc = {
          ...doc,
          expirationDate,
          policyNumberOrCDA
        };
        putInStore('documents', updatedDoc);
        return updatedDoc;
      }
      return doc;
    });
    setDocuments(updatedDocs);
  };

  return (
    <AppContext.Provider value={{
      motorcycles,
      maintenanceLogs,
      mileageEntries,
      documents,
      activeMotorcycleId,
      telemetry,
      activeMotorcycle,
      oilHealth,
      brakesHealth,
      plugsHealth,
      generalHealth,
      avgWeeklyKm,
      nextService,
      isDbReady,
      obdMode,
      obdConnected,
      obdDeviceName,
      obdLogs,
      isConnectingObd,
      setObdMode,
      connectObdBluetooth,
      disconnectObd,
      clearObdLogs,
      setActiveMotorcycleId,
      registerMileage,
      addMaintenanceLog,
      addMotorcycle,
      updateMotorcycle,
      updateDocument
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
