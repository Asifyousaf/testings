
import React from 'react';
import { Play } from 'lucide-react';
import { WorkoutData } from '@/types/workout';

interface WorkoutHeaderProps {
  onStartFirstWorkout: (workout: WorkoutData) => void;
  firstWorkout: WorkoutData;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ onStartFirstWorkout, firstWorkout }) => {
  return (
    <div className="py-8 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">Personalized Workout Plans</h1>
        <p className="text-base max-w-2xl mb-4">
          AI-powered workouts tailored to your fitness level, goals, and preferences.
        </p>
        <button 
          onClick={() => onStartFirstWorkout(firstWorkout)}
          className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center"
        >
          <Play size={16} className="mr-2" />
          Start Your First Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutHeader;
