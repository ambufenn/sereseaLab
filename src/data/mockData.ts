import { Shipment, PurchaseOrder, SeafoodSupplier, DemandForecastItem, ShipmentDocument, CatchBatch, SellerOrder } from '../types';

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-SG01',
    containerId: 'SMDU-891024-1',
    species: 'Live Cantang Grouper & Mud Crabs (Kerapu Cantang & Kepiting Bakau)',
    quantityKg: 6800,
    origin: 'Batam (Pelabuhan Batu Ampar), Indonesia',
    destination: 'Singapore (Jurong Fishery Port Pier 2)',
    carrier: 'Samudera Seafresh Fast-Barge',
    status: 'in_transit',
    currentTemp: 3.2,
    targetTemp: 3.0,
    riskLevel: 'normal',
    qimFreshnessScore: 1, // 0 = caught today, 1 = super fresh live
    shelfLifeRemainingDays: 7,
    eta: 'Today, 18:30 SGT (2h 15m remaining)',
    departureDate: '2026-10-15',
    buyerName: 'Jurong Fishery Wholesale Hub, Singapore',
    supplierName: 'PT Kepri Cold Fishery (Batam)',
    cargoValueUSD: 84000,
    telemetryHistory: [
      { time: '14:00', temperature: 2.8, humidity: 95, targetTemp: 3.0, doorOpen: false },
      { time: '15:00', temperature: 3.0, humidity: 94, targetTemp: 3.0, doorOpen: false },
      { time: '16:00', temperature: 3.1, humidity: 95, targetTemp: 3.0, doorOpen: false },
      { time: '17:00', temperature: 3.2, humidity: 96, targetTemp: 3.0, doorOpen: false },
      { time: '18:00', temperature: 3.2, humidity: 95, targetTemp: 3.0, doorOpen: false },
      { time: '19:00', temperature: 3.2, humidity: 95, targetTemp: 3.0, doorOpen: false },
    ],
    alerts: []
  },
  {
    id: 'SHP-SG02',
    containerId: 'NSTR-452109-8',
    species: 'Yellowfin Tuna Sashimi AAA (Thunnus albacares - Muara Baru)',
    quantityKg: 12500,
    origin: 'Jakarta (Pelabuhan Tanjung Priok), Indonesia',
    destination: 'Singapore (Pasir Panjang Reefer Terminal 4)',
    carrier: 'KM Nusantara Reefer 18 (Selat Karimata Route)',
    status: 'in_transit',
    currentTemp: -16.2,
    targetTemp: -20.0,
    riskLevel: 'critical',
    qimFreshnessScore: 8,
    shelfLifeRemainingDays: 4,
    eta: 'Tomorrow, 06:00 SGT (Approaching Selat Riau)',
    departureDate: '2026-10-14',
    buyerName: 'Oceanic Seafoods Singapore Pte Ltd',
    supplierName: 'PT Samudera Bahari Nusantara (Jakarta)',
    cargoValueUSD: 245000,
    telemetryHistory: [
      { time: '14:00', temperature: -20.0, humidity: 76, targetTemp: -20.0, doorOpen: false },
      { time: '15:00', temperature: -19.2, humidity: 78, targetTemp: -20.0, doorOpen: false },
      { time: '16:00', temperature: -18.1, humidity: 81, targetTemp: -20.0, doorOpen: false },
      { time: '17:00', temperature: -17.4, humidity: 83, targetTemp: -20.0, doorOpen: true },
      { time: '18:00', temperature: -16.7, humidity: 82, targetTemp: -20.0, doorOpen: false },
      { time: '19:00', temperature: -16.2, humidity: 84, targetTemp: -20.0, doorOpen: false },
    ],
    alerts: [
      {
        id: 'ALT-ID-SG-01',
        type: 'temperature_spike',
        severity: 'high',
        message: 'Reefer compressor unit #2 duty cycle overload: temperature rose to -16.2°C in Selat Karimata (threshold sashimi: -18°C).',
        timestamp: '38 mins ago',
        recommendedAction: 'Engage remote auxiliary chiller loop B immediately or request priority cryogenic docking berth at Pasir Panjang Terminal.',
        resolved: false
      }
    ]
  },
  {
    id: 'SHP-SG03',
    containerId: 'MLKA-678912-3',
    species: 'Black Tiger Prawns & Red Snapper (Udang Windu & Kakap Merah)',
    quantityKg: 18400,
    origin: 'Medan (Pelabuhan Belawan, Sumatra), Indonesia',
    destination: 'Singapore (Jurong Cold Logistics Hub Gate 3)',
    carrier: 'KM Selat Malaka Express',
    status: 'customs_hold',
    currentTemp: -21.4,
    targetTemp: -22.0,
    riskLevel: 'moderate',
    qimFreshnessScore: 4,
    shelfLifeRemainingDays: 180,
    eta: 'Delay +4h (SFA / BKIPM Quarantine QR Sync)',
    departureDate: '2026-10-14',
    buyerName: 'Sentosa Gourmet Dining Group Singapore',
    supplierName: 'PT Sumatra Aqua Pratama (Medan)',
    cargoValueUSD: 198000,
    telemetryHistory: [
      { time: '14:00', temperature: -21.8, humidity: 72, targetTemp: -22.0, doorOpen: false },
      { time: '15:00', temperature: -21.6, humidity: 73, targetTemp: -22.0, doorOpen: false },
      { time: '16:00', temperature: -21.5, humidity: 72, targetTemp: -22.0, doorOpen: false },
      { time: '17:00', temperature: -21.4, humidity: 74, targetTemp: -22.0, doorOpen: false },
      { time: '18:00', temperature: -21.4, humidity: 74, targetTemp: -22.0, doorOpen: false },
      { time: '19:00', temperature: -21.4, humidity: 73, targetTemp: -22.0, doorOpen: false },
    ],
    alerts: [
      {
        id: 'ALT-ID-SG-02',
        type: 'customs_delay',
        severity: 'medium',
        message: 'BKIPM electronic health certificate awaiting hash verification at Singapore Food Agency (SFA) port gateway.',
        timestamp: '1.5 hours ago',
        recommendedAction: 'Auto-transmit SereSeaShip Guard cryptographic certificate bundle to SFA TradeNet system for instant clearance.',
        resolved: false
      }
    ]
  },
  {
    id: 'SHP-SG04',
    containerId: 'BALI-334182-9',
    species: 'Fresh Bigeye Tuna Loins & Barramundi (Benoa / Bali Harvest)',
    quantityKg: 5200,
    origin: 'Bali (Pelabuhan Benoa) via Surabaya, Indonesia',
    destination: 'Singapore (Changi Airport Coolport & Jurong)',
    carrier: 'Singapore Airlines Cargo Coolport',
    status: 'in_transit',
    currentTemp: 0.8,
    targetTemp: 0.0,
    riskLevel: 'normal',
    qimFreshnessScore: 2,
    shelfLifeRemainingDays: 13,
    eta: 'Tomorrow, 14:00 SGT',
    departureDate: '2026-10-14',
    buyerName: 'Marina Bay Sands Culinary Procurement',
    supplierName: 'PT Bali Samudera Lestari (Benoa)',
    cargoValueUSD: 142000,
    telemetryHistory: [
      { time: '14:00', temperature: 0.4, humidity: 88, targetTemp: 0.0, doorOpen: false },
      { time: '15:00', temperature: 0.5, humidity: 88, targetTemp: 0.0, doorOpen: false },
      { time: '16:00', temperature: 0.6, humidity: 89, targetTemp: 0.0, doorOpen: false },
      { time: '17:00', temperature: 0.7, humidity: 88, targetTemp: 0.0, doorOpen: false },
      { time: '18:00', temperature: 0.8, humidity: 88, targetTemp: 0.0, doorOpen: false },
      { time: '19:00', temperature: 0.8, humidity: 89, targetTemp: 0.0, doorOpen: false },
    ],
    alerts: []
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-SG-101',
    poNumber: 'PO-2026-ID-SG-001',
    species: 'Live Cantang Grouper & Mud Crabs',
    supplier: 'PT Kepri Cold Fishery (Batam)',
    weightKg: 6800,
    unitPriceUSD: 12.35,
    totalAmountUSD: 83980,
    orderDate: '2026-10-15',
    expectedDelivery: 'Today, 18:30 SGT',
    status: 'in_transit',
    freshnessGuaranteeDays: 7,
    temperatureStandard: '+3.0°C Live seawater aeration',
    riskScore: 10
  },
  {
    id: 'PO-SG-102',
    poNumber: 'PO-2026-ID-SG-002',
    species: 'Yellowfin Tuna Sashimi AAA (Muara Baru Export)',
    supplier: 'PT Samudera Bahari Nusantara (Jakarta)',
    weightKg: 12500,
    unitPriceUSD: 19.60,
    totalAmountUSD: 245000,
    orderDate: '2026-10-14',
    expectedDelivery: 'Tomorrow, 06:00 SGT',
    status: 'in_transit',
    freshnessGuaranteeDays: 4,
    temperatureStandard: '-20.0°C ultra-deep freeze',
    riskScore: 76
  },
  {
    id: 'PO-SG-103',
    poNumber: 'PO-2026-ID-SG-003',
    species: 'Black Tiger Prawns (Frozen Blocks)',
    supplier: 'PT Sumatra Aqua Pratama (Medan)',
    weightKg: 18400,
    unitPriceUSD: 10.75,
    totalAmountUSD: 197800,
    orderDate: '2026-10-13',
    expectedDelivery: 'Oct 16, 2026',
    status: 'in_transit',
    freshnessGuaranteeDays: 180,
    temperatureStandard: '-22.0°C deep frozen',
    riskScore: 42
  },
  {
    id: 'PO-SG-104',
    poNumber: 'PO-2026-ID-SG-004',
    species: 'Fresh Bigeye Tuna Loins (Benoa Harvest)',
    supplier: 'PT Bali Samudera Lestari (Benoa)',
    weightKg: 5200,
    unitPriceUSD: 27.30,
    totalAmountUSD: 141960,
    orderDate: '2026-10-14',
    expectedDelivery: 'Oct 16, 2026',
    status: 'in_transit',
    freshnessGuaranteeDays: 13,
    temperatureStandard: '0.0°C slurry ice',
    riskScore: 14
  }
];

