import React, { useState } from 'react';
import { askSeafoodAssistant } from '../../services/aiService';
import { ChatMessage } from '../../types';
import { Bot, Send, Sparkles, User, RefreshCw, ShoppingBag } from 'lucide-react';

export const BuyerAIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'assistant',
      text: 'Hello Sarah! I am your SereSeaShip Guard AI Seafood Procurement Advisor. I can analyze seasonal species demand, evaluate cold-chain compliance across suppliers, and suggest optimal purchase timings to minimize price volatility and seafood waste. How can I assist your purchasing strategy today?',
      timestamp: 'Just now',
      suggestedActions: [
        'Analyze Atlantic Salmon price trend for Q4',
        'Assess quality risk for in-transit Yellowfin Tuna',
        'Compare supplier reliability: FjordPelagic vs Bering Sound',
        'How does QIM score impact retail shelf life?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    try {
      const response = await askSeafoodAssistant(textToSend, 'buyer');
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Unable to reach the seafood intelligence engine. Please retry your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              AI Seafood Procurement Copilot
            </h2>
            <p className="text-xs text-slate-500">
              Grounded on cold-chain IoT telemetry, global harvest quotas, and FAO supply models
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="hidden sm:inline font-mono">Gemini 2.5 Flash</span>
        </div>
      </div>

      {/* Chat Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-xl space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                <div className={`flex items-center gap-2 text-[11px] text-slate-400 px-1 ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Suggested Follow-up chips if provided */}
                {msg.suggestedActions && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors text-left"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-500 flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing market indices & cold-chain parameters...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about seafood price trends, species seasonality, QIM freshness..."
          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span>Ask Copilot</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
