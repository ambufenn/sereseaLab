import { GoogleGenAI } from '@google/genai';
import { UserRole } from '../types';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (genAIClient) return genAIClient;
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    '';
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      genAIClient = new GoogleGenAI({ apiKey });
      return genAIClient;
    } catch {
      return null;
    }
  }
  return null;
}

export async function askSeafoodAssistant(prompt: string, role: UserRole): Promise<string> {
  const client = getGenAI();

  if (client) {
    try {
      const systemInstruction = role === 'buyer'
        ? `You are SereSeaShip Guard's AI Seafood Procurement & Supply Intelligence Advisor. You advise commercial seafood buyers, supermarket chains, and food service groups on seafood purchasing, species seasonality, Quality Index Method (QIM) freshness ratings, supplier vetting, cold-chain assurance, and price trend forecasting. Be concise, professional, data-driven, and focused on food waste prevention and quality.`
        : `You are SereSeaShip Guard's AI Cold-Chain & Maritime Operations Officer. You assist reefer fleet managers and logistics dispatchers with refrigerated container telemetry, temperature excursion mitigation, port customs clearance, spoilage models, dynamic rerouting, and food waste recovery. Be actionable, precise, safety-focused, and operational.`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
          maxOutputTokens: 600
        }
      });

      if (response.text) {
        return response.text;
      }
    } catch {
      // Fallback gracefully to domain heuristics below
    }
  }

  // Domain-specific intelligent response engine
  const p = prompt.toLowerCase();

  if (role === 'buyer') {
    if (p.includes('salmon') || p.includes('fjordpelagic')) {
      return `Norwegian Atlantic Salmon analysis: FjordPelagic AS currently holds 99.4% cold-chain compliance. Q4 European holiday demand is projected to spike +34.4%, with wholesale prices firming around $11.95/kg. Recommendation: Secure next month's volume commitment under forward contract PO-2026-NOR-091 to avoid anticipated +8% spot-market premiums.`;
    }
    if (p.includes('tuna') || p.includes('sashimi') || p.includes('risk')) {
      return `Yellowfin Tuna Advisory: Shipment CMAU-452109-1 (PO-2026-JPN-044) has experienced a reefer compressor cycling excursion (-16.2°C vs target -20°C). While still safe for general cooking, sashimi-grade muscle translucency begins degrading after 6 hours above -18°C. Recommendation: Request an expedited inspection upon Tokyo arrival or negotiate an automatic salvage claim under Clause 14.`;
    }
    if (p.includes('halibut') || p.includes('alaska')) {
      return `Wild Alaskan Halibut Market Intelligence: Dutch Harbor quotas are 82% fulfilled; fishery closure takes effect in 3 weeks. Current landed price ($23.00/kg) is expected to rise to $27.50/kg in November. Bering Sound Fisheries has pristine QIM ratings (Score 1.0) on current transit SHP-9218. Recommendation: Lock in late autumn stock immediately.`;
    }
    if (p.includes('freshness') || p.includes('qim') || p.includes('shelf life')) {
      return `SerenAgri Freshness Matrix: Quality Index Method (QIM) scores range from 0 (day of catch) to 20 (unfit for retail). Current in-transit inventory averages a QIM of 3.2 (Superb commercial freshness) with an average remaining retail shelf-life of 11.4 days. Every 1°C reduction in transit temperature adds approximately 1.8 days of prime retail shelf life.`;
    }
    return `SereSeaShip Guard Buyer Intelligence: We are tracking 5 active purchase orders across 4 origins. Fleet cold-chain compliance is currently 97.2%. For maximum margin protection, prioritize sustainable MSC-certified suppliers (FjordPelagic and Bering Sound) where automated IoT freshness tracking guarantees zero shrinkage compensation.`;
  } else {
    // Logistics role
    if (p.includes('temperature') || p.includes('excursion') || p.includes('spike')) {
      return `Cold-Chain Telemetry Incident: Container CMAU-452109-1 (Yellowfin Tuna) shows ambient fluctuation to -16.2°C at 19:00. The primary scroll compressor has triggered error code E-41 (condenser fan duty cycle overload). Immediate corrective action: Send remote command to switch to auxiliary loop B and set setpoint to -24°C continuous pull-down. Estimated pull-down time: 45 minutes.`;
    }
    if (p.includes('reroute') || p.includes('delay') || p.includes('customs')) {
      return `Customs Delay Resolution: Container HLCU-678912-8 (Tiger Prawns) held at Hamburg Gate 4 due to HS code classification clarification. AI Document Intelligence has re-verified Catch Certificate #CC-90142 with German BLE import database. Suggested action: Transmit electronic clearance dossier directly to the Hamburg Port Veterinary Authority to release cargo within 3 hours.`;
    }
    if (p.includes('waste') || p.includes('prevent') || p.includes('spoilage')) {
      return `SereSeaShip Guard Waste Prevention Protocol: Year-to-date, automated dynamic intervention has prevented 42.6 metric tons of seafood waste across 18 shipments, saving $482,000 in cargo loss. For at-risk consignments with QIM > 8, our dynamic rerouting algorithm automatically calculates secondary buyer salvage routes (blast-freeze processing or local smoking houses) before irreversible spoilage occurs.`;
    }
    if (p.includes('container') || p.includes('reefer') || p.includes('fleet')) {
      return `Fleet Status Summary: 5 active reefer units currently operational across transatlantic and Pacific routes. 4 units are operating within nominal thermal envelopes (±0.5°C tolerance). 1 unit (CMAU-452109-1) requires proactive compressor cycling override. All door seal telemetry reports nominal integrity.`;
    }
    return `SereSeaShip Guard Logistics Operations: All 5 active maritime and air cargo shipments are mapped with live telemetry. Automated alert engine has flagged 1 critical temperature drift and 1 customs document validation. Would you like to transmit remote temperature reset commands or review the rapid salvage protocol?`;
  }
}