export const SUPPLIERS: SeafoodSupplier[] = [
  {
    id: 'SUP-ID-01',
    name: 'PT Kepri Cold Fishery',
    region: 'Batam & Kepulauan Riau, Indonesia',
    certifiedSustainable: true,
    certificationTypes: ['BKIPM Grade A', 'SFA Singapore Approved', 'Friend of the Sea'],
    reliabilityScore: 98,
    coldChainCompliancePct: 99.2,
    speciesOffered: ['Live Cantang Grouper', 'Mud Crab', 'Live Lobster'],
    avgDeliveryHours: 3,
    activeContracts: 8,
    rating: 4.9
  },
  {
    id: 'SUP-ID-02',
    name: 'PT Samudera Bahari Nusantara',
    region: 'Jakarta (Muara Baru / Tanjung Priok), Indonesia',
    certifiedSustainable: true,
    certificationTypes: ['HACCP Certified', 'MSC Tuna Chain of Custody', 'BKIPM Verified'],
    reliabilityScore: 94,
    coldChainCompliancePct: 96.5,
    speciesOffered: ['Yellowfin Tuna Sashimi', 'Skipjack Tuna', 'Mahi Mahi'],
    avgDeliveryHours: 32,
    activeContracts: 6,
    rating: 4.7
  },
  {
    id: 'SUP-ID-03',
    name: 'PT Sumatra Aqua Pratama',
    region: 'Medan (Belawan Port), Indonesia',
    certifiedSustainable: true,
    certificationTypes: ['BAP 4-Star Certified', 'ASC Shrimp Standard', 'SFA Approved'],
    reliabilityScore: 92,
    coldChainCompliancePct: 94.8,
    speciesOffered: ['Black Tiger Prawns', 'Vannamei White Shrimp', 'Red Snapper'],
    avgDeliveryHours: 19,
    activeContracts: 5,
    rating: 4.6
  },
  {
    id: 'SUP-ID-04',
    name: 'PT Bali Samudera Lestari',
    region: 'Benoa & Denpasar, Bali, Indonesia',
    certifiedSustainable: true,
    certificationTypes: ['Dolphin Safe', 'Fair Trade USA Tuna', 'BKIPM Grade A'],
    reliabilityScore: 96,
    coldChainCompliancePct: 98.4,
    speciesOffered: ['Bigeye Tuna Loins', 'Swordfish Steaks', 'Barramundi'],
    avgDeliveryHours: 24,
    activeContracts: 4,
    rating: 4.8
  }
];

