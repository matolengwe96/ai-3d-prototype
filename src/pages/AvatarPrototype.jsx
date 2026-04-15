import { useState } from "react";
import AvatarScene from "../components/AvatarScene";

function parseAvatarCommand(inputText) {
  const normalized = inputText.toLowerCase();

  if (normalized.includes("wave")) {
    return {
      action: "wave",
      explanation: "The avatar is greeting the learner with a wave.",
      isFallback: false
    };
  }

  if (normalized.includes("point")) {
    return {
      action: "point",
      explanation: "The avatar is pointing to indicate focus or direction.",
      isFallback: false
    };
  }

  if (normalized.includes("walk") || normalized.includes("move")) {
    return {
      action: "walk",
      explanation: "The avatar is demonstrating movement through the scene.",
      isFallback: false
    };
  }

  return {
    action: "idle",
    explanation: "The avatar is standing in a neutral posture.",
    isFallback: true
  };
}

const QUICK_COMMANDS = ["wave hello", "point", "walk", "idle"];

export default function AvatarPrototype() {
  const [command, setCommand] = useState("");
  const [result, setResult] = useState({
    action: "idle",
    explanation: "The avatar is standing in a neutral posture.",
    isFallback: false
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setResult(parseAvatarCommand(command));
  };

  const handleQuickCommand = (quickCommand) => {
    setCommand(quickCommand);
    setResult(parseAvatarCommand(quickCommand));
  };

  return (
    <>
      <h1>Natural Language Avatar Prototype</h1>
      <p className="subtitle">
        Enter a simple command to trigger a visible avatar behavior.
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

      <AvatarScene action={result.action} />
    </>
  );
}
