import { useState } from "react";
import { matchAsset } from "./utils/matchAsset";
import { generateSummary } from "./utils/generateSummary";
import ModelViewer from "./components/ModelViewer";
import "./styles.css";

function App() {
  const [query, setQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [summary, setSummary] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const matched = matchAsset(query);
    setSelectedAsset(matched);
    setSummary(generateSummary(matched));
  };

  return (
    <div className="app">
      <div className="panel">
        <h1>AI 3D Asset Prototype</h1>
        <p className="subtitle">
          Type an object name to find a matching training asset.
        </p>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Try: hard hat, helmet, hammer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="result-card">
          <h2>Selected Asset</h2>

          {selectedAsset ? (
            <>
              <p>
                <strong>Name:</strong> {selectedAsset.name}
              </p>
              <p>
                <strong>Category:</strong> {selectedAsset.category}
              </p>
              <p>
                <strong>Model Path:</strong> {selectedAsset.modelPath}
              </p>
            </>
          ) : (
            <p>No asset selected yet.</p>
          )}
        </div>

        <div className="summary-card">
          <h2>Educational Summary</h2>
          <p>{summary || "Your summary will appear here after search."}</p>
        </div>

        <ModelViewer modelPath={selectedAsset?.modelPath} />
      </div>
    </div>
  );
}

export default App;