export const DEMAND_FORECASTS: DemandForecastItem[] = [
  {
    id: 'DF-SG-01',
    species: 'Live Cantang Grouper (Kerapu Cantang)',
    currentDemandKg: 8500,
    projectedDemandKg: 13200,
    trendPct: 55.3,
    confidenceScore: 96,
    recommendedStockAction: 'increase_order',
    reasoning: 'Singapore weekend seafood restaurant demand in Clarke Quay and East Coast Seafood Centre surging +55%. Fast Batam ferry transit ensures zero mortality.',
    avgMarketPricePerKg: 14.50
  },
  {
    id: 'DF-SG-02',
    species: 'Yellowfin Tuna Sashimi (Muara Baru)',
    currentDemandKg: 11000,
    projectedDemandKg: 14500,
    trendPct: 31.8,
    confidenceScore: 92,
    recommendedStockAction: 'increase_order',
    reasoning: 'High-end Japanese restaurants in Orchard Road and Marina Bay Sands increasing weekly standing orders.',
    avgMarketPricePerKg: 19.80
  },
  {
    id: 'DF-SG-03',
    species: 'Black Tiger Prawns (Udang Windu)',
    currentDemandKg: 16000,
    projectedDemandKg: 15800,
    trendPct: -1.2,
    confidenceScore: 94,
    recommendedStockAction: 'maintain',
    reasoning: 'Stable cold-storage reserves in Jurong Cold Logistics Hub.',
    avgMarketPricePerKg: 11.20
  },
  {
    id: 'DF-SG-04',
    species: 'Mud Crabs (Kepiting Bakau)',
    currentDemandKg: 5400,
    projectedDemandKg: 8100,
    trendPct: 50.0,
    confidenceScore: 95,
    recommendedStockAction: 'increase_order',
    reasoning: 'Iconic Singapore Chilli Crab culinary consumption peaking over upcoming festive holidays.',
    avgMarketPricePerKg: 16.50
  }
];

