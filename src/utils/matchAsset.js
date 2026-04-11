import { assets } from "../data/assets.js";

export function matchAsset(query) {
  if (!query || !query.trim()) {
    return null;
  }

  const q = query.toLowerCase().trim();
  const words = q.split(" ").filter((word) => word.length > 2);

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
      score += 2;
    }

    for (const keyword of asset.keywords) {
      const k = keyword.toLowerCase();

      if (k.includes(q)) {
        score += 3;
      }

      if (q.includes(k)) {
        score += 2;
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