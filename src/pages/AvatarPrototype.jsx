import { useMemo, useState } from "react";
import AvatarScene from "../components/AvatarScene";
import { parseAvatarCommand } from "../utils/avatarCommandParser";

const QUICK_COMMANDS = ["wave hello", "point", "walk", "idle"];
const MAX_HISTORY_ENTRIES = 6;

export default function AvatarPrototype() {
  const [command, setCommand] = useState("");
  const [result, setResult] = useState({
    action: "idle",
    explanation: "The avatar is standing in a neutral posture.",
    isFallback: false,
    confidence: 1,
    matchedKeywords: [],
    normalizedInput: "idle"
  });
  const [commandHistory, setCommandHistory] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const parsedResult = parseAvatarCommand(command);
    setResult(parsedResult);
    setCommandHistory((previous) => {
      const next = [
        {
          input: command.trim() || "(empty)",
          action: parsedResult.action,
          confidence: parsedResult.confidence,
          at: new Date().toLocaleTimeString()
        },
        ...previous
      ];
      return next.slice(0, MAX_HISTORY_ENTRIES);
    });
  };

  const handleQuickCommand = (quickCommand) => {
    setCommand(quickCommand);
    const parsedResult = parseAvatarCommand(quickCommand);
    setResult(parsedResult);
    setCommandHistory((previous) => {
      const next = [
        {
          input: quickCommand,
          action: parsedResult.action,
          confidence: parsedResult.confidence,
          at: new Date().toLocaleTimeString()
        },
        ...previous
      ];
      return next.slice(0, MAX_HISTORY_ENTRIES);
    });
  };

  const confidencePercent = useMemo(
    () => Math.round((result.confidence || 0) * 100),
    [result.confidence]
  );

  return (
    <>
      <h1>Natural Language Avatar Prototype</h1>
      <p className="subtitle">
        Enterprise-style command parsing with confidence and execution history.
      </p>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder='Try: "wave hello", "point", "walk", or "idle"'
          value={command}
          onChange={(event) => setCommand(event.target.value)}
        />
        <button type="submit">Run Command</button>
      </form>

      <div className="chip-row">
        {QUICK_COMMANDS.map((quickCommand) => (
          <button
            key={quickCommand}
            type="button"
            className={`chip ${result.action === parseAvatarCommand(quickCommand).action ? "chip-active" : ""}`}
            onClick={() => handleQuickCommand(quickCommand)}
          >
            {quickCommand}
          </button>
        ))}
      </div>

      <div className="result-card">
        <h2>Detected Action</h2>
        <p>
          <strong>{result.action}</strong>
        </p>
        <p className="avatar-meta">
          Confidence: <strong>{confidencePercent}%</strong>
        </p>
        {result.matchedKeywords.length > 0 ? (
          <p className="avatar-meta">
            Matched terms: {result.matchedKeywords.join(", ")}
          </p>
        ) : null}
        {result.isFallback ? (
          <p className="avatar-note">
            Command not recognized. Falling back to idle.
          </p>
        ) : null}
      </div>

      <div className="summary-card">
        <h2>Explanation</h2>
        <p>{result.explanation}</p>
      </div>

      <div className="summary-card">
        <h2>Known MVP Limitations</h2>
        <p>
          This prototype uses a primitive avatar and deterministic parsing for
          speed and reliability. A production version would use a rigged avatar
          and richer intent understanding.
        </p>
      </div>

      <div className="summary-card">
        <div className="history-header">
          <h2>Command History</h2>
          <button
            type="button"
            className="viewer-reset-button"
            onClick={() => setCommandHistory([])}
            disabled={commandHistory.length === 0}
          >
            Clear
          </button>
        </div>
        {commandHistory.length === 0 ? (
          <p>No commands executed yet.</p>
        ) : (
          <div className="command-history-list">
            {commandHistory.map((entry, index) => (
              <div className="command-history-item" key={`${entry.at}-${index}`}>
                <span className="history-input">"{entry.input}"</span>
                <span className="history-action">{entry.action}</span>
                <span className="history-confidence">
                  {Math.round(entry.confidence * 100)}%
                </span>
                <span className="history-time">{entry.at}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <AvatarScene action={result.action} />
    </>
  );
}
