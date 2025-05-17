import { useState, useEffect, useRef } from 'react';

// Sound types available in the app
export type SoundType = 'meditation' | 'ambient' | 'nature' | 'chimes' | 'beep' | 'success' | 'failure' | 'notification';

// Sound library with URLs
const soundLibrary: Record<SoundType, string> = {
  meditation: 'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-sound-2293.mp3',
  ambient: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-stream-ambience-1186.mp3',
  nature: 'https://assets.mixkit.co/sfx/preview/mixkit-birds-in-forest-loop-1236.mp3',
  chimes: 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3',
  beep: 'https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3',
  success: 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
  failure: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
  notification: 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'
};

export interface SoundOptions {
  volume?: number;
  loop?: boolean;
  onEnded?: () => void;
}

const useSounds = () => {
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const [isLoaded, setIsLoaded] = useState<Record<SoundType, boolean>>({
    meditation: false,
    ambient: false,
    nature: false,
    chimes: false,
    beep: false,
    success: false,
    failure: false,
    notification: false
  });
  const [isMuted, setIsMuted] = useState(false);

  // Preload sounds
  useEffect(() => {
    const loadSounds = async () => {
      const loadPromises = Object.entries(soundLibrary).map(([key, url]) => {
        return new Promise<void>((resolve) => {
          const audio = new Audio(url);
          audio.preload = 'auto';
          audio.addEventListener('canplaythrough', () => {
            console.log(`Sound loaded successfully: ${key}`);
            setIsLoaded(prev => ({ ...prev, [key]: true }));
            resolve();
          });
          
          // Add error handling
          audio.addEventListener('error', (e) => {
            console.error(`Failed to load sound: ${key}`, e);
            // Still mark as loaded to prevent blocking the app
            setIsLoaded(prev => ({ ...prev, [key]: true }));
            resolve(); // Resolve anyway to not block other sounds
          });
          
          audioRefs.current[key] = audio;
        });
      });
      
      try {
        await Promise.all(loadPromises);
        console.log("All sounds loaded successfully");
      } catch (error) {
        console.error("Failed to load some sounds:", error);
      }
    };
    
    loadSounds();
    
    // Cleanup
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  const setGlobalMute = (muted: boolean) => {
    setIsMuted(muted);
    
    // Apply to all currently playing sounds
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.muted = muted;
      }
    });
  };

  const play = (type: SoundType, options: SoundOptions = {}) => {
    const { volume = 0.5, loop = false, onEnded } = options;
    const audio = audioRefs.current[type];
    
    if (!audio) {
      console.warn(`Sound not found: ${type}`);
      return null;
    }
    
    try {
      // Create a new audio instance for each play to avoid conflicts
      const newAudio = new Audio(soundLibrary[type]);
      newAudio.volume = volume;
      newAudio.loop = loop;
      newAudio.muted = isMuted;
      
      if (onEnded) {
        newAudio.onended = onEnded;
      }
      
      // Attempt to play with error handling
      const playPromise = newAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Playback prevented by browser:", error);
          console.log("Try clicking on the screen to enable audio playback");
          
          // Add a user interaction handler to try again
          document.addEventListener('click', function playOnClick() {
            newAudio.play().catch(e => console.error("Still couldn't play audio:", e));
            document.removeEventListener('click', playOnClick);
          }, { once: true });
        });
      }
      
      // Replace the reference to ensure future controls affect this instance
      audioRefs.current[type] = newAudio;
      
      return newAudio;
    } catch (error) {
      console.error("Error playing sound:", error);
      return null;
    }
  };

  const pause = (type: SoundType) => {
    const audio = audioRefs.current[type];
    if (audio) {
      audio.pause();
    }
  };

  const stop = (type: SoundType) => {
    const audio = audioRefs.current[type];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const stopAll = () => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };

  const setVolume = (type: SoundType, volume: number) => {
    const audio = audioRefs.current[type];
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume)); // Ensure volume is between 0 and 1
    }
  };

  const isPlaying = (type: SoundType) => {
    const audio = audioRefs.current[type];
    return audio ? !audio.paused : false;
  };

  return { 
    play, 
    pause, 
    stop, 
    stopAll, 
    setVolume,
    setGlobalMute,
    isPlaying,
    isLoaded,
    isMuted
  };
};

export default useSounds;
