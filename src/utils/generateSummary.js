export function generateSummary(asset) {
  if (!asset) {
    return "No matching asset found. Try searching for a tool or safety item.";
  }

  return asset.defaultSummary;
}