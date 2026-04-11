import { assets } from "../data/assets.js";

export function matchAsset(query) {
  if (!query || !query.trim()) return null;

  const q = query.toLowerCase().trim();

  let bestMatch = null;
  let bestScore = 0;

  for (const asset of assets) {
    let score = 0;

    // Exact name match (strong signal)
    if (asset.name.toLowerCase().includes(q)) {
      score += 5;
    }

    // Keyword matches
    for (const keyword of asset.keywords) {
      const k = keyword.toLowerCase();

      if (k.includes(q)) score += 3;
      if (q.includes(k)) score += 2;
    }

    // Fuzzy word match
    const words = q.split(" ");
    for (const word of words) {
      if (asset.name.toLowerCase().includes(word)) {
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