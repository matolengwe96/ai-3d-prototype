import { useState } from "react";
import ModelViewer from "./components/ModelViewer";
import { assets } from "./data/assets";
import "./styles.css";

function findBestMatch(query) {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter(Boolean);

  let bestMatch = null;
  let bestScore = 0;

  for (const asset of assets) {
    let score = 0;
    const assetName = asset.name.toLowerCase();
    const assetCategory = asset.category.toLowerCase();

    if (assetName.includes(q)) {
      score += 5;
    }

    if (assetCategory.includes(q)) {
      score += 3;
    }

    for (const keyword of asset.keywords) {
      const k = keyword.toLowerCase();

      if (k === q) {
        score += 6;
      }

      if (k.includes(q) || q.includes(k)) {
        score += 3;
      }

      for (const word of words) {
        if (k.includes(word)) {
          score += 1;
        }
      }
    }

    for (const word of words) {
      if (assetName.includes(word)) {
        score += 1;
      }

      if (assetCategory.includes(word)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = asset;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

function buildFallbackReason(asset, query) {
  return `The asset "${asset.name}" was selected as the best local match for "${query}" based on its name, category, and related safety keywords.`;
}

function buildFallbackSummary(asset) {
  if (asset.summary) {
    return asset.summary;
  }

  return "This training asset was matched using the local fallback system.";
}

function App() {
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
      const response = await fetch(
        "https://ai-3d-backend-pou6.onrender.com/api/match-asset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ query: searchText })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed.");
      }

      if (!data || !data.matchedAsset) {
        throw new Error("No AI result returned.");
      }

      setSelectedAsset(data.matchedAsset);
      setSummary(
        data.educationalSummary || "No educational summary available."
      );
      setReason(
        data.reason || "Matched by AI, but no detailed reasoning was returned."
      );
    } catch (error) {
      console.error("AI request failed, using local fallback:", error);

      const fallback = findBestMatch(searchText);

      if (fallback) {
        setSelectedAsset(fallback);
        setSummary(buildFallbackSummary(fallback));
        setReason(
          `Matched using local keyword fallback because AI was unavailable. ${buildFallbackReason(
            fallback,
            searchText
          )}`
        );
      } else {
        setSelectedAsset(null);
        setSummary("No suitable training asset found for this query.");
        setReason(
          "Neither AI matching nor local fallback matching found a suitable asset."
        );
      }
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
    <div className="app">
      <div className="panel">
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
              className={`chip ${
                selectedAsset?.id === asset.id ? "chip-active" : ""
              }`}
              onClick={() => handleQuickSelect(asset)}
              disabled={loading}
            >
              {asset.name}
            </button>
          ))}
        </div>

        {loading && (
          <div className="status-card">
            <p>🔄 Finding best match...</p>
          </div>
        )}

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
          <p className="helper-text">Powered by AI + fallback matching</p>
        </div>

        <ModelViewer modelPath={selectedAsset?.modelPath} />
      </div>
    </div>
  );
}

export default App;