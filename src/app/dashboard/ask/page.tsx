'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  { icon: DollarSign, text: "Who owes me money?", color: "bg-[#9FE870]/20" },
  { icon: Users, text: "Which GCs pay fastest?", color: "bg-[#54A0FF]/20" },
  { icon: TrendingUp, text: "How's my cash flow this month?", color: "bg-[#FF9F43]/20" },
  { icon: Calendar, text: "What invoices are due this week?", color: "bg-[#FECA57]/20" },
];

export default function AskSubPaidPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = (question: string): string => {
    const q = question.toLowerCase();
    
    if (q.includes('owes') || q.includes('owed')) {
      return `**Total Owed: $40,000**\n\n1. ABC General Contractors — $20,000 (17 days overdue)\n2. Metro Builders Inc — $8,500 (due in 5 days)\n3. Smith Builders — $11,500 (due in 12 days)\n\nWould you like me to send reminders?`;
    }
    if (q.includes('fastest') || q.includes('payscore')) {
      return `**Fastest Paying GCs:**\n\n🥇 Metro Builders Inc — Avg. 18 days (PayScore: 92)\n🥈 Smith Builders — Avg. 24 days (PayScore: 87)\n🥉 Downtown Dev LLC — Avg. 28 days (PayScore: 81)\n\n⚠️ ABC General — Avg. 45 days (PayScore: 58)`;
    }
    if (q.includes('cash flow')) {
      return `**February Cash Flow**\n\n💰 Collected: $85,000\n📊 vs. January: +12%\n🔮 Predicted by month end: $116,500\n\n⚠️ Risk: $20,000 overdue from ABC General`;
    }
    if (q.includes('due')) {
      return `**Due This Week: $11,700**\n\n1. INV-002 — $8,500 (Feb 6)\n2. INV-005 — $3,200 (Feb 8)\n\n🟢 Both expected on-time`;
    }
    
    return `I can help with:\n• Who owes you money\n• Payment patterns (PayScore)\n• Cash flow analysis\n• Invoice due dates\n\nTry: "Who owes me money?"`;
  };

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: getAIResponse(msg), timestamp: new Date() }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#54A0FF] rounded-xl flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Ask SubPaid</h1>
          <p className="text-[#1a1a2e]/60 text-sm">Ask anything in plain English</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-[#1a1a2e]/10 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 bg-[#54A0FF]/20 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-[#54A0FF]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-6">Ask me anything</h3>
              <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                {suggestedQuestions.map((q, i) => (
                  <button key={i} onClick={() => handleSend(q.text)} className="flex items-center gap-3 p-3 rounded-xl bg-[#F7FBF4] border border-[#1a1a2e]/10 hover:border-[#9FE870] transition-all text-left">
                    <div className={`w-8 h-8 ${q.color} rounded-lg flex items-center justify-center`}>
                      <q.icon className="w-4 h-4 text-[#1a1a2e]" />
                    </div>
                    <span className="text-sm text-[#1a1a2e]">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-[#1a1a2e] text-white' : 'bg-[#F7FBF4] text-[#1a1a2e]'}`}>
                  <div className="whitespace-pre-wrap text-sm">{m.content}</div>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#F7FBF4] rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 text-[#54A0FF] animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-[#1a1a2e]/10">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask about invoices, payments, cash flow..."
              className="flex-1 px-4 py-3 rounded-full bg-[#F7FBF4] border border-[#1a1a2e]/10 focus:border-[#9FE870] focus:outline-none focus:ring-2 focus:ring-[#9FE870]/20"
              aria-label="Type your question"
            />
            <button
              onClick={() => handleSend()}
              className="w-12 h-12 bg-[#9FE870] rounded-full flex items-center justify-center hover:shadow-lg transition-all"
              aria-label="Send message"
            >
              <Send className="w-5 h-5 text-[#1a1a2e]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