export const SHIPMENT_DOCUMENTS: ShipmentDocument[] = [
  {
    id: 'DOC-SG-01',
    type: 'Health Inspection',
    shipmentId: 'SHP-SG01',
    containerId: 'SMDU-891024-1',
    issueDate: '2026-10-15',
    verifiedByAI: true,
    status: 'valid',
    fileSize: '1.2 MB',
    notes: 'BKIPM Batam Health Certificate #HC-BTM-2026-991: Free from pathogenic microbes, compliant with SFA import standards.'
  },
  {
    id: 'DOC-SG-02',
    type: 'Catch Certificate',
    shipmentId: 'SHP-SG02',
    containerId: 'NSTR-452109-8',
    issueDate: '2026-10-14',
    verifiedByAI: true,
    status: 'valid',
    fileSize: '2.4 MB',
    notes: 'KKP Electronic Catch Certificate (WPP-NRI 711 - Selat Karimata & Laut Natuna Selatan) verified against VMS vessel tracking.'
  },
  {
    id: 'DOC-SG-03',
    type: 'Customs Declaration',
    shipmentId: 'SHP-SG03',
    containerId: 'MLKA-678912-3',
    issueDate: '2026-10-14',
    verifiedByAI: false,
    status: 'flagged',
    fileSize: '1.7 MB',
    notes: 'SFA Singapore TradeNet Permit: HS code match verified, awaiting electronic signature release from Singapore Port Veterinary Gate 3.'
  },
  {
    id: 'DOC-SG-04',
    type: 'Bill of Lading',
    shipmentId: 'SHP-SG01',
    containerId: 'SMDU-891024-1',
    issueDate: '2026-10-15',
    verifiedByAI: true,
    status: 'valid',
    fileSize: '950 KB',
    notes: 'Direct Batam Batu Ampar to Jurong Fishery Port sea waybill. Short-sea transit certified under 4 hours.'
  }
];

