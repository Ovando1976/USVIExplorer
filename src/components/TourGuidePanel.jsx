import { useMemo, useState } from 'react';
import { askTourGuide } from '../lib/tourGuideAgent';

const SUGGESTED_PROMPTS = [
  'What should I pack for a St. John beach day?',
  'Give me a half-day historic walking plan in Charlotte Amalie.',
  'What local food should I try near Christiansted?'
];

const INPUT_LIMIT = 220;

export default function TourGuidePanel({ context }) {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const remainingChars = INPUT_LIMIT - input.length;
  const contextSummary = useMemo(() => {
    if (!context) {
      return 'No selected location yet. Pick a map item to personalize guidance.';
    }

    return context.length > 150 ? `${context.slice(0, 150)}…` : context;
  }, [context]);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;

    setLoading(true);
    try {
      const reply = await askTourGuide(question, context);
      setChat((prev) => [
        ...prev,
        { role: 'user', text: question },
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
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handlePromptSelect(prompt) {
    setInput(prompt.slice(0, INPUT_LIMIT));
  }

  return (
    <div className="tour-guide-panel">
      <div className="tour-guide-header">
        <div>
          <h2 className="tour-guide-title">🗺️ Ask Your Tour Guide</h2>
          <p className="tour-guide-subtitle">Tap a beach marker, then ask for tips, history, or local insights.</p>
        </div>
        <button
          type="button"
          className="tour-clear-button"
          onClick={() => setChat([])}
          disabled={chat.length === 0}
        >
          Clear chat
        </button>
      </div>

      <section className="tour-context" aria-label="Current guide context">
        <strong>Current context</strong>
        <p>{contextSummary}</p>
      </section>

      <div className="tour-prompt-list" role="list" aria-label="Suggested questions">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="tour-prompt-chip"
            onClick={() => handlePromptSelect(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="tour-chat-log" role="log" aria-live="polite">
        {chat.length === 0 && (
          <p className="tour-chat-empty">Try asking: “What makes Trunk Bay special?”</p>
        )}
        {chat.map((msg, idx) => (
          <div key={`${msg.role}-${idx}`} className={`chat-row ${msg.role}`}>
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
        {loading && <p className="tour-thinking">Sunny is thinking...</p>}
      </div>

      <div className="tour-chat-compose">
        <input
          className="tour-chat-input"
          value={input}
          maxLength={INPUT_LIMIT}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about beaches, events, or history..."
          aria-label="Ask the tour guide"
        />
        <button
          onClick={handleSend}
          className="tour-chat-button"
          disabled={!input.trim() || loading}
        >
          {loading ? 'Sending...' : 'Ask'}
        </button>
      </div>
      <p className="tour-char-count" aria-live="polite">{remainingChars} characters remaining</p>
    </div>
  );
}
