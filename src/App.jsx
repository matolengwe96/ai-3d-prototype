import { useState } from "react";
import ModelViewer from "./components/ModelViewer";
import AvatarPrototype from "./pages/AvatarPrototype";
import { assets } from "./data/assets";
import "./styles.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-3d-backend-pou6.onrender.com"; // fallback

function AssetPrototypePanel() {
  const [query, setQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [summary, setSummary] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const searchWithQuery = async (searchText) => {
    if (!searchText.trim()) {
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
      const response = await fetch(`${API_URL}/api/match-asset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: searchText })
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
      setSummary(
        "AI matching failed. Backend may be sleeping (Render free tier)."
      );
      setReason("");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await searchWithQuery(query);
  };

  const handleQuickSelect = async (asset) => {
    setQuery(asset.name);
    await searchWithQuery(asset.name);
  };

  return (
    <>
      <h1>AI 3D Asset Prototype</h1>
      <p className="subtitle">
        Type an object name to find a matching training asset.
      </p>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Try: helmet, safety vest, gloves, fire extinguisher..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Search"}
        </button>
      </form>

      <div className="chip-row">
        {assets.map((asset) => (
          <button
            key={asset.id}
            type="button"
            className={`chip ${selectedAsset?.id === asset.id ? "chip-active" : ""}`}
            onClick={() => handleQuickSelect(asset)}
            disabled={loading}
          >
            {asset.name}
          </button>
        ))}
      </div>

      <div className="result-card">
        <h2>Selected Asset</h2>
        {selectedAsset ? (
          <>
            <p><strong>Name:</strong> {selectedAsset.name}</p>
            <p><strong>Category:</strong> {selectedAsset.category}</p>
            <p><strong>Model Path:</strong> {selectedAsset.modelPath}</p>
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
    </>
  );
}

function App() {
  const [activePrototype, setActivePrototype] = useState("asset");

  return (
    <div className="app">
      <div className="panel">
        <div className="prototype-switcher">
          <button
            type="button"
            className={`switcher-button ${
              activePrototype === "asset" ? "switcher-button-active" : ""
            }`}
            onClick={() => setActivePrototype("asset")}
          >
            Asset Prototype
          </button>
          <button
            type="button"
            className={`switcher-button ${
              activePrototype === "avatar" ? "switcher-button-active" : ""
            }`}
            onClick={() => setActivePrototype("avatar")}
          >
            Avatar Prototype
          </button>
        </div>

        {activePrototype === "asset" ? <AssetPrototypePanel /> : <AvatarPrototype />}
      </div>
    </div>
  );
}

export default App;