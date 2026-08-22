"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";

interface Bubble {
  from: "bot" | "user";
  text: string;
}

const TOPICS: { label: string; icon: "users" | "heart" | "handshake" | "shopping-bag"; q: string; a: string }[] = [
  {
    label: "Volunteering",
    icon: "users",
    q: "How can I volunteer?",
    a: "Wonderful! We welcome skills of every kind — teaching, health, logistics, design and more. Head to Get Involved → Volunteer and fill the short application; our team responds within a few days.",
  },
  {
    label: "Donating",
    icon: "heart",
    q: "How do donations work?",
    a: "You can give once or monthly, to a project of your choice, on our Donate page. Online payments (including M-Pesa) are being connected — for now we record your intention and complete the gift securely with you personally.",
  },
  {
    label: "Partnerships",
    icon: "handshake",
    q: "We're a company — how do we partner?",
    a: "We design corporate partnerships around shared goals and transparent reporting. Email partnerships@isharacharity.org or start from Get Involved → Partner With Us.",
  },
  {
    label: "Shop orders",
    icon: "shopping-bag",
    q: "How do shop orders work?",
    a: "Pick an item in the Shop, place your order, and our team confirms availability plus delivery details by email — you pay only after confirmation. Every purchase supports our programs.",
  },
];

export function FloatingChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([
    {
      from: "bot",
      text: "Jambo! Welcome to Ishara Charity. Pick a topic below or send us a message — a real person reads everything.",
    },
  ]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [bubbles, open]);

  if (pathname.startsWith("/admin")) return null;

  function addTopic(topic: (typeof TOPICS)[number]) {
    setBubbles((b) => [...b, { from: "user", text: topic.q }, { from: "bot", text: topic.a }]);
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = message.trim();
    if (!text || sending) return;
    setSending(true);
    setBubbles((b) => [...b, { from: "user", text }]);
    setMessage("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: text, page: pathname }),
      });
      if (!res.ok) throw new Error();
      setBubbles((b) => [
        ...b,
        {
          from: "bot",
          text: email
            ? "Asante sana! Your message has reached our team — we'll reply to your email shortly."
            : "Asante sana! Your message has reached our team. Leave your email with your next message if you'd like a reply.",
        },
      ]);
    } catch {
      setBubbles((b) => [
        ...b,
        {
          from: "bot",
          text: "Sorry — the message couldn't be sent right now. Please try again or email info@isharacharity.org.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-navy-100 transition-all duration-300 sm:right-6",
          open ? "visible translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0",
        )}
        role="dialog"
        aria-label="Chat with Ishara Charity"
        aria-hidden={!open}
      >
        <div className="flex items-center gap-3 bg-navy-950 px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-navy-950">
            <Icon name="send" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-semibold !text-white">Hope Support</p>
            <p className="text-xs !text-gold-300">We usually reply within a few hours</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 !text-white hover:bg-white/20"
          >
            <Icon name="close" size={15} />
          </button>
        </div>

        <div ref={scrollRef} className="max-h-[46vh] min-h-[220px] space-y-3 overflow-y-auto bg-sand px-4 py-4">
          {bubbles.map((b, i) => (
            <div key={i} className={cn("flex", b.from === "user" ? "justify-end" : "justify-start")}>
              <p
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  b.from === "user"
                    ? "rounded-br-md bg-navy-900 !text-white"
                    : "rounded-bl-md border border-navy-100 bg-white !text-navy-800 shadow-card",
                )}
              >
                {b.text}
              </p>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <p className="rounded-2xl rounded-bl-md border border-navy-100 bg-white px-3.5 py-2 text-sm !text-navy-400 shadow-card">
                Sending…
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {TOPICS.map((t) => (
              <button
                key={t.label}
                onClick={() => addTopic(t)}
                className="chip border border-navy-200 bg-white !text-navy-700 shadow-card transition-colors hover:border-gold-400 hover:!text-gold-800"
              >
                <Icon name={t.icon} size={13} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={send} className="space-y-2 border-t border-navy-100 bg-white px-4 py-3">
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp-field" />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (optional)"
              aria-label="Your name"
              maxLength={120}
              className="input !py-2 text-xs"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              aria-label="Your email for a reply"
              type="email"
              maxLength={200}
              className="input !py-2 text-xs"
            />
          </div>
          <div className="flex items-end gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message…"
              aria-label="Your message"
              rows={2}
              maxLength={2000}
              className="input min-h-0 flex-1 !py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={sending || !message.trim()}
              aria-label="Send message"
              className="btn-primary h-10 w-10 shrink-0 !px-0"
            >
              <Icon name="send" size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
        className={cn(
          "fixed bottom-5 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gold-400 text-navy-950 shadow-lift transition-all duration-300 hover:scale-105 sm:right-6",
          open && "rotate-90",
        )}
      >
        <Icon name={open ? "close" : "send"} size={22} />
        {!open && (
          <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-leaf-500" />
        )}
      </button>
    </>
  );
}
