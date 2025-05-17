
import React, { useState } from 'react';
import { Exercise } from '@/types/workout';
import ExerciseDemonstration from './ExerciseDemonstration';
import ExerciseInstructions from './ExerciseInstructions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipForward } from 'lucide-react';
import TimerDisplay from './TimerDisplay';
import { useExerciseImage } from '@/hooks/useWorkoutSession';
import { getGifUrlForExercise } from '@/utils/exerciseImageUtils';

interface WorkoutExerciseViewProps {
  exercise: Exercise;
  currentSet: number;
  totalSets: number;
  onComplete: () => void;
  remainingSeconds?: number | null;
  isRest?: boolean;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

const WorkoutExerciseView: React.FC<WorkoutExerciseViewProps> = ({
  exercise,
  currentSet,
  totalSets,
  onComplete,
  remainingSeconds,
  isRest = false,
  isPaused = false,
  onTogglePause
}) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const { imageUrl, isLoading, imageError } = useExerciseImage(exercise.name);
  
  // Fallback to directly getting GIF from exercise if available
  const gifUrl = imageUrl || (exercise.gifUrl ? exercise.gifUrl : getGifUrlForExercise(exercise.name));
  
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="md:w-1/3 flex flex-col gap-4">
        <ExerciseDemonstration
          exerciseName={exercise.name}
          imageUrl={gifUrl}
          currentSet={currentSet}
          totalSets={totalSets}
          isLoading={isLoading && !exercise.gifUrl}
          onImageError={() => console.log('Image failed to load')}
        />
        
        {remainingSeconds !== null && remainingSeconds !== undefined && (
          <Card className="shadow-md">
            <CardContent className="p-4">
              <TimerDisplay
                seconds={remainingSeconds}
                isPaused={isPaused}
                onTogglePause={onTogglePause}
                isRest={isRest}
              />
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="md:w-2/3 flex flex-col gap-4">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">{exercise.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  {isRest ? 'Rest Period' : `Set ${currentSet} of ${totalSets}`}
                </span>
                
                {exercise.equipment && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {exercise.equipment}
                  </span>
                )}
                
                {exercise.target && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {exercise.target}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Reps</p>
                  <p className="font-semibold">{exercise.reps || "12-15"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Sets</p>
                  <p className="font-semibold">{totalSets}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Rest</p>
                  <p className="font-semibold">{exercise.restSeconds ? `${exercise.restSeconds}s` : "60s"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Type</p>
                  <p className="font-semibold capitalize">{exercise.type || "strength"}</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={onComplete} 
              className="w-full"
              variant={isRest ? "default" : "outline"}
            >
              <SkipForward className="w-4 h-4 mr-2" />
              {isRest ? "Skip Rest" : "Complete Set"}
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex-1">
          {showInstructions && exercise.instructions && (
            <ExerciseInstructions instructions={exercise.instructions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutExerciseView;
