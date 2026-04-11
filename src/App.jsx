import { useState } from "react";
import ModelViewer from "./components/ModelViewer";
import "./styles.css";

function App() {
  const [query, setQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [summary, setSummary] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setSelectedAsset(null);
      setSummary("Please enter a search query.");
      setReason("");
      return;
    }

    setLoading(true);
    setSelectedAsset(null);
    setSummary("");
    setReason("");

    try {
      const response = await fetch("http://localhost:5000/api/match-asset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed.");
      }

      setSelectedAsset(data.matchedAsset || null);
      setSummary(
        data.educationalSummary || "No educational summary available."
      );
      setReason(data.reason || "No AI reasoning returned.");
    } catch (error) {
      console.error("AI request failed:", error);
      setSelectedAsset(null);
      setSummary("AI matching failed. Please check your backend.");
      setReason("");
    } finally {
      setLoading(false);
    }
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
            placeholder="Try: hard hat, helmet, head protection..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Search"}
          </button>
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

        <div className="summary-card">
          <h2>AI Reasoning</h2>
          <p>{reason || "The AI match explanation will appear here."}</p>
        </div>

        <ModelViewer modelPath={selectedAsset?.modelPath} />
      </div>
    </div>
  );
}

export default App;