export const INITIAL_CATCH_BATCHES: CatchBatch[] = [
  {
    id: 'BATCH-ID-01',
    batchNumber: 'BTM-2026-CT01',
    species: 'Live Cantang Grouper (Kerapu Cantang)',
    harvestMethod: 'Sustainable Aquaculture',
    catchZone: 'WPP-NRI 711 (Batam Barelang Waters)',
    harvestDate: '2026-10-15',
    quantityKg: 3400,
    availableKg: 3400,
    storageTemp: 3.2,
    qimGrade: 'Grade AAA Super Fresh (Live Tank)',
    phLevel: 6.7,
    pricePerKgUSD: 14.50,
    status: 'chilled_ready',
    certificationNumber: 'BKIPM/BTM/EXP/2026/8812'
  },
  {
    id: 'BATCH-ID-02',
    batchNumber: 'NTR-2026-TP02',
    species: 'Giant Tiger Prawns (Udang Windu Super)',
    harvestMethod: 'Sustainable Aquaculture',
    catchZone: 'WPP-NRI 711 (Natuna Coastal Mangrove Estuary)',
    harvestDate: '2026-10-14',
    quantityKg: 4200,
    availableKg: 200,
    storageTemp: -21.8,
    qimGrade: 'Grade AAA Export Frozen IQF',
    phLevel: 6.6,
    pricePerKgUSD: 18.20,
    status: 'allocated',
    assignedPoId: 'SO-SG-103',
    certificationNumber: 'BKIPM/NTN/EXP/2026/4109'
  },
  {
    id: 'BATCH-ID-03',
    batchNumber: 'JKT-2026-TN03',
    species: 'Yellowfin Tuna Sashimi Grade (Thunnus albacares)',
    harvestMethod: 'Deep Sea Longline',
    catchZone: 'WPP-NRI 572 (Samudera Hindia Barat Sumatera & Sunda)',
    harvestDate: '2026-10-13',
    quantityKg: 8500,
    availableKg: 8500,
    storageTemp: -22.5,
    qimGrade: 'Grade AAA Sashimi Super Freeze',
    phLevel: 6.5,
    pricePerKgUSD: 21.00,
    status: 'chilled_ready',
    certificationNumber: 'BKIPM/JKT/EXP/2026/9021'
  },
  {
    id: 'BATCH-ID-04',
    batchNumber: 'BLI-2026-MC04',
    species: 'Live Mud Crabs (Kepiting Bakau Super Gemuk)',
    harvestMethod: 'Wild Caught',
    catchZone: 'WPP-NRI 713 (Selat Bali & Alas Waters)',
    harvestDate: '2026-10-15',
    quantityKg: 1800,
    availableKg: 1800,
    storageTemp: 12.0,
    qimGrade: 'Grade AAA Live Mud Packed',
    phLevel: 6.8,
    pricePerKgUSD: 19.50,
    status: 'harvested',
    certificationNumber: 'BKIPM/DPS/EXP/2026/3012'
  },
  {
    id: 'BATCH-ID-05',
    batchNumber: 'MDN-2026-BM05',
    species: 'Barramundi / Asian Seabass Fillet (Kakap Putih)',
    harvestMethod: 'Sustainable Aquaculture',
    catchZone: 'WPP-NRI 571 (Selat Malaka - Belawan Zone)',
    harvestDate: '2026-10-14',
    quantityKg: 5000,
    availableKg: 5000,
    storageTemp: -18.5,
    qimGrade: 'Grade AA Export Quality Chilled',
    phLevel: 6.5,
    pricePerKgUSD: 11.80,
    status: 'chilled_ready',
    certificationNumber: 'BKIPM/MDN/EXP/2026/7201'
  }
];

export const INITIAL_SELLER_ORDERS: SellerOrder[] = [
  {
    id: 'SO-SG-101',
    orderNumber: 'PO-SG-2026-081',
    buyerName: 'Jurong Fishery Wholesale Hub, Singapore',
    buyerCountry: 'Singapore',
    destinationPort: 'Jurong Fishery Port Pier 2',
    species: 'Live Cantang Grouper (Kerapu Cantang)',
    weightKg: 3000,
    unitPriceUSD: 14.50,
    totalAmountUSD: 43500,
    orderDate: '2026-10-15',
    targetShipDate: '2026-10-15 (Direct Evening Ferry)',
    status: 'accepted',
    assignedBatchNumber: 'BTM-2026-CT01',
    coldChainSpec: '+2.5°C to +3.5°C Oxygenated Live Tank',
    inspectionStatus: 'BKIPM Pre-Approved'
  },
  {
    id: 'SO-SG-102',
    orderNumber: 'PO-SG-2026-082',
    buyerName: 'Marina Bay Sands Culinary Group, Singapore',
    buyerCountry: 'Singapore',
    destinationPort: 'Pasir Panjang Reefer Terminal 4',
    species: 'Yellowfin Tuna Sashimi Grade AAA',
    weightKg: 2500,
    unitPriceUSD: 21.00,
    totalAmountUSD: 52500,
    orderDate: '2026-10-15',
    targetShipDate: '2026-10-16',
    status: 'pending',
    assignedBatchNumber: 'JKT-2026-TN03',
    coldChainSpec: '-22.0°C Ultra-Low Deep Frozen',
    inspectionStatus: 'Pending BKIPM'
  },
  {
    id: 'SO-SG-103',
    orderNumber: 'PO-SG-2026-079',
    buyerName: 'Oceanic Seafoods Singapore Pte Ltd',
    buyerCountry: 'Singapore',
    destinationPort: 'Pasir Panjang Reefer Terminal 4',
    species: 'Giant Tiger Prawns (Udang Windu Super)',
    weightKg: 4000,
    unitPriceUSD: 18.20,
    totalAmountUSD: 72800,
    orderDate: '2026-10-14',
    targetShipDate: '2026-10-14',
    status: 'dispatched',
    assignedContainerId: 'NSTR-452109-8',
    assignedBatchNumber: 'NTR-2026-TP02',
    coldChainSpec: '-20.0°C IQF Frozen',
    inspectionStatus: 'SFA Green-Lane Ready'
  }
];
