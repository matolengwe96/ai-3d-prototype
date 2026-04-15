import { useState } from "react";
import AvatarScene from "../components/AvatarScene";

function parseAvatarCommand(inputText) {
  const normalized = inputText.toLowerCase();

  if (normalized.includes("wave")) {
    return {
      action: "wave",
      explanation: "The avatar is greeting the learner with a wave."
    };
  }

  if (normalized.includes("point")) {
    return {
      action: "point",
      explanation: "The avatar is pointing to indicate focus or direction."
    };
  }

  if (normalized.includes("walk") || normalized.includes("move")) {
    return {
      action: "walk",
      explanation: "The avatar is demonstrating movement through the scene."
    };
  }

  return {
    action: "idle",
    explanation: "The avatar is standing in a neutral posture."
  };
}

export default function AvatarPrototype() {
  const [command, setCommand] = useState("");
  const [result, setResult] = useState({
    action: "idle",
    explanation: "The avatar is standing in a neutral posture."
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setResult(parseAvatarCommand(command));
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

      <div className="result-card">
        <h2>Detected Action</h2>
        <p>
          <strong>{result.action}</strong>
        </p>
      </div>

      <div className="summary-card">
        <h2>Explanation</h2>
        <p>{result.explanation}</p>
      </div>

      <AvatarScene action={result.action} />
    </>
  );
}
