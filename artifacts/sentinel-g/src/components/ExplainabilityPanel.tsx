import React, { useState, useEffect } from 'react';
import { Loader2, Send, Copy, Download } from 'lucide-react';

interface ExplanationData {
  account_id: string;
  explanation: string;
  confidence: number;
  recommended_action: string;
  evidence: string[];
  generated_at: string;
  tokens_used?: number;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  evidence?: string[];
}

const ExplainabilityPanel: React.FC<{ accountId: string }> = ({ accountId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<ExplanationData | null>(null);
  const [copied, setCopied] = useState(false);

  // Load initial explanation
  useEffect(() => {
    fetchInitialExplanation();
  }, [accountId]);

  const fetchInitialExplanation = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/accounts/${accountId}/explain`);
      const data = await response.json();
      setExplanation(data);
      
      // Add initial explanation as first message
      setMessages([{
        role: 'assistant',
        content: data.explanation,
        timestamp: new Date().toISOString(),
        evidence: data.evidence
      }]);
    } catch (error) {
      console.error('Error fetching explanation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`/api/v1/accounts/${accountId}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });
      
      const data = await response.json();
      
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 rounded-lg border border-stone-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-800 to-stone-700 text-white p-4 rounded-t-lg">
        <h2 className="text-lg font-bold flex items-center gap-2">
          🤖 AI Compliance Explainer
        </h2>
        <p className="text-sm text-stone-200 mt-1">Account: {accountId}</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-amber-600 text-white rounded-br-none'
                  : 'bg-white border border-stone-300 text-stone-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              
              {/* Evidence tags for assistant messages */}
              {msg.role === 'assistant' && msg.evidence && msg.evidence.length > 0 && (
                <div className="mt-2 pt-2 border-t border-stone-200 flex flex-wrap gap-1">
                  {msg.evidence.map((tag, i) => (
                    <span key={i} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-xs mt-2 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-300 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span className="text-sm text-stone-600">Claude is analyzing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Confidence & Actions */}
      {explanation && (
        <div className="border-t border-stone-200 bg-white p-3">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <span className="text-stone-600">
                Confidence: <strong className="text-amber-600">{(explanation.confidence * 100).toFixed(0)}%</strong>
              </span>
              <span className="text-stone-600">
                Action: <strong className="text-amber-600">{explanation.recommended_action}</strong>
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(explanation.explanation)}
                className="p-1 hover:bg-stone-100 rounded"
                title="Copy explanation"
              >
                <Copy className="w-4 h-4 text-stone-600" />
              </button>
              <button
                className="p-1 hover:bg-stone-100 rounded"
                title="Export as PDF"
              >
                <Download className="w-4 h-4 text-stone-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="border-t border-stone-200 p-4 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this account..."
            className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center gap-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExplainabilityPanel;
