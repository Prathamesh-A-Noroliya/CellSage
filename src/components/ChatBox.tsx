import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, Sparkles, MessageSquare } from "lucide-react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string | React.ReactNode;
}

interface ChatBoxProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  isLoading: boolean;
  suggestedQuery?: string;
}

const SUGGESTIONS = [
  "Why did Batch EV-1024 fail capacity testing?",
  "What caused high internal resistance in EV-1023?",
  "Which SOP was violated in EV-1018?",
  "Generate report for Batch EV-1024",
];

export default function ChatBox({ messages, onSend, isLoading, suggestedQuery }: ChatBoxProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 animate-pulse-soft"
              style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.1))", border: "1px solid rgba(59,130,246,0.2)" }}>
              <Bot size={26} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">AI Investigation Workspace</h3>
            <p className="text-sm text-muted-foreground mb-2 max-w-sm">
              Ask manufacturing failure questions and receive evidence-backed root-cause analysis.
            </p>
            <p className="text-xs text-muted-foreground mb-6 max-w-xs">
              Start an investigation by asking about a failed EV battery batch.
            </p>
            {/* Agent pipeline */}
            <div className="flex items-center gap-2 mb-6 flex-wrap justify-center">
              {["Query Parsed", "Evidence Retrieved", "Sensor Checked", "History Matched", "Root Cause Generated"].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium"
                    style={{ background: "rgba(59,130,246,0.08)", color: "#93C5FD", border: "1px solid rgba(59,130,246,0.15)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {step}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-3 h-px" style={{ background: "rgba(59,130,246,0.2)" }} />
                  )}
                </div>
              ))}
            </div>
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  className="text-xs px-3 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8" }}
                  onClick={() => onSend(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 msg-enter ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            style={{ animationDelay: "0.05s" }}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-1"
                style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.1))", border: "1px solid rgba(59,130,246,0.2)" }}>
                <Sparkles size={13} className="text-blue-400" />
              </div>
            )}
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user" ? "text-white" : "text-foreground"
              }`}
              style={{
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #3B82F6, #2563EB)"
                  : "rgba(255,255,255,0.03)",
                border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
                boxShadow: msg.role === "user" ? "0 4px 16px rgba(59,130,246,0.3)" : "none",
              }}
            >
              {typeof msg.content === "string" ? msg.content : msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-1"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <User size={13} className="text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start msg-enter">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(6,182,212,0.1))", border: "1px solid rgba(59,130,246,0.2)" }}>
              <Sparkles size={13} className="text-blue-400" />
            </div>
            <div className="rounded-2xl px-4 py-3 text-sm flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
              <span className="text-muted-foreground text-xs">Analyzing manufacturing evidence...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 glass-nav">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <MessageSquare size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              placeholder="Ask an investigation question, e.g. Why did Batch EV-1024 fail capacity testing?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>
          <button
            className="px-5 py-3 rounded-xl text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50 btn-glow"
            style={{ background: "linear-gradient(135deg, #3B82F6, #2563EB)" }}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send size={14} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
