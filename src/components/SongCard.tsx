import React from 'react';
import { Music, Heart } from 'lucide-react';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
}

export const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-102 group border border-gray-700/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <img
          src={song.imageUrl}
          alt={`${song.title} by ${song.artist}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <a
            href={song.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-emerald-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            <Music size={20} />
            Play Preview
          </a>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-1">{song.title}</h3>
            <p className="text-gray-400">{song.artist}</p>
          </div>
          <button 
            className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
            aria-label="Like song"
          >
            <Heart size={24} />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {song.moods.map((mood, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-emerald-900/30 to-green-900/30 text-emerald-300 rounded-full text-sm font-medium border border-emerald-800/50"
            >
              {mood}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};