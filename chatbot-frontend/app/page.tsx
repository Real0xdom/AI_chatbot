"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const NOTICE_TIMEOUT_MS = 180000;

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowNotice(false);
    }, NOTICE_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    const userMessage: Message = { role: "user", content: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmedInput }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            typeof data.reply === "string" && data.reply.trim()
              ? data.reply
              : "I could not generate a response just now.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "The chatbot is taking longer than expected to respond. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleComposerKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <main className="chat-shell">
      <section className="chat-app">
        {showNotice ? (
          <div className="startup-notice" role="status" aria-live="polite">
            <div>
              <p className="startup-notice__eyebrow">Please note</p>
              <p className="startup-notice__text">
                The chatbot backend may take 50 seconds to 1 minute to start after
                a reload or first visit, so replies can be delayed by 50 seconds or
                more.
              </p>
            </div>
            <button
              type="button"
              className="startup-notice__dismiss"
              onClick={() => setShowNotice(false)}
              aria-label="Dismiss startup notice"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <header className="chat-header">
          <div>
            <p className="chat-header__eyebrow">AI Assistant</p>
            <h1>How can I help today?</h1>
          </div>
          <p className="chat-header__caption">
            Frontier AI
          </p>
        </header>

        <section className="chat-window" aria-label="Chat conversation">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__badge">New chat</div>
              <h2>Start a conversation</h2>
              <p>
                Ask anything to begin. Your messages will appear here in a clean,
                readable thread.
              </p>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((msg, index) => (
                <article
                  key={`${msg.role}-${index}-${msg.content}`}
                  className={`message-card message-card--${msg.role}`}
                >
                  <div className="message-card__avatar" aria-hidden="true">
                    {msg.role === "user" ? "Y" : "AI"}
                  </div>
                  <div className="message-card__content">
                    <p className="message-card__label">
                      {msg.role === "user" ? "You" : "Assistant"}
                    </p>
                    <p>{msg.content}</p>
                  </div>
                </article>
              ))}

              {isSending ? (
                <article className="message-card message-card--assistant message-card--loading">
                  <div className="message-card__avatar" aria-hidden="true">
                    AI
                  </div>
                  <div className="message-card__content">
                    <p className="message-card__label">Assistant</p>
                    <div className="typing-dots" aria-label="Assistant is typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </article>
              ) : null}
              <div ref={messagesEndRef} />
            </div>
          )}
        </section>

        <form className="composer" onSubmit={sendMessage}>
          <label className="sr-only" htmlFor="chat-message">
            Type your message
          </label>
          <textarea
            id="chat-message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleComposerKeyDown}
            placeholder="Message the assistant..."
            className="composer__input"
            rows={1}
          />
          <button
            type="submit"
            className="composer__send"
            disabled={!input.trim() || isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
      </section>
    </main>
  );
}
