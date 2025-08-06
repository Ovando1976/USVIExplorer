"use client";

import { useState } from "react";
import { askTourGuide } from "../lib/tourGuideAgent";

export default function TourGuidePanel({ context }) {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const reply = await askTourGuide(input, context);
      setChat((prev) => [
        ...prev,
        { role: "user", text: input },
        { role: "assistant", text: reply },
      ]);
      setInput("");
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "system", text: "Error contacting guide." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold mb-2">🗺️ Ask Your Tour Guide</h2>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {chat.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
            <div className="inline-block px-3 py-2 rounded bg-gray-100">
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <p className="italic text-sm text-gray-400">Sunny is thinking...</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="border rounded p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about beaches, events, or history..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
