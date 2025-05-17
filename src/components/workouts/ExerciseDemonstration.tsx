
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ExerciseDemonstrationProps {
  exerciseName: string;
  imageUrl: string;
  currentSet: number;
  totalSets: number;
  isLoading?: boolean;
  onImageError?: () => void;
  compact?: boolean;
}

const ExerciseDemonstration: React.FC<ExerciseDemonstrationProps> = ({ 
  exerciseName, 
  imageUrl, 
  currentSet,
  totalSets,
  isLoading = false,
  onImageError,
  compact = false
}) => {
  const [imgError, setImgError] = useState(false);
  
  const handleImageError = () => {
    setImgError(true);
    if (onImageError) {
      onImageError();
    }
  };
  
  return (
    <div className={`overflow-hidden shadow-md bg-white rounded-lg h-full ${compact ? 'min-h-[300px]' : ''}`}>
      <div className={`relative ${compact ? 'h-full aspect-square' : 'aspect-[4/3]'} bg-gray-100 flex items-center justify-center`}>
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-sm text-gray-500">Loading exercise...</span>
          </div>
        ) : imgError ? (
          <div className="w-full h-full flex items-center justify-center flex-col p-4">
            <p className="text-gray-500">Exercise image unavailable</p>
            <p className="text-xs text-gray-400 mt-2">{exerciseName}</p>
          </div>
        ) : (
          <img 
            src={imageUrl}
            alt={`${exerciseName} demonstration`} 
            className="max-w-full max-h-full object-contain" 
            loading="eager"
            onError={handleImageError}
          />
        )}
        {!compact && (
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium truncate">{exerciseName}</h3>
              <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                Set {currentSet} of {totalSets}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseDemonstration;
