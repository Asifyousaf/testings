
import { Exercise } from "@/types/exercise";
import { toast } from "@/components/ui/use-toast";

const API_URL = 'https://exercisedb.p.rapidapi.com';
const API_KEY = '3258340256msh72616f62a5d431dp1207f6jsnc6934870cc0b';

const headers = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
};

const EXERCISE_API_URL = 'https://exercisedb.p.rapidapi.com';
const EXERCISE_API_KEY = '3258340256msh72616f62a5d431dp1207f6jsnc6934870cc0b';

const exerciseHeaders = {
  'X-RapidAPI-Key': EXERCISE_API_KEY,
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
};

// Ensure HTTPS for all URLs
const ensureHttps = (url: string) => {
  if (url && typeof url === 'string') {
    return url.replace(/^http:\/\//i, 'https://');
  }
  return url;
};

export const fetchExercises = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${EXERCISE_API_URL}/exercises`, { 
      headers: exerciseHeaders 
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }
    
    const data = await response.json();
    
    // Ensure all GIF URLs use HTTPS
    return data.map((exercise: any) => ({
      ...exercise,
      gifUrl: ensureHttps(exercise.gifUrl)
    }));
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

export const fetchExerciseById = async (id: string): Promise<Exercise> => {
  try {
    const response = await fetch(`${API_URL}/exercises/exercise/${id}`, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercise details');
    }
    
    const data = await response.json();
    
    return {
      ...data,
      gifUrl: ensureHttps(data.gifUrl)
    };
  } catch (error) {
    console.error('Error fetching exercise details:', error);
    throw error;
  }
};

export const fetchExercisesByName = async (name: string): Promise<any[]> => {
  try {
    // First try to search by name
    const response = await fetch(`${EXERCISE_API_URL}/exercises/name/${encodeURIComponent(name)}`, { 
      headers: exerciseHeaders 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exercise: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // If we get results, return them with HTTPS URLs
    if (data && data.length > 0) {
      return data.map((exercise: any) => ({
        ...exercise,
        gifUrl: ensureHttps(exercise.gifUrl)
      }));
    }
    
    // If no results, try to search by target muscle
    const targetResponse = await fetch(`${EXERCISE_API_URL}/exercises/target/${encodeURIComponent(name.toLowerCase())}`, { 
      headers: exerciseHeaders 
    });
    
    if (!targetResponse.ok) {
      console.log("No exercises found for target either");
      // Just return empty array if both searches fail
      return [];
    }
    
    const targetData = await targetResponse.json();
    
    // Ensure all GIF URLs use HTTPS
    return targetData.map((exercise: any) => ({
      ...exercise,
      gifUrl: ensureHttps(exercise.gifUrl)
    }));
  } catch (error) {
    console.error('Error fetching exercise by name:', error);
    return [];
  }
};

export const fetchExercisesByBodyPart = async (bodyPart: string): Promise<Exercise[]> => {
  try {
    const response = await fetch(`${API_URL}/exercises/bodyPart/${bodyPart}`, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exercises for body part: ${bodyPart}`);
    }
    
    const data = await response.json();
    
    // Ensure all GIF URLs use HTTPS
    return data.map((exercise: any) => ({
      ...exercise,
      gifUrl: ensureHttps(exercise.gifUrl)
    }));
  } catch (error) {
    console.error('Error fetching exercises by body part:', error);
    throw error;
  }
};

export const fetchBodyParts = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/exercises/bodyPartList`, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch body parts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching body parts:', error);
    throw error;
  }
};
