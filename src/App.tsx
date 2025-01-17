import React, { useState, useEffect } from 'react';
import { Music, Loader, AlertCircle, Sparkles, X, Tag, Radio } from 'lucide-react';
import { analyzeMood } from './services/moodAnalysis';
import { searchSpotifyTracks, transformSpotifyTrack } from './services/spotifyService';
import { SongCard } from './components/SongCard';
import { MoodTag } from './components/MoodTag';
import type { Song } from './types';

function App() {
  const [moodInput, setMoodInput] = useState('');
  const [suggestedSongs, setSuggestedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const availableMoods = [
    'happy', 'sad', 'energetic', 'peaceful',
    'melancholic', 'optimistic', 'reflective', 'upbeat'
  ];

  const availableGenres = [
    'pop', 'rock', 'hip-hop', 'jazz',
    'classical', 'electronic', 'indie', 'r&b'
  ];

  useEffect(() => {
    setApiKeyMissing(!import.meta.env.VITE_OPENAI_API_KEY);
  }, []);

  const handleMoodSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!moodInput.trim() && selectedMoods.length === 0 && selectedGenres.length === 0) return;

    setIsLoading(true);
    setError('');

    try {
      let moodAnalysis;
      if (moodInput.trim()) {
        moodAnalysis = await analyzeMood(moodInput);
      } else {
        moodAnalysis = { moods: selectedMoods, confidence: 1 };
      }
      
      if (moodAnalysis.moods.length === 0 && selectedGenres.length === 0) {
        setError('Please select at least one mood or genre to find songs.');
        setSuggestedSongs([]);
        return;
      }

      const spotifyTracks = await searchSpotifyTracks(moodAnalysis.moods, selectedGenres);
      const transformedSongs = spotifyTracks.map(track => ({
        ...transformSpotifyTrack(track),
        moods: moodAnalysis.moods
      }));

      setSuggestedSongs(transformedSongs);
      
      if (transformedSongs.length === 0) {
        setError('No songs found matching your criteria. Try different moods or genres.');
      } else {
        setShowModal(true);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoodInput(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleMoodSubmit();
    }
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood)
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="w-full max-w-2xl px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Music size={40} className="text-emerald-400 animate-pulse" />
              <Sparkles 
                size={20} 
                className="absolute -top-2 -right-2 text-emerald-300 animate-bounce"
              />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 text-transparent bg-clip-text">
              BrooksMood
            </h1>
          </div>
          <p className="text-gray-400 text-lg animate-fade-in-up">
            Let your mood guide you to the perfect melody
          </p>
        </div>

        {apiKeyMissing && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg flex items-center gap-3 animate-fade-in">
            <AlertCircle className="text-yellow-500" size={24} />
            <p className="text-yellow-300">
              OpenAI API key not found. The app will use simple keyword matching instead of AI-powered mood analysis.
              For better results, add your API key to the .env file.
            </p>
          </div>
        )}

        <div className="space-y-6 mb-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={16} className="text-emerald-400" />
              <span className="text-gray-300 font-medium">Select moods:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableMoods.map((mood) => (
                <MoodTag
                  key={mood}
                  mood={mood}
                  selected={selectedMoods.includes(mood)}
                  onClick={() => toggleMood(mood)}
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-4">
              <Radio size={16} className="text-emerald-400" />
              <span className="text-gray-300 font-medium">Select genres:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableGenres.map((genre) => (
                <MoodTag
                  key={genre}
                  mood={genre}
                  selected={selectedGenres.includes(genre)}
                  onClick={() => toggleGenre(genre)}
                />
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleMoodSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={moodInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="How are you feeling? (e.g., 'feeling energetic and happy')"
              className={`w-full px-6 py-4 text-lg rounded-full border-2 transition-all duration-300
                bg-gray-800 text-gray-100 placeholder-gray-500
                ${isTyping ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-gray-700 shadow-md shadow-black/20'}
                focus:border-emerald-500 focus:outline-none focus:shadow-lg focus:shadow-emerald-500/20`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 
                bg-gradient-to-r from-emerald-500 to-green-500 text-white 
                px-6 py-2 rounded-full transition-all duration-300
                hover:from-emerald-400 hover:to-green-400 hover:shadow-lg hover:shadow-emerald-500/20
                disabled:from-emerald-800 disabled:to-green-800 disabled:text-gray-400
                ${isLoading ? 'animate-pulse' : ''}`}
            >
              {isLoading ? (
                <Loader className="animate-spin" size={24} />
              ) : (
                'Find Songs'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-center text-red-400 mb-8 animate-fade-in">
            {error}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800/90 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl border border-gray-700/50">
              <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-emerald-400">Your Music Suggestions</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestedSongs.map((song, index) => (
                    <div
                      key={song.id}
                      className="opacity-0 animate-fade-in-up"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <SongCard song={song} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {suggestedSongs.length === 0 && !error && !isLoading && !showModal && (
          <div className="text-center text-gray-400 animate-fade-in">
            Select moods and genres or describe how you feel to get song suggestions
          </div>
        )}
      </div>
    </div>
  );
}

export default App;