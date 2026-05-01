"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    const userMessage: Message = { role: "user", content: currentInput };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("${API_URL}/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong." },
      ]);
    }
  }

  return (
    <main style={{ maxWidth: "700px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>AI Chatbot</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          minHeight: "400px",
          marginBottom: "16px",
          borderRadius: "10px",
        }}
      >
        {messages.length === 0 && <p>Start the conversation...</p>}

        {messages.map((msg, i) => (
          <p key={i}>
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.content}
          </p>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 16px" }}>
          Send
        </button>
      </form>
    </main>
  );
}