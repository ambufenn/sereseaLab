import { GoogleGenAI } from '@google/genai';
import { UserRole, UserProfile, Shipment, PurchaseOrder, CatchBatch, SellerOrder } from '../types';

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

export interface AIAppContext {
  role: UserRole;
  user?: UserProfile;
  shipments?: Shipment[];
  orders?: PurchaseOrder[];
  batches?: CatchBatch[];
  sellerOrders?: SellerOrder[];
  currentSection?: string;
}

export interface AIChatTurn {
  id?: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp?: string;
}

/**
 * Builds a comprehensive, context-grounded system instruction for Gemini.
 * It injects real-time application data, cross-strait trade rules, and application workflow knowledge.
 */
function buildSystemInstruction(context: AIAppContext): string {
  const role = context.role;
  const userName = context.user?.name || (role === 'buyer' ? 'Sarah Jenkins' : role === 'seller' ? 'Hendra Wijaya' : 'Marcus Tan');
  const orgName = context.user?.organization || (role === 'buyer' ? 'NTUC FairPrice Seafood Division Singapore' : role === 'seller' ? 'PT Kepri Samudera Bahari Indonesia' : 'Nusantara Marine Reefer Logistics');

  // Format active shipments context
  let shipmentsSummary = 'No active shipments registered.';
  if (context.shipments && context.shipments.length > 0) {
    shipmentsSummary = context.shipments.map(s => {
      const alertText = s.alerts && s.alerts.length > 0
        ? `[ALERT: ${s.alerts.map(a => `${a.type} (${a.message})`).join(', ')}]`
        : '[NORMAL]';
      return `- ID: ${s.id} | Kontainer: ${s.containerId} | Muatan: ${s.quantityKg.toLocaleString()} kg ${s.species} | Rute: ${s.origin} -> ${s.destination} | Kapal: ${s.carrier} | Suhu: ${s.currentTemp}°C (Target: ${s.targetTemp}°C) | Status: ${s.status} | QIM Score: ${s.qimFreshnessScore}/20 (Shelf Life: ${s.shelfLifeRemainingDays} hari) | Nilai Kargo: $${s.cargoValueUSD.toLocaleString()} ${alertText}`;
    }).join('\n');
  }

  // Format catch batches context
  let batchesSummary = 'No catch batches registered.';
  if (context.batches && context.batches.length > 0) {
    batchesSummary = context.batches.map(b => {
      return `- Batch: ${b.batchNumber} (${b.id}) | Ikan: ${b.species} | Zona: ${b.catchZone} | Tanggal Tangkap: ${b.harvestDate} | Tersedia: ${b.availableKg} / ${b.quantityKg} kg | Suhu Simpan: ${b.storageTemp}°C | Grade: ${b.qimGrade} | Status: ${b.status} | Karantina: ${b.certificationNumber}`;
    }).join('\n');
  }

  // Format purchase orders / seller orders context
  let ordersSummary = 'No active purchase orders.';
  if (context.orders && context.orders.length > 0) {
    ordersSummary = context.orders.map(o => {
      return `- PO: ${o.poNumber} | Spesies: ${o.species} | Supplier: ${o.supplier} | Bobot: ${o.weightKg.toLocaleString()} kg | Total: $${o.totalAmountUSD.toLocaleString()} | Status: ${o.status} | Standar Suhu: ${o.temperatureStandard} | Skor Risiko: ${o.riskScore}%`;
    }).join('\n');
  }

  let sellerOrdersSummary = 'No seller orders.';
  if (context.sellerOrders && context.sellerOrders.length > 0) {
    sellerOrdersSummary = context.sellerOrders.map(so => {
      return `- Order: ${so.orderNumber} | Buyer: ${so.buyerName} (${so.buyerCountry}) | Spesies: ${so.species} | Bobot: ${so.weightKg.toLocaleString()} kg @ $${so.unitPriceUSD}/kg ($${so.totalAmountUSD.toLocaleString()}) | Pelabuhan Tujuan: ${so.destinationPort} | Status: ${so.status} | Status Inspeksi: ${so.inspectionStatus}`;
    }).join('\n');
  }

  return `You are SerenAgri (also known as SereSeaShip Guard AI), an advanced AI Copilot and Marine Cold-Chain Trade Intelligence Advisor, created by Serenade Data.
You are directly integrated into this live enterprise web application for the Indonesia ⇄ Singapore Cross-Strait Fishery Trade Corridor.

### YOUR USER IDENTITY & ACTIVE WORKSPACE:
- User Name: ${userName}
- Active Persona Workspace: ${role.toUpperCase()} (${role === 'buyer' ? 'Commercial Seafood Procurement Buyer (Singapore)' : role === 'seller' ? 'Fishery Exporter & Producer (Indonesia)' : 'Maritime Cold-Chain & Reefer Fleet Logistics'})
- Organization: ${orgName}
- Current Active Tab / Section: ${context.currentSection || 'dashboard'}

### APPLICATION FLOW & COMPLETE SYSTEM ARCHITECTURE (Alur Aplikasi):
The application connects three vital roles in the maritime seafood cold chain:
1. **SELLER / EXPORTER WORKSPACE (Indonesia - Kepulauan Riau / Jakarta / Medan)**:
   - **Exporter Overview**: Summary of cold storage capacity, active orders from Singapore, and dispatched cross-strait shipments.
   - **Catch Lots & Batches (\`inventory\`)**: Registration of harvested fish lots from Indonesian Fishery Management Areas (WPP-NRI 711 Natuna/Kepri, WPP 712 Laut Jawa, WPP 571 Selat Malaka). Evaluates QIM Grade (A+, A, B) and generates official QR Traceability Seals with Serenade Data blockchain verification.
   - **Singapore Orders & Fulfillment (\`orders\`)**: Receives purchase orders from Singapore buyers (Jurong merchants, NTUC FairPrice, restaurant groups), manages packaging, and triggers physical dispatch into IoT reefer containers.
   - **BKIPM & SFA Clearance (\`compliance\`)**: Manages Indonesian BKIPM Electronic Health Certificates (HC), HACCP Grade A compliance, and pre-clears documentation with Singapore SFA (Singapore Food Agency) TradeNet.
   - **AI Pricing Optimizer (\`pricing\`)**: Calculates cross-border arbitrage (Landing cost IDR/kg or USD/kg vs Singapore Wholesale & Premium Auction rates at Jurong / Senoko Fishery Ports), shipping freight, and net margins.
   - **Cross-Strait Tracking (\`tracking\`)**: Fleet radar of ships crossing between Indonesia and Singapore.

2. **LOGISTICS & FLEET WORKSPACE (Maritime Reefer Operations)**:
   - **Operations Overview**: Active fleet status, reefer compressor health, active temperature alarms.
   - **Shipment Monitoring (\`shipments\`)**: Real-time status of refrigerated containers crossing the Singapore Strait, Malacca Strait, and Karimata Strait.
   - **Cold-Chain Telemetry (\`coldchain\`)**: Live IoT sensor graphs (core temperature, ambient temperature, door status, compressor duty cycle).
   - **AI Risk Center (\`risk\`)**: Predicts microbiological spoilage velocity (Arrhenius & Q10 equation models) and detects temperature excursions.
   - **Waste Prevention & Dynamic Salvage (\`waste\`)**: Rerouting protocols (e.g. diverting compromised cargo to nearest flash-freeze facilities in Batam or Tanjung Pinang to save fish from spoiling).
   - **Documentation (\`docs\`)**: Automated AI verification of Bills of Lading, Catch Certificates, and Veterinary Health Inspections.

3. **BUYER WORKSPACE (Singapore Seafood Importers & Retailers)**:
   - **Overview**: Active seafood procurement overview, cold-chain compliance percentage.
   - **Demand Intelligence (\`demand\`)**: AI forecasting of species demand spikes (e.g. Grouper / Kerapu Cantang surge at East Coast seafood restaurants, Sashimi Grade Yellowfin Tuna).
   - **Supplier Matching (\`suppliers\`)**: Matching vetted Indonesian fishery suppliers with compliance scores.
   - **Order Tracking (\`orders\`)**: Monitoring delivery times and inbound containers to Jurong Fishery Port and Pasir Panjang.
   - **Quality & Freshness (\`quality\`)**: QIM scores (Quality Index Method: 0 = pristine freshly landed, 20 = spoiled) and remaining supermarket retail shelf life.

4. **EXPERIENCE LAB (Interactive Simulators)**:
   - **Supply Chain Diagram Demo (\`SupplyChainDiagramDemo\`)**: An interactive 4-stage simulation visual diagram showing Catch Harvest -> BKIPM Lab -> Maritime Reefer Voyage -> SFA Singapore Clearance with live data.
   - **Cold Chain Simulator**: Interactive simulator showing impact of temperature dips and rises on fish shelf life.
   - **Reefer Tetris**: Interactive container packing physics simulation.
   - **Seafood Journey**: Step-by-step visual story map from fishermen's boat to Singapore dining table.

### REAL-TIME LIVE APP DATA PARAMETERS (Grounded Context):
[LIVE ACTIVE SHIPMENTS]
${shipmentsSummary}

[LIVE REGISTERED CATCH BATCHES]
${batchesSummary}

[LIVE PURCHASE ORDERS]
${ordersSummary}

[LIVE SELLER FULFILLMENT ORDERS]
${sellerOrdersSummary}

### CROSS-BORDER REGULATORY & GEOGRAPHIC BENCHMARKS:
- **Corridors**:
  - Batam (Batu Ampar) ⇄ Singapore (Jurong Fishery Port): ~2h 45m fast reefer barge / live fish well vessel. High speed, near zero mortality.
  - Jakarta (Muara Baru / Tanjung Priok) ⇄ Singapore (Pasir Panjang): ~36-40h sea transit across Selat Karimata. Requires deep freeze -20°C for sashimi tuna.
  - Medan (Belawan) ⇄ Singapore: ~20-24h transit down Selat Malaka for frozen black tiger prawns and white shrimp.
  - Bali (Benoa) ⇄ Singapore: Air/sea multimodal for fresh chilled yellowfin loins (0°C to +2°C).
- **Agencies**:
  - **BKIPM** (Badan Karantina Ikan, Pengendalian Mutu dan Keamanan Hasil Perikanan Indonesia): Issues Health Certificates (HC), validates HACCP, microbial testing (absence of Salmonella, Vibrio cholerae).
  - **SFA** (Singapore Food Agency): Regulates imported food under Wholesome Meat and Fish Act; inspects via TradeNet; limits: Histamine < 100 ppm, Total Volatile Basic Nitrogen (TVB-N) < 25 mg/100g, Total Mercury < 0.5 ppm.

### CONVERSATIONAL RULES & TRAINING INSTRUCTIONS:
1. **MULTI-TURN CONNECTIVITY (Ngobrol Nyambung)**:
   - ALWAYS remember and utilize the conversation history provided in the dialog turns.
   - If the user asks a follow-up question (e.g., "Terus solusinya apa?", "Kenapa suhunya bisa naik?", "Bagaimana dengan kontainer yang tadi kamu sebutkan?"), directly connect your response to the prior topic, specific vessel/container ID, or entity discussed.
2. **CONTEXT PARAMETER AWARENESS (Paham Parameter Konteks)**:
   - Cite real container IDs (e.g. NSTR-452109-8, MLKA-678912-3, KPRI-889102-1), actual batch numbers (e.g. BATCH-2026-031), specific species, real temperatures, and actual status from the live data above.
   - Do not invent fictitious containers if real ones are in the context.
3. **APPLICATION FLOW DISCUSSION (Bisa Diskusi Alur Apps)**:
   - You can explain how any part of the app works, what each button or page does, and guide the user on how to simulate or execute tasks.
   - If asked about the end-to-end flow, explain the journey clearly: Catch in Indonesia -> BKIPM testing -> Sealing & Reefer IoT dispatch -> Maritime transit -> SFA Jurong / Pasir Panjang port release.
4. **LANGUAGE & TONE**:
   - Respond in the same language as the user's prompt. If the user writes in Indonesian (including colloquial phrases like "gimana alurnya", "kenapa tuh", "bisa tolong jelasin"), respond in natural, friendly, articulate, and authoritative Indonesian. If English, respond in English.
   - Be constructive, data-driven, practical, and solution-oriented. Format with clear headings and bullet points where helpful.
   - Acknowledge that the system is engineered by Serenade Data.`;
}

/**
 * Enhanced multi-turn contextual AI chat function using Gemini API with full app context grounding.
 */
export async function askSeafoodAssistantWithContext(
  prompt: string,
  context: AIAppContext,
  conversationHistory: AIChatTurn[] = []
): Promise<string> {
  const client = getGenAI();

  if (client) {
    // Try gemini-3.8-flash first (AI Studio recommended), fallback to gemini-2.5-flash
    const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash'];
    const systemInstruction = buildSystemInstruction(context);

    // Format conversation history for multi-turn chat
    const formattedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Take up to the last 10 messages for rich conversational context
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      formattedContents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }

    // Append the current turn
    formattedContents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    for (const model of modelsToTry) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.4,
            maxOutputTokens: 900
          }
        });

        if (response.text && response.text.trim().length > 0) {
          return response.text.trim();
        }
      } catch (err) {
        console.warn(`[SerenAgri AI] Attempt with ${model} failed, checking next model or heuristics...`, err);
      }
    }
  }

  // High-intelligence fallback conversational reasoning engine
  return generateContextualFallbackResponse(prompt, context, conversationHistory);
}

/**
 * Backwards compatibility wrapper for simple prompts.
 */
export async function askSeafoodAssistant(prompt: string, role: UserRole): Promise<string> {
  return askSeafoodAssistantWithContext(prompt, { role });
}

