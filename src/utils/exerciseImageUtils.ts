
import { toast } from "@/components/ui/use-toast";

const API_URL = 'https://exercisedb.p.rapidapi.com';
const API_KEY = '3258340256msh72616f62a5d431dp1207f6jsnc6934870cc0b';

// Basic fallback exercise images for when API fails
export const exerciseImages = {
  "Jumping Jacks": "/fallbacks/jumping-jacks.gif", 
  "Push-ups": "/fallbacks/push-ups.gif",
  "Air Squats": "/fallbacks/squats.gif",
  "Squats": "/fallbacks/squats.gif",
  "Plank": "/fallbacks/plank.gif",
  "Russian Twists": "/fallbacks/russian-twists.gif",
  "Mountain Climbers": "/fallbacks/mountain-climbers.gif",
  "Burpees": "/fallbacks/jumping-jacks.gif",
  "Lunges": "/fallbacks/squats.gif",
  "Crunches": "/fallbacks/russian-twists.gif",
  "Sit-ups": "/fallbacks/russian-twists.gif",
  "Dumbbell Curls": "/fallbacks/default.gif",
  "Tricep Dips": "/fallbacks/push-ups.gif",
  "default": "/fallbacks/default.gif"
};

// API headers
const headers = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
};

// Exercise type definition (extend if needed)
export interface ExerciseDetails {
  id: string;
  name: string;
  gifUrl: string;
  bodyPart: string;
  equipment: string;
  target: string;
  secondaryMuscles?: string[];
  instructions?: string[];
}

// Ensure HTTPS for all URLs
const ensureHttps = (url: string) => {
  if (url && typeof url === 'string') {
    return url.replace(/^http:\/\//i, 'https://');
  }
  return url;
};

// Fetch all exercises
export const fetchExercises = async (): Promise<ExerciseDetails[]> => {
  try {
    const response = await fetch(`${API_URL}/exercises`, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }
    
    const data = await response.json();
    
    // Ensure all GIF URLs use HTTPS
    return data.map((exercise: ExerciseDetails) => ({
      ...exercise,
      gifUrl: ensureHttps(exercise.gifUrl)
    }));
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

// Fetch a specific exercise by ID
export const fetchExerciseById = async (id: string): Promise<ExerciseDetails> => {
  try {
    const response = await fetch(`${API_URL}/exercises/exercise/${id}`, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercise details');
    }
    
    const data = await response.json();
    
    // Ensure GIF URL uses HTTPS
    return {
      ...data,
      gifUrl: ensureHttps(data.gifUrl)
    };
  } catch (error) {
    console.error('Error fetching exercise details:', error);
    throw error;
  }
};

// Fetch exercises by name (useful for search)
export const fetchExercisesByName = async (name: string): Promise<ExerciseDetails[]> => {
  try {
    const response = await fetch(`${API_URL}/exercises/name/${name}`, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exercises for name: ${name}`);
    }
    
    const data = await response.json();
    
    // Ensure all GIF URLs use HTTPS
    return data.map((exercise: ExerciseDetails) => ({
      ...exercise,
      gifUrl: ensureHttps(exercise.gifUrl)
    }));
  } catch (error) {
    console.error(`Error fetching exercises by name ${name}:`, error);
    throw error;
  }
};

// Get best matching exercise GIF URL
export const getBestExerciseImageUrl = async (exercise: any): Promise<string> => {
  if (!exercise) return exerciseImages.default;
  
  // If exercise already has a gifUrl, use it
  if (exercise.gifUrl && typeof exercise.gifUrl === 'string' && exercise.gifUrl.trim() !== '') {
    return ensureHttps(exercise.gifUrl);
  }
  
  const exerciseName = exercise.name || "";
  
  try {
    // Try to get the exercise from ExerciseDB API
    const exercises = await fetchExercisesByName(exerciseName);
    
    if (exercises && exercises.length > 0) {
      return ensureHttps(exercises[0].gifUrl);
    }
  } catch (error) {
    console.error("Error fetching from ExerciseDB:", error);
  }
  
  // Fallback to our dictionary
  const exactMatchKey = Object.keys(exerciseImages).find(
    key => key.toLowerCase() === exerciseName.toLowerCase()
  );
  
  if (exactMatchKey) {
    return exerciseImages[exactMatchKey];
  }
  
  // Default fallback
  return exerciseImages.default;
};

// Sync version for immediate display
export const getBestExerciseImageUrlSync = (exercise: any): string => {
  if (!exercise) return exerciseImages.default;
  
  // Use existing gifUrl if available
  if (exercise.gifUrl && typeof exercise.gifUrl === 'string' && exercise.gifUrl.trim() !== '') {
    return ensureHttps(exercise.gifUrl);
  }
  
  const exerciseName = exercise.name || "";
  
  // Simple dictionary lookup
  const exactMatchKey = Object.keys(exerciseImages).find(
    key => key.toLowerCase() === exerciseName.toLowerCase()
  );
  
  if (exactMatchKey) {
    return exerciseImages[exactMatchKey];
  }
  
  return exerciseImages.default;
};
