export type UserRole = 'buyer' | 'logistics';

export interface UserProfile {
  name: string;
  role: UserRole;
  organization: string;
  avatarUrl?: string;
}

export type ShipmentStatus = 'in_transit' | 'customs_hold' | 'delivered' | 'docked' | 'delayed';
export type RiskLevel = 'normal' | 'moderate' | 'critical';

export interface ReeferTelemetryPoint {
  time: string;
  temperature: number;
  humidity: number;
  targetTemp: number;
  doorOpen: boolean;
}

export interface Shipment {
  id: string;
  containerId: string;
  species: string;
  quantityKg: number;
  origin: string;
  destination: string;
  carrier: string;
  status: ShipmentStatus;
  currentTemp: number;
  targetTemp: number;
  riskLevel: RiskLevel;
  qimFreshnessScore: number; // 0 (pristine) to 20 (spoiled)
  shelfLifeRemainingDays: number;
  eta: string;
  departureDate: string;
  buyerName: string;
  supplierName: string;
  cargoValueUSD: number;
  telemetryHistory: ReeferTelemetryPoint[];
  alerts: ShipmentAlert[];
}

export interface ShipmentAlert {
  id: string;
  type: 'temperature_spike' | 'door_breach' | 'customs_delay' | 'spoilage_risk';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
  recommendedAction: string;
  resolved: boolean;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  species: string;
  supplier: string;
  weightKg: number;
  unitPriceUSD: number;
  totalAmountUSD: number;
  orderDate: string;
  expectedDelivery: string;
  status: 'confirmed' | 'in_transit' | 'quality_check' | 'received';
  freshnessGuaranteeDays: number;
  temperatureStandard: string;
  riskScore: number; // 0-100
}

export interface SeafoodSupplier {
  id: string;
  name: string;
  region: string;
  certifiedSustainable: boolean;
  certificationTypes: string[];
  reliabilityScore: number; // 0-100%
  coldChainCompliancePct: number;
  speciesOffered: string[];
  avgDeliveryHours: number;
  activeContracts: number;
  rating: number;
}

export interface DemandForecastItem {
  id: string;
  species: string;
  currentDemandKg: number;
  projectedDemandKg: number;
  trendPct: number;
  confidenceScore: number;
  recommendedStockAction: 'increase_order' | 'maintain' | 'defer_purchase';
  reasoning: string;
  avgMarketPricePerKg: number;
}

export interface ShipmentDocument {
  id: string;
  type: 'Bill of Lading' | 'Catch Certificate' | 'Health Inspection' | 'Customs Declaration';
  shipmentId: string;
  containerId: string;
  issueDate: string;
  verifiedByAI: boolean;
  status: 'valid' | 'flagged' | 'pending';
  fileSize: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
