const ACTION_DETAILS = {
  wave: {
    explanation: "The avatar is greeting the learner with a wave.",
    keywords: ["wave", "hello", "greet", "hi"]
  },
  point: {
    explanation: "The avatar is pointing to indicate focus or direction.",
    keywords: ["point", "indicate", "show", "direct"]
  },
  walk: {
    explanation: "The avatar is demonstrating movement through the scene.",
    keywords: ["walk", "move", "step", "go"]
  },
  idle: {
    explanation: "The avatar is standing in a neutral posture.",
    keywords: ["idle", "stop", "still", "stand"]
  }
};

const PRIORITY_ORDER = ["wave", "point", "walk", "idle"];

function normalizeInput(inputText) {
  return inputText
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

function scoreAction(normalizedInput, action) {
  const keywords = ACTION_DETAILS[action].keywords;
  let score = 0;
  const matchedKeywords = [];

  keywords.forEach((keyword) => {
    if (normalizedInput.includes(keyword)) {
      score += 1;
      matchedKeywords.push(keyword);
    }
  });

  return {
    score,
    matchedKeywords
  };
}

export function parseAvatarCommand(inputText) {
  const normalizedInput = normalizeInput(inputText || "");

  if (!normalizedInput) {
    return {
      action: "idle",
      explanation: ACTION_DETAILS.idle.explanation,
      confidence: 0,
      isFallback: true,
      matchedKeywords: [],
      normalizedInput
    };
  }

  const scoredActions = PRIORITY_ORDER.map((action) => {
    const { score, matchedKeywords } = scoreAction(normalizedInput, action);
    return { action, score, matchedKeywords };
  });

  const bestMatch = scoredActions.reduce((best, current) => {
    if (current.score > best.score) {
      return current;
    }
    return best;
  });

  if (bestMatch.score === 0) {
    return {
      action: "idle",
      explanation: ACTION_DETAILS.idle.explanation,
      confidence: 0.25,
      isFallback: true,
      matchedKeywords: [],
      normalizedInput
    };
  }

  const confidence = Math.min(1, 0.45 + bestMatch.score * 0.25);

  return {
    action: bestMatch.action,
    explanation: ACTION_DETAILS[bestMatch.action].explanation,
    confidence,
    isFallback: false,
    matchedKeywords: bestMatch.matchedKeywords,
    normalizedInput
  };
}
