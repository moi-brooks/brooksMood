import { MoodAnalysisResponse } from '../types';

const moodKeywords = {
  happy: ['happy', 'joy', 'cheerful', 'excited', 'delighted', 'content', 'pleased', 'upbeat'],
  sad: ['sad', 'down', 'blue', 'depressed', 'gloomy', 'heartbroken', 'melancholic'],
  energetic: ['energetic', 'lively', 'dynamic', 'vigorous', 'active', 'pumped', 'hyped'],
  peaceful: ['peaceful', 'calm', 'relaxed', 'serene', 'tranquil', 'gentle', 'quiet'],
  melancholic: ['melancholic', 'nostalgic', 'wistful', 'bittersweet', 'sentimental'],
  optimistic: ['optimistic', 'hopeful', 'positive', 'confident', 'bright', 'motivated'],
  reflective: ['reflective', 'thoughtful', 'contemplative', 'introspective', 'pensive'],
  upbeat: ['upbeat', 'bouncy', 'peppy', 'enthusiastic', 'vibrant', 'spirited']
};

function findMoods(input: string): string[] {
  const normalizedInput = input.toLowerCase();
  const words = normalizedInput.split(/\s+/);
  
  const detectedMoods = new Set<string>();
  
  // Check each word against our mood keywords
  words.forEach(word => {
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => word.includes(keyword))) {
        detectedMoods.add(mood);
      }
    }
  });
  
  // If no moods detected, try to infer from context
  if (detectedMoods.size === 0) {
    if (normalizedInput.match(/(\b|^)(love|great|amazing|wonderful|fantastic)(\b|$)/)) {
      detectedMoods.add('happy');
    }
    if (normalizedInput.match(/(\b|^)(tired|exhausted|sleepy)(\b|$)/)) {
      detectedMoods.add('peaceful');
    }
    if (normalizedInput.match(/(\b|^)(miss|remember|memories)(\b|$)/)) {
      detectedMoods.add('melancholic');
    }
    if (normalizedInput.match(/(\b|^)(ready|lets go|pumped|ready)(\b|$)/)) {
      detectedMoods.add('energetic');
    }
  }
  
  return Array.from(detectedMoods);
}

export async function analyzeMood(input: string): Promise<MoodAnalysisResponse> {
  const moods = findMoods(input);
  
  return {
    moods,
    confidence: moods.length > 0 ? 0.8 : 0
  };
}