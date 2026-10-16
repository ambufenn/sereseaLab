import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  RefreshCw,
  Database,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Ship,
  Package,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  Zap,
  Store,
  Truck,
  ShoppingBag
} from 'lucide-react';
import {
  UserProfile,
  UserRole,
  Shipment,
  PurchaseOrder,
  CatchBatch,
  SellerOrder,
  ChatMessage
} from '../../types';
import { askSeafoodAssistantWithContext, AIAppContext, AIChatTurn } from '../../services/aiService';

interface SmartAIAssistantProps {
  role: UserRole;
  user: UserProfile;
  shipments: Shipment[];
  orders: PurchaseOrder[];
  batches?: CatchBatch[];
  sellerOrders?: SellerOrder[];
  currentSection?: string;
  onNavigate?: (section: string) => void;
}

export const SmartAIAssistant: React.FC<SmartAIAssistantProps> = ({
  role,
  user,
  shipments,
  orders,
  batches = [],
  sellerOrders = [],
  currentSection = 'assistant',
  onNavigate
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Role-specific tailored opening message
    if (role === 'seller') {
      return [
        {
          id: 'init-seller',
          sender: 'assistant',
          text: `Halo ${user.name}! Saya SerenAgri Fishery Export Copilot (didukung Gemini & Serenade Data). 

Saya telah memuat parameter data live operasional perikanan Anda:
• **${batches.length} Lot Tangkapan** di cold storage (WPP 711 Natuna & Kepri)
• **${sellerOrders.length} Pesanan Ekspor Singapura** (Jurong Fishery Port & Clarke Quay)
• **Parameter Karantina BKIPM & SFA Singapore**

Kita bisa berdiskusi mengenai alur aplikasi, strategi harga ekspor, penyelesaian dokumen karantina digital, maupun pemantauan armada reefer. Ada yang ingin Anda diskusikan?`,
          timestamp: 'Baru saja',
          suggestedActions: [
            'Jelaskan alur aplikasi untuk eksportir dari awal sampai akhir',
            'Berapa potensi keuntungan ekspor Kerapu Cantang vs Tuna ke Jurong?',
            'Bagaimana cara mendaftar batch tangkapan baru dan cetak QR seal?',
            'Cek status kepatuhan karantina BKIPM untuk pesanan Singapura'
          ]
        }
      ];
    } else if (role === 'logistics') {
      const criticalShipment = shipments.find(s => s.alerts && s.alerts.length > 0);
      return [
        {
          id: 'init-logistics',
          sender: 'assistant',
          text: `Selamat bertugas ${user.name}! Saya SerenAgri Cold-Chain & Maritime Operations Officer (didukung Gemini & Serenade Data).

Status telemetri live yang saya pantau:
• **${shipments.length} Armada Kontainer Reefer IoT** di perairan Indonesia ⇄ Singapura
• **Peringatan Kritis**: ${criticalShipment ? `Kontainer ${criticalShipment.containerId} mengalami anomali suhu di ${criticalShipment.alerts[0]?.message.includes('Karimata') ? 'Selat Karimata' : 'rute maritim'}` : 'Seluruh armada dalam parameter suhu normal'}
• **Model Kerusakan Mikrobial**: Prediksi TVB-N & persamaan Arrhenius aktif

Silakan tanyakan tindak lanjut anomali suhu, strategi rerouting penyelamatan kargo, alur kerja sistem, atau kliring dokumen SFA!`,
          timestamp: 'Baru saja',
          suggestedActions: [
            'Bagaimana solusi penanganan anomali suhu NSTR-452109-8 di Selat Karimata?',
            'Jelaskan alur kerja monitoring telemetri IoT dan kompresor reefer',
            'Bagaimana protokol penyelamatan muatan (dynamic salvage) di Pulau Batam?',
            'Berapa ton food waste yang berhasil dicegah sistem kuartal ini?'
          ]
        }
      ];
    } else {
      // Buyer role
      return [
        {
          id: 'init-buyer',
          sender: 'assistant',
          text: `Halo ${user.name}! Saya SerenAgri Seafood Procurement & Quality Intelligence Advisor (didukung Gemini & Serenade Data).

Parameter pasar dan rantai pasok live Singapura:
• **${orders.length} Kontrak PO Aktif** koridor Indonesia ⇄ Singapura
• **Indeks Kesegaran QIM Rata-rata**: 1.8 / 20 (Grade Prima Freshly Landed)
• **Prediksi Permintaan**: Lonjakan pesanan restoran akhir pekan di East Coast & Jurong

Kita bisa mendiskusikan perkiraan harga komoditas, alur sistem pemesanan, atau mitigasi risiko kualitas pengiriman yang sedang berlayar!`,
          timestamp: 'Baru saja',
          suggestedActions: [
            'Jelaskan alur aplikasi untuk Buyer dari pemesanan hingga penerimaan',
            'Bagaimana status pengiriman Yellowfin Tuna SHP-SG02 saat ini?',
            'Analisis tren lonjakan permintaan Kerapu Cantang akhir pekan ini',
            'Bagaimana skor QIM mempengaruhi sisa masa simpan di retail FairPrice?'
          ]
        }
      ];
    }
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContextParams, setShowContextParams] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Context bundle passed directly to Gemini API
  const appContext: AIAppContext = {
    role,
    user,
    shipments,
    orders,
    batches,
    sellerOrders,
    currentSection
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!queryText) setInput('');
    setIsTyping(true);

    // Convert ChatMessage[] to AIChatTurn[] for conversation history
    const history: AIChatTurn[] = newMessages.map(m => ({
      id: m.id,
      sender: m.sender,
      text: m.text,
      timestamp: m.timestamp
    }));

    try {
      const response = await askSeafoodAssistantWithContext(textToSend, appContext, history);

      // Extract dynamic suggested follow-ups based on the conversation
      let followUps: string[] | undefined = undefined;
      const lowerResp = response.toLowerCase();
      const lowerQuery = textToSend.toLowerCase();

      if (lowerQuery.includes('karimata') || lowerQuery.includes('nstr') || lowerResp.includes('karimata')) {
        followUps = [
          'Apakah suhu kontainer sudah mulai turun?',
          'Berapa sisa masa simpan tuna sashimi ini saat tiba di Pasir Panjang?',
          'Buka halaman Cold-Chain Telemetry untuk melihat grafik live'
        ];
      } else if (lowerQuery.includes('alur') || lowerResp.includes('alur')) {
        followUps = [
          'Bisa jelaskan detail integrasi dokumen BKIPM dengan SFA TradeNet?',
          'Bagaimana cara kerja algoritma pencegahan food waste?',
          'Tunjukkan diagram alir simulasi rantai pasok (Supply Chain Diagram)'
        ];
      } else if (lowerQuery.includes('margin') || lowerQuery.includes('harga') || lowerResp.includes('arbitrase')) {
        followUps = [
          'Berapa perbandingan biaya express barge vs kapal kargo reguler?',
          'Spesies ikan apa yang margin ekspornya paling tinggi minggu ini?',
          'Buka AI Pricing Optimizer'
        ];
      } else if (lowerQuery.includes('batch') || lowerResp.includes('batch')) {
        followUps = [
          'Bagaimana standar penentuan skor QIM (Quality Index Method)?',
          'Bagaimana cara mendispatch batch ini ke buyer Singapura?',
          'Buka menu Catch Lots & Batches'
        ];
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: followUps
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('[SmartAIAssistant] Error sending message:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Maaf, terjadi kendala saat menghubungkan ke mesin kecerdasan Gemini. Silakan coba kembali atau ajukan pertanyaan lainnya.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'assistant',
        text: `Percakapan telah direset. Saya siap berdiskusi kembali mengenai operasional, alur aplikasi, maupun data rantai dingin Indonesia ⇄ Singapura. Apa yang ingin Anda diskusikan?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'Jelaskan alur aplikasi dari awal sampai akhir',
          'Cek status shipment dan anomali suhu terkini',
          'Bagaimana cara ekspor hasil laut ke Singapura?'
        ]
      }
    ]);
  };

  // Color scheme by persona
  const theme = {
    buyer: {
      accent: 'teal',
      badgeBg: 'bg-teal-50 border-teal-200 text-teal-800',
      btnBg: 'bg-teal-600 hover:bg-teal-700',
      headerBg: 'bg-teal-600',
      userBubble: 'bg-teal-600 text-white',
      assistantIcon: ShoppingBag,
      roleName: 'Buyer Procurement Copilot'
    },
    seller: {
      accent: 'emerald',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700',
      headerBg: 'bg-emerald-600',
      userBubble: 'bg-emerald-600 text-white',
      assistantIcon: Store,
      roleName: 'Fishery Export Intelligence Copilot'
    },
    logistics: {
      accent: 'sky',
      badgeBg: 'bg-sky-50 border-sky-200 text-sky-800',
      btnBg: 'bg-sky-600 hover:bg-sky-700',
      headerBg: 'bg-sky-600',
      userBubble: 'bg-sky-600 text-white',
      assistantIcon: Truck,
      roleName: 'Maritime Fleet & Cold-Chain Copilot'
    }
  }[role];

  // Quick discussion categories
  const discussionTopics = [
    { label: '🗺️ Alur Aplikasi', query: 'Jelaskan alur aplikasi SereSeaShip Guard dari awal sampai akhir dan bagaimana semua role saling terhubung' },
    { label: '🚢 Status Shipment Live', query: 'Bagaimana status seluruh pengiriman kapal di Selat Singapura, Selat Malaka, dan Selat Karimata?' },
    { label: '🚨 Mitigasi Selat Karimata', query: 'Bagaimana analisis dan solusi penanganan suhu kontainer NSTR-452109-8 di Selat Karimata?' },
    { label: '📑 Karantina BKIPM & SFA', query: 'Bagaimana prosedur kliring karantina BKIPM dan SFA Singapore TradeNet untuk ekspor ikan?' },
    { label: '💰 Arbitrase Harga Jurong', query: 'Berapa margin keuntungan ekspor hasil laut ke Singapura hari ini dibandingkan biaya pendaratan di Indonesia?' }
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-130px)] flex flex-col justify-between">
      {/* Top Header & Context Parameters Inspector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shrink-0 overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${theme.headerBg} text-white flex items-center justify-center shadow-sm`}>
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  {theme.roleName}
                </h2>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium border border-slate-200">
                  Gemini Flash AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                AI Asisten Multi-Turn terlatih konteks operasional Indonesia ⇄ Singapura • Created by Serenade Data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowContextParams(!showContextParams)}
              className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors font-medium ${
                showContextParams
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Lihat parameter data operasional yang dimasukkan ke konteks Gemini"
            >
              <Database className="w-3.5 h-3.5 text-teal-500" />
              <span>Parameter Konteks Live ({shipments.length} shp, {batches.length} batch)</span>
              {showContextParams ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={handleResetChat}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Reset Percakapan"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Live Context Parameters Panel */}
        {showContextParams && (
          <div className="bg-slate-50 border-t border-slate-200 p-4 text-xs space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Live Context Parameters Injected into Gemini Prompt:
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Model: gemini-3.8-flash / gemini-2.5-flash
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-slate-600">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
                  <Ship className="w-3.5 h-3.5 text-sky-600" />
                  Shipments ({shipments.length})
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  {shipments.map(s => (
                    <div key={s.id} className="truncate">
                      • {s.containerId}: {s.currentTemp}°C ({s.species})
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-emerald-600" />
                  Catch Lots ({batches.length})
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  {batches.slice(0, 3).map(b => (
                    <div key={b.id} className="truncate">
                      • {b.batchNumber}: {b.availableKg}kg {b.species}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Regulasi & Karantina
                </div>
                <div className="text-[11px] text-slate-600">
                  • BKIPM HACCP e-HC Grade A<br />
                  • SFA TradeNet Singapore<br />
                  • TVB-N & Histamine limits
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  Trade Corridors
                </div>
                <div className="text-[11px] text-slate-600">
                  • Batam ⇄ Jurong Port (2h 45m)<br />
                  • Jakarta ⇄ Pasir Panjang (36h)<br />
                  • Belawan ⇄ Selat Malaka
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Discussion Topic Starters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Topik Diskusi Cepat:
        </span>
        {discussionTopics.map((topic, i) => (
          <button
            key={i}
            onClick={() => handleSend(topic.query)}
            disabled={isTyping}
            className="text-xs bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm whitespace-nowrap transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>{topic.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-sm">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className={`w-8 h-8 rounded-xl ${theme.badgeBg} flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? `${theme.userBubble} rounded-br-none font-medium`
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-2">
                    {msg.text}
                  </div>
                </div>

                <div className={`flex items-center gap-2 text-[11px] text-slate-400 px-1 ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Suggested Follow-up chips (Nyambung ngobrolnya) */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, i) => {
                      const isNavAction = action.startsWith('Buka ');
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (isNavAction && onNavigate) {
                              if (action.includes('Cold-Chain')) onNavigate('coldchain');
                              else if (action.includes('Pricing')) onNavigate('pricing');
                              else if (action.includes('Catch Lots')) onNavigate('inventory');
                              else if (action.includes('Diagram')) onNavigate('lab');
                              else if (action.includes('Tracking')) onNavigate('tracking');
                            } else {
                              handleSend(action);
                            }
                          }}
                          disabled={isTyping}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1.5 shadow-2xs ${
                            isNavAction
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200 font-semibold'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isNavAction ? <ExternalLink className="w-3 h-3 text-amber-600" /> : <Sparkles className="w-3 h-3 text-slate-400" />}
                          <span>{action}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3">
            <div className={`w-8 h-8 rounded-xl ${theme.badgeBg} flex items-center justify-center shrink-0`}>
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-600 flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
              <span>Gemini sedang menganalisis riwayat obrolan & parameter operasional...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            role === 'seller'
              ? 'Tanya ekspor, alur aplikasi, sertifikat BKIPM, atau harga pasar Jurong...'
              : role === 'logistics'
              ? 'Tanya status kapal, mitigasi suhu Selat Karimata, kompresor reefer...'
              : 'Tanya pengadaan ikan, skor kesegaran QIM, tren demand restoran Singapura...'
          }
          disabled={isTyping}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:opacity-60 transition-all placeholder:text-slate-400"
        />

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className={`${theme.btnBg} text-white px-4 sm:px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm`}
        >
          <span>Kirim</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
