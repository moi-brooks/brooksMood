export interface Song {
  id: string;
  title: string;
  artist: string;
  moods: string[];
  previewUrl: string;
  imageUrl: string;
}

export interface MoodAnalysisResponse {
  moods: string[];
  confidence: number;
}