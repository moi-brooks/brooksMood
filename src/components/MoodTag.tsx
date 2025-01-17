import React from 'react';

interface MoodTagProps {
  mood: string;
  selected: boolean;
  onClick: () => void;
}

export const MoodTag: React.FC<MoodTagProps> = ({ mood, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
        ${selected 
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        } border border-emerald-800/50`}
    >
      {mood}
    </button>
  );
};