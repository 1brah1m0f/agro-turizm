"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STARTER_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Salam! AgroTour Azerbaijan bələdçisiyəm. Hansı bölgə və ya aqro təcrübə sizi maraqlandırır?",
};

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER_MESSAGE]);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const trimmedInput = input.trim();

  const historyPayload = useMemo(
    () => messages.filter((msg) => msg.id !== "welcome").slice(-8),
    [messages],
  );

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (position || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const margin = 16;
    const x = Math.max(margin, window.innerWidth - rect.width - margin);
    const y = Math.max(margin, window.innerHeight - rect.height - margin);
    setPosition({ x, y });
  }, [position]);

  useEffect(() => {
    if (!dragging) return undefined;

    const handleMove = (event: PointerEvent) => {
      if (!dragOffset.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const margin = 12;
      const nextX = event.clientX - dragOffset.current.x;
      const nextY = event.clientY - dragOffset.current.y;
      const maxX = window.innerWidth - rect.width - margin;
      const maxY = window.innerHeight - rect.height - margin;
      setPosition({
        x: Math.min(Math.max(margin, nextX), Math.max(margin, maxX)),
        y: Math.min(Math.max(margin, nextY), Math.max(margin, maxY)),
      });
    };

    const handleUp = () => {
      setDragging(false);
      dragOffset.current = null;
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [dragging]);

  const startDrag = (event: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    dragOffset.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    setDragging(true);
  };

  const sendMessage = async () => {
    if (!trimmedInput || loading) return;
    const userMessage: ChatMessage = { id: createId(), role: "user", content: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, history: historyPayload }),
      });
      const data = await res.json();
      const replyText = typeof data?.reply === "string" && data.reply.trim()
        ? data.reply.trim()
        : "Cavab alına bilmədi. Zəhmət olmasa yenidən cəhd edin.";
      const assistantMessage: ChatMessage = { id: createId(), role: "assistant", content: replyText };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const assistantMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: "Hazırda servisə qoşula bilmədim. Zəhmət olmasa bir az sonra yenidən cəhd edin.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-[700]",
        position ? "" : "bottom-24 right-4 md:bottom-6 md:right-6",
      )}
      style={position ? { left: position.x, top: position.y } : undefined}
    >
      {!open && (
        <button
          onPointerDown={startDrag}
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full px-4 py-3 text-white shadow-card transition-transform hover:scale-[1.02] cursor-move"
          style={{ background: "linear-gradient(135deg, #1A688E 0%, #55C841 100%)" }}
        >
          <MessageCircle size={18} />
          <span className="text-sm font-semibold">AgroTour bələdçisi</span>
        </button>
      )}

      {open && (
        <div
          className="w-[320px] sm:w-[360px] rounded-2xl overflow-hidden border border-accent/20 shadow-2xl bg-white/95 backdrop-blur"
          style={{ boxShadow: "0 18px 50px rgba(0,0,0,0.22)" }}
        >
          <div
            onPointerDown={startDrag}
            className="flex items-center justify-between px-4 py-3 text-white cursor-move"
            style={{ background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }}
          >
            <div>
              <p className="text-sm font-semibold">AgroTour Azerbaijan</p>
              <p className="text-[11px] text-white/80">Rəsmi rəqəmsal bələdçi</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              aria-label="Bağla"
            >
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} className="max-h-[360px] overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}> 
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-[#1F6B4F] text-white rounded-br-sm"
                      : "bg-[#F2F6F3] text-[#1E1E1E] rounded-bl-sm",
                  )}
                >
                  {msg.content.split("\n").map((line, idx) => (
                    <p key={`${msg.id}-${idx}`} className={idx ? "mt-1" : ""}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-xs bg-[#F2F6F3] text-[#1E1E1E]">
                  <Loader2 size={14} className="animate-spin" />
                  Cavab hazırlanır...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-accent/10 px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Məs: Quba-da arıçılıq 30 AZN-dən aşağı"
                className="flex-1 bg-white text-black border border-accent/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F6B4F]/40"
                disabled={loading}
              />
              <button
                onClick={() => void sendMessage()}
                disabled={loading || !trimmedInput}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #1A688E 0%, #55C841 100%)" }}
                aria-label="Göndər"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
