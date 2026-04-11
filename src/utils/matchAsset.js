import { assets } from "../data/assets.js";

export function matchAsset(query) {
  if (!query || !query.trim()) return null;

  const q = query.toLowerCase().trim();

  for (const asset of assets) {
    const nameMatch = asset.name.toLowerCase().includes(q);
    const keywordMatch = asset.keywords.some(
      (keyword) => keyword.toLowerCase().includes(q) || q.includes(keyword.toLowerCase())
    );

    if (nameMatch || keywordMatch) {
      return asset;
    }
  }

  return null;
}