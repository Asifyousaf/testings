
import React from 'react';
import WorkoutCard from './WorkoutCard';
import { WorkoutData } from '@/types/workout';

interface WorkoutsListProps {
  workouts: WorkoutData[];
  onStartWorkout: (workout: WorkoutData) => void;
  onDeleteWorkout?: (workoutId: string) => void;
  userId?: string;
  isLoading?: boolean;
}

const WorkoutsList: React.FC<WorkoutsListProps> = ({ 
  workouts,
  onStartWorkout,
  onDeleteWorkout,
  userId,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div 
            key={item} 
            className="bg-gray-100 rounded-lg h-80 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No workouts found matching your search.</p>
      </div>
    );
  }

  // Ensure all workout exercises have the necessary properties
  const prepareWorkout = (workout: WorkoutData): WorkoutData => {
    // Just pass through the workout as is, no more local URL manipulation
    return workout;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onStart={() => onStartWorkout(prepareWorkout(workout))}
          onDelete={onDeleteWorkout}
          userId={userId}
        />
      ))}
    </div>
  );
};

export default WorkoutsList;
