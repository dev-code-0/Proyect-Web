// Seeded random number generation — deterministic procedural scenes
// Ensures same project ID = same scene visuals

export function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function seededRandom(projectId, index = 0) {
  const seed = (hashString(projectId) + index) >>> 0;
  const rng = mulberry32(seed);
  return rng();
}

export function seededShuffle(array, projectId) {
  const rng = mulberry32(hashString(projectId));
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function seededValue(projectId, min, max, index = 0) {
  const rand = seededRandom(projectId, index);
  return min + rand * (max - min);
}
