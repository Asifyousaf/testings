
import React from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatTime } from '@/utils/timeUtils';
import { Progress } from "@/components/ui/progress";
import { Card } from '@/components/ui/card';

interface TimerDisplayProps {
  timeLeft: number;
  isPaused: boolean;
  isResting: boolean;
  animateTimer: boolean;
  onPlayPause: () => void;
  onSkip: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  isPaused,
  isResting,
  animateTimer,
  onPlayPause,
  onSkip
}) => {
  // Calculate progress for the progress bar
  const calculateProgress = () => {
    const maxTime = isResting ? 60 : 60; // Default max time, should be replaced with actual duration
    return Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
  };
  
  return (
    <Card className="p-4 border border-purple-100">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-700">
          {isResting ? "Rest Time" : "Exercise Time"}
        </h4>
        <span className="text-sm text-gray-500">
          {isResting ? "Recover before next set" : "Complete your reps with good form"}
        </span>
      </div>
      
      <div className="mt-2 mb-4">
        <Progress value={calculateProgress()} className="h-2" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className={`text-3xl font-bold transition-all ${animateTimer ? 'text-red-500 scale-110' : ''}`}>
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={onPlayPause} 
            variant="outline" 
            size="icon"
            className="h-12 w-12 rounded-full border-2 hover:bg-purple-50"
          >
            {isPaused ? (
              <Play className="h-5 w-5 text-purple-700" />
            ) : (
              <Pause className="h-5 w-5 text-purple-700" />
            )}
          </Button>
          <Button 
            onClick={onSkip} 
            variant="outline" 
            size="icon"
            className="h-12 w-12 rounded-full border-2 hover:bg-purple-50"
          >
            <SkipForward className="h-5 w-5 text-purple-700" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TimerDisplay;
