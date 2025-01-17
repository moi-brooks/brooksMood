const CLIENT_ID = '2e30b90ce86045b78723428288ff7321';
const CLIENT_SECRET = 'b30906f6841f44baaf346e0f2ae760a6';

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
}

let accessToken: string | null = null;
let tokenExpirationTime: number | null = null;

async function getAccessToken(): Promise<string> {
  if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
    },
    body: 'grant_type=client_credentials',
  });

  const data: SpotifyToken = await response.json();
  accessToken = data.access_token;
  tokenExpirationTime = Date.now() + (data.expires_in * 1000);
  return accessToken;
}

const moodToGenreMap: Record<string, string[]> = {
  'happy': ['pop', 'happy'],
  'sad': ['sad', 'acoustic'],
  'energetic': ['dance', 'electronic'],
  'peaceful': ['ambient', 'sleep'],
  'melancholic': ['indie', 'sad'],
  'nostalgic': ['vintage', '80s'],
  'optimistic': ['pop', 'summer'],
  'reflective': ['acoustic', 'indie'],
  'motivated': ['workout', 'power-pop'],
  'hopeful': ['gospel', 'inspirational'],
  'contemplative': ['classical', 'piano'],
  'upbeat': ['dance', 'party']
};

export async function searchSpotifyTracks(moods: string[], genres: string[] = []): Promise<SpotifyTrack[]> {
  try {
    const token = await getAccessToken();
    
    // Combine mood-based genres and explicitly selected genres
    const moodGenres = moods.flatMap(mood => moodToGenreMap[mood] || [mood]);
    const allGenres = [...new Set([...moodGenres, ...genres])];
    
    // Create search query combining genres and moods
    const searchQuery = allGenres.join(' ') + (moods.length ? ' ' + moods.join(' ') : '');
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error('Error searching Spotify tracks:', error);
    throw error;
  }
}

export function transformSpotifyTrack(track: SpotifyTrack) {
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    imageUrl: track.album.images[0]?.url || '',
    previewUrl: track.external_urls.spotify
  };
}