const ADJECTIVES = [
  'Zen', 'Calm', 'Peaceful', 'Serene', 'Mindful', 'Bright', 'Gentle', 'Kind',
  'Wise', 'Cool', 'Chill', 'Vibing', 'Happy', 'Cozy', 'Warm', 'Fresh',
  'Magic', 'Dreamy', 'Cosmic', 'Stellar', 'Luna', 'Solar', 'Ocean', 'Forest'
];

const NOUNS = [
  'Student', 'Leaf', 'Wave', 'Star', 'Moon', 'Sun', 'Cloud', 'Breeze',
  'Sage', 'Spirit', 'Soul', 'Heart', 'Mind', 'Dream', 'Vibe', 'Energy',
  'Phoenix', 'Dragon', 'Tiger', 'Wolf', 'Fox', 'Butterfly', 'Eagle', 'Lion'
];

export function generateAnonymousName(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  
  return `${adjective}${noun}${number}`;
}

export function calculateAuraLevel(points: number): number {
  if (points < 50) return 1;
  if (points < 200) return 2;
  if (points < 500) return 3;
  if (points < 1000) return 4;
  if (points < 2000) return 5;
  return Math.floor(points / 1000) + 5;
}

export function getAuraLevelName(level: number): string {
  const levels = [
    'Seedling', 'Sprout', 'Bloom', 'Garden', 'Grove', 
    'Forest', 'Sanctuary', 'Oracle', 'Sage', 'Master'
  ];
  return levels[Math.min(level - 1, levels.length - 1)] || 'Transcendent';
}