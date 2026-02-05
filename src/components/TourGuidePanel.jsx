import { useState } from 'react';
import { askTourGuide } from '../lib/tourGuideAgent';

export default function TourGuidePanel({ context }) {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim() || loading) return;
    setLoading(true);
    try {
      const reply = await askTourGuide(input, context);
      setChat((prev) => [
        ...prev,
        { role: 'user', text: input },
        { role: 'assistant', text: reply }
      ]);
      setInput('');
    } catch (err) {
      setChat((prev) => [...prev, { role: 'system', text: 'Error contacting guide.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow-md h-full flex flex-col" aria-live="polite">
      <h2 className="text-xl font-bold mb-2">🗺️ Ask Your Tour Guide</h2>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4" role="log" aria-label="Tour guide conversation">
        {chat.map((msg, idx) => (
          <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div className="inline-block px-3 py-2 rounded bg-gray-100">{msg.text}</div>
          </div>
        ))}
        {loading && <p className="italic text-sm text-gray-400">Sunny is thinking...</p>}
      </div>
      <div className="flex gap-2">
        <label htmlFor="tour-guide-input" style={{ position: 'absolute', left: '-9999px' }}>
          Ask your tour guide
        </label>
        <input
          id="tour-guide-input"
          className="border rounded p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about beaches, events, or history..."
          aria-label="Ask your tour guide"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading || !input.trim()}
        >
          Ask
        </button>
      </div>
    </div>
  );
}
