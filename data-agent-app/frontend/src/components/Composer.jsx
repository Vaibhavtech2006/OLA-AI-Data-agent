import { useRef, useState } from "react";

export default function Composer({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const taRef = useRef(null);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (taRef.current) taRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  return (
    <div className="composer">
      <div className="composer-box">
        <textarea
          ref={taRef}
          rows={1}
          value={value}
          placeholder="Ask for a query, or describe an extract/transform job…"
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        <button className="send-btn" onClick={submit} disabled={!value.trim() || disabled} aria-label="Send">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h11M8 2l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="composer-hint">Enter to send · Shift+Enter for a new line · routes automatically to SQL or ETL</div>
    </div>
  );
}
