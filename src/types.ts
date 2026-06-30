/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  initialKm: number;
  currentKm: number;
  photoUrl: string;
  status: 'Race Ready' | 'Needs Service' | 'Optimized';
  chassisVin: string;
  licensePlate: string;
}

export type MaintenanceCategory = 'Motor' | 'Frenos' | 'Llantas' | 'Transmisión' | 'Electrónica' | 'Otros';

export interface MaintenanceLog {
  id: string;
  motorcycleId: string;
  date: string; // DD/MM/AAAA
  title: string;
  cost: number; // COP
  km: number;
  category: MaintenanceCategory;
  status: 'Completed' | 'Routine' | 'Archived';
}

export interface MileageEntry {
  id: string;
  motorcycleId: string;
  date: string; // YYYY-MM-DD
  km: number;
}

export interface LegalDocument {
  id: 'licencia' | 'soat' | 'tecnomecanica';
  name: string;
  categoryOrDetails: string;
  expirationDate: string; // DD/MM/AAAA
  policyNumberOrCDA: string;
}

export interface TelemetryFeed {
  rpm: number;
  coolantTemp: number;
  batteryVoltage: number;
  rpmStatus: 'STABLE' | 'OPTIMAL' | 'WARMING';
  coolantStatus: 'STABLE' | 'OPTIMAL' | 'WARMING';
  batteryStatus: 'STABLE' | 'OPTIMAL' | 'WARMING';
}