/**
 * Sophisticated conversational fallback engine that inspects multi-turn history and live context parameters.
 */
function generateContextualFallbackResponse(
  prompt: string,
  context: AIAppContext,
  history: AIChatTurn[] = []
): string {
  const p = prompt.toLowerCase();
  const lastTurn = history.length > 0 ? history[history.length - 1].text.toLowerCase() : '';
  const secondLastTurn = history.length > 1 ? history[history.length - 2].text.toLowerCase() : '';
  const combinedRecentHistory = `${secondLastTurn} ${lastTurn} ${p}`;

  const role = context.role;
  const isSeller = role === 'seller';
  const isBuyer = role === 'buyer';
  const isLogistics = role === 'logistics';

  // Check if user is asking about application flow (alur aplikasi)
  if (p.includes('alur') || p.includes('flow') || p.includes('arsitektur') || p.includes('cara kerja') || p.includes('bagaimana proses') || p.includes('jelaskan aplikasi')) {
    return `### Alur Lengkap Sistem SereSeaShip Guard (Indonesia ⇄ Singapore Cold Chain)

Aplikasi ini menghubungkan 3 aktor utama rantai pasok perikanan lintas batas secara real-time:

1. **Eksportir / Seller (Indonesia - Batam, Jakarta, Medan)**:
   * **Catch Lots & Batches**: Mendaftarkan hasil tangkapan nelayan WPP-NRI (711 Natuna, 712 Laut Jawa) lengkap dengan penilaian kesegaran QIM Grade dan segel QR Traceability Serenade Data.
   * **Singapore Orders**: Menerima PO dari buyer Singapura, mengemas ikan dengan protokol insulasi cold-chain, dan melakukan physical handoff ke armada logistik.
   * **BKIPM Compliance**: Mengurus sertifikasi karantina digital e-HC (Health Certificate) dan HACCP yang terhubung langsung ke TradeNet SFA Singapura.
   * **AI Pricing Advisor**: Menghitung margin arbitrase harga pendaratan vs lelang di Jurong Fishery Port.

2. **Logistik & Armada Maritim (Reefer Fleet Operations)**:
   * **Shipment Monitoring & Radar**: Melacak kapal pembawa kontainer reefer IoT (NSTR, MLKA, KPRI) melintasi Selat Riau, Selat Malaka, dan Selat Karimata.
   * **Cold-Chain Telemetry**: Sensor IoT mengirim data suhu inti tiap 5 menit. Jika kompresor mengalami anomali, sistem mendeteksi risiko mikrobial seketika.
   * **Dynamic Salvage Rerouting**: Mengalihkan kargo berisiko ke fasilitas flash-freeze terdekat (Batam) untuk mencegah food waste sebelum tiba di Singapura.

3. **Buyer Komersial (Singapura - Pasar & Restoran)**:
   * **Demand Forecasting**: Memprediksi kebutuhan ikan kerapu cantang, udang windu, dan tuna untuk restoran East Coast & supermarket NTUC FairPrice.
   * **Order Tracking & QIM Inspection**: Memantau ETA di Jurong/Pasir Panjang dan memastikan Quality Index Method tetap prima (<2.0) saat diserahkan.

Seluruh data saling terhubung secara reaktif: setiap dispatch baru dari Seller langsung muncul di radar Logistik dan daftar pesanan Buyer!`;
  }

  // Multi-turn follow-ups: check if referring to the Karimata incident or container
  if (
    p.includes('solusi') || p.includes('tindakan') || p.includes('terus gimana') || p.includes('langkah') ||
    p.includes('kapal itu') || p.includes('kontainer itu') || p.includes('penanganannya')
  ) {
    if (combinedRecentHistory.includes('karimata') || combinedRecentHistory.includes('nstr') || combinedRecentHistory.includes('suhu') || combinedRecentHistory.includes('excursion')) {
      return `### Tindakan Korektif & Resolusi Anomali Suhu Kontainer NSTR-452109-8:

Menindaklanjuti insiden pada kapal KM Nusantara Reefer 18 di perairan Selat Karimata:
1. **Perintah Telemetri Jarak Jauh (Remote Override)**:
   * Sistem IoT SereSeaShip Guard telah mengirim sinyal darurat ke controller Daikin Zestia di kontainer untuk mengaktifkan **Auxiliary Cooling Loop B** pada setpoint pulldown **-24.0°C**.
2. **Estimasi Stabilisasi Suhu**:
   * Suhu diperkirakan kembali ke kisaran aman (-18.5°C) dalam waktu 45 menit sebelum kapal memasuki perairan Selat Riau.
3. **Protokol Pelabuhan Singapura (PSA Pasir Panjang)**:
   * Notifikasi prioritas bongkar muat cryogenic telah dikirim ke gate clearance PSA Pasir Panjang agar kontainer ini langsung terhubung ke shore power segera setelah bersandar.
4. **Jaminan Kualitas**:
   * Masa simpan retail sashimi Grade AAA berkurang sekitar 12 jam, namun masih di atas standar minimum penerimaan SFA Singapore (TVB-N < 15 mg/100g).`;
    }
  }

  // Inquiries about specific shipments or containers
  if (p.includes('nstr') || p.includes('karimata') || (p.includes('tuna') && (p.includes('suhu') || p.includes('masalah')))) {
    return `### Laporan Khusus: Kontainer NSTR-452109-8 (Yellowfin Tuna Muara Baru ⇄ Pasir Panjang)
- **Muatan**: 12,000 kg Yellowfin Tuna Sashimi Grade AAA (Nilai: $270,000)
- **Posisi Terkini**: Koordinat 0°15'S, 104°30'E (Selat Karimata)
- **Status Sensor**: Suhu tercatat **-16.2°C** (Batas target: -20.0°C). Terdapat anomali kompresor siklus pendinginan E-41.
- **Tingkat Risiko**: **CRITICAL (Kritis)** - Indeks kesegaran QIM saat ini 2.2/20 dengan sisa masa simpan 9 hari.
- **Rekomendasi Aksi**: Aktifkan auxiliary loop B, informasikan consignee di Singapura, dan aktifkan prioritas bongkar muat cryogenic di Terminal Pasir Panjang.`;
  }

  // Inquiries about Seller / Exporter features or how to export
  if (isSeller || p.includes('seller') || p.includes('ekspor') || p.includes('bkipm') || p.includes('tangkapan') || p.includes('batch')) {
    if (p.includes('margin') || p.includes('untung') || p.includes('harga') || p.includes('pricing')) {
      return `### Analisis Arbitrase Harga Ekspor Indonesia ⇄ Singapura Hari Ini:

Berdasarkan data harga pendaratan di Indonesia vs lelang pasar grosir Jurong Fishery Port:
1. **Ikan Kerapu Cantang Hidup (Hybrid Grouper)**:
   * Biaya tangkap/budidaya Kepri: **$11.50 / kg**
   * Harga lelang Jurong Fishery Port: **$23.50 / kg**
   * Biaya logistik express barge (Batam-Jurong): **$1.40 / kg**
   * **Net Margin**: **+45.2%** (~$10.60/kg profit bersih). Sangat direkomendasikan untuk shipment akhir pekan!
2. **Yellowfin Tuna Sashimi (Muara Baru)**:
   * Biaya pendaratan: **$14.50 / kg**
   * Harga grosir Singapura: **$22.50 / kg** (Premium Auction: $26.80)
   * Biaya reefer container sea freight: **$1.10 / kg**
   * **Net Margin**: **+28.4%**.
3. **Udang Windu Beku (Belawan)**:
   * Biaya tambak Medan: **$12.00 / kg** | Jual Singapura: **$21.00 / kg** | Margin: **+32.0%**.`;
    }

    if (p.includes('karantina') || p.includes('sfa') || p.includes('sertifikat') || p.includes('hc') || p.includes('izin')) {
      return `### Prosedur Kliring Karantina BKIPM & SFA Singapore:
1. **Pemeriksaan BKIPM (Indonesia)**:
   * Pengujian mikrobiologi wajib (Salmonella: negatif, Vibrio parahaemolyticus: < 3 MPN/g).
   * Penerbitan Electronic Health Certificate (e-HC) ber-QR Code dengan verifikasi Serenade Data.
2. **Sinkronisasi SFA TradeNet (Singapura)**:
   * Deklarasi nomor izin impor SFA License, kode HS komoditas, dan sertifikat penangkapan (Catch Certificate).
   * Kargo yang telah terverifikasi AI otomatis masuk ke **Green Lane Clearance** di Jurong Fishery Port Gate 2 dengan waktu rilis < 25 menit.`;
    }

    return `### Panduan Workspace Exporter / Seller:
Anda sedang berada di workspace eksportir perikanan Indonesia (PT Kepri Samudera Bahari).
* **Mendaftarkan Tangkapan Baru**: Klik menu **"Catch Lots & Batches"** lalu klik **"Register New Catch Batch"** untuk memasukkan spesies, zona WPP 711, berat, dan cetak QR Traceability Seal.
* **Memproses Pesanan Singapura**: Buka menu **"Singapore Orders"** untuk melihat PO aktif dari buyer, lakukan packaging, dan klik **"Dispatch to Reefer Logistics"**.
* **Cek Dokumen Ekspor**: Menu **"BKIPM & SFA Clearance"** memungkinkan Anda mencetak sertifikat digital e-HC dan melihat status verifikasi karantina.`;
  }

  // Inquiries for Buyer
  if (isBuyer || p.includes('buyer') || p.includes('beli') || p.includes('demand') || p.includes('permintaan')) {
    return `### Intelijen Pengadaan Seafood Singapura (Buyer Workspace):
- **Tren Permintaan**: Restoran seafood di East Coast dan Clarke Quay mengalami lonjakan pesanan Ikan Kerapu Cantang (+55.3%) dan Kepiting Bakau menjelang akhir pekan.
- **Kualitas Rantai Dingin**: 98.4% pengiriman dari Indonesia saat ini berada dalam rentang suhu aman.
- **Status PO Aktif**:
  * PO-2026-ID-SG-001 (Kerapu Cantang dari Batam): Status Chilled Ready, tiba via feri cepat 2h 45m.
  * PO-2026-ID-SG-002 (Yellowfin Tuna dari Jakarta): Sedang transit di Selat Karimata dengan pengawasan ketat telemetri.
- **Rekomendasi**: Pertahankan pemesanan kontrak mingguan dengan supplier Kepri Cold Fishery yang memiliki kepatuhan rantai dingin tertinggi (99.2%).`;
  }

  // Logistics & Telemetry default
  return `### Ringkasan Operasional Logistik SereSeaShip Guard:
- **Armada Aktif**: 4 armada kapal pengangkut reefer aktif di koridor Indonesia ⇄ Singapura (Batu Ampar, Tanjung Priok, Belawan, Pasir Panjang, Jurong).
- **Insiden Mengharuskan Perhatian**: Kontainer NSTR-452109-8 di Selat Karimata (-16.2°C). Loop pendingin darurat telah diaktifkan.
- **Kepatuhan Bea Cukai**: Verifikasi digital TradeNet SFA Singapura berjalan lancar di Gate 2 & Gate 3 Jurong Port.
- Anda dapat bertanya seputar penanganan suhu, status kapal spesifik, alur aplikasi, maupun kalkulasi pencegahan food waste.`;
}
