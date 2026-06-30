/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Motorcycle, MaintenanceLog, LegalDocument, MileageEntry } from '../types';

export const INITIAL_MOTORCYCLES: Motorcycle[] = [
  {
    id: 'r1-perf',
    brand: 'YAMAHA',
    model: 'YZF-R1 PERFORMANCE',
    year: 2022,
    initialKm: 10000,
    currentKm: 12450,
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEJmu0iXgPhfo6zAbEJj9GOzbiwPI2BWGdRWQCcWlzqDZQEojJxzoNr4fktN43KaD2DiQXllrmcsbdXosTM0QtxCie24B9TBtyJVwgbSHo-vnm_SGuIEIxiw6FuNgWKOenwJmlZ8OXii5PsxzNZEcfQxPWIwH-62Ffcq0D3-rhz5e0kptYFygx97WmHiui7xs9KL6syufS-8aZYDp0S7N1g-QsSJMSxXqgvpRyu6qpt0JVDh3Okj-q0WLpozlsjhNrMZt_rGN2Lfes',
    status: 'Race Ready',
    chassisVin: '9HK-22910-MX-003',
    licensePlate: 'AF-772-B'
  },
  {
    id: 'mt09-master',
    brand: 'YAMAHA',
    model: 'MT-09 MASTER OF TORQUE',
    year: 2023,
    initialKm: 12000,
    currentKm: 14200,
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbypDeq-_VDAoN2MLcDeVys6E_B6D5B98C9EP7hZ2PHhHyEegxQdyAE8V5Kk6db9_I2dyEIgF0P9L2SH_JQfprd7BUZZfklcyMpqYoPtzeLYUBXsyP-mV7GUX_0FsW8Tk3_cRv3CE1MlxCe2st0oLZYKmwuwSvDv761H9TSwIHTXbyyWD0aBtsRfyw-Y0mKO1LyIvc5c3sBMi5MsCdCLVugMkiAjHYxyH6b9ritRgyInmrerjPCBDWOVelgrYTRHB7xBU1F2LTpzEU',
    status: 'Optimized',
    chassisVin: '9HK-55104-XM-012',
    licensePlate: 'COP-90C'
  },
  {
    id: 's1000rr-beast',
    brand: 'BMW',
    model: 'S1000RR',
    year: 2021,
    initialKm: 7000,
    currentKm: 8200,
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfUx7SYmeyvEF29blA_VkJN6IT5VUpxJET9SnlyhYNanY-nYyo2USNlgBa84ElX3i_Xxt1G0HG2IUD4dEhiQTAJlScbOSIJyD8b0ACyGYtM6JPa7kCPV6xDLBI9VthgDmCXiqaxSCqhGjNYHewn9w4WVTn9ZJ4LXUcBFETJOjPrLIpJu2yfJKM5EL6xBAU0hzmEN1aKfEMiD65MdTs3U7dD5ahbBeexvr7mjjrfsckNtvmUOPQbk-ogzEgI-WhemQC0Jfkm038Yp_m',
    status: 'Optimized',
    chassisVin: 'WB1-10290-RR-904',
    licensePlate: 'RRE-44A'
  },
  {
    id: 'duke390-urban',
    brand: 'KTM',
    model: 'DUKE 390',
    year: 2022,
    initialKm: 4200,
    currentKm: 5120,
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjA8lDROQOALEEr-ETzKUh1eIwVc4o0Qt2C3kEzZb7y--TMMQwsSQfiNoeVQmmSfVlXP7_fFASPNbPdv7XpCUpHkxjntzsDm4XqGfgZm35mKp6JDjo_OJPC7VShe0QIK0S1IiJJb2sojvkJAxbtClnMnv8HskXdz89WdCCH-bs0pGh1UoRc242gQfemoWAeQZ0o7yqs7e6-vcr9xBTLO9r5XPBb6P9Vt0N5NNeUYkbhGja5WfSXCSXcB8k54YaCawiWisD8OloMyy_',
    status: 'Needs Service',
    chassisVin: 'VTI-39090-DK-881',
    licensePlate: 'XDK-12F'
  }
];

export const INITIAL_MAINTENANCE_LOGS: MaintenanceLog[] = [
  {
    id: 'log1',
    motorcycleId: 'r1-perf',
    date: '12/03/2026',
    title: 'Cambio de Aceite - Motul 7100',
    cost: 180000,
    km: 12450,
    category: 'Motor',
    status: 'Completed'
  },
  {
    id: 'log2',
    motorcycleId: 'r1-perf',
    date: '15/02/2026',
    title: 'Cambio de Pastillas de Freno',
    cost: 95000,
    km: 11820,
    category: 'Frenos',
    status: 'Completed'
  },
  {
    id: 'log3',
    motorcycleId: 'r1-perf',
    date: '20/12/2025',
    title: 'Calibración de Presión y Tensión de Cadena',
    cost: 25000,
    km: 10100,
    category: 'Llantas',
    status: 'Routine'
  },
  {
    id: 'log4',
    motorcycleId: 'r1-perf',
    date: '05/11/2025',
    title: 'Inspección General de los 10K',
    cost: 240000,
    km: 10005,
    category: 'Motor',
    status: 'Archived'
  }
];

export const INITIAL_MILEAGE_ENTRIES: MileageEntry[] = [
  {
    id: 'm1',
    motorcycleId: 'r1-perf',
    date: '2026-06-08',
    km: 12000
  },
  {
    id: 'm2',
    motorcycleId: 'r1-perf',
    date: '2026-06-15',
    km: 12150
  },
  {
    id: 'm3',
    motorcycleId: 'r1-perf',
    date: '2026-06-22',
    km: 12300
  },
  {
    id: 'm4',
    motorcycleId: 'r1-perf',
    date: '2026-06-29',
    km: 12450
  }
];

export const INITIAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'licencia',
    name: 'Licencia de Conducción',
    categoryOrDetails: 'Categoría: A2',
    expirationDate: '15/06/2026', // Already expired as current date is June 29, 2026
    policyNumberOrCDA: 'A2-892019-CO'
  },
  {
    id: 'soat',
    name: 'SOAT',
    categoryOrDetails: 'Póliza: #8829-AF',
    expirationDate: '09/07/2026', // 10 days remaining from June 29, 2026
    policyNumberOrCDA: 'SOAT-AseguradoraMundial'
  },
  {
    id: 'tecnomecanica',
    name: 'Revisión Tecnomecánica',
    categoryOrDetails: 'CDA: MotoTech Bog',
    expirationDate: '13/08/2026', // 45 days remaining from June 29, 2026
    policyNumberOrCDA: 'CDA-MotoTech-Bog'
  }
];
