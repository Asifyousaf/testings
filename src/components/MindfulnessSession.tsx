import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Clock, Waves, SkipForward, Music } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import useSounds from '../hooks/useSounds';
import { SoundType } from "@/types/sound";

interface MindfulnessSessionProps {
  sessionType: string;
  duration: number;
  onComplete: () => void;
  onCancel: () => void;
  soundsReady?: boolean;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const MindfulnessSession: React.FC<MindfulnessSessionProps> = ({ 
  sessionType, 
  duration, 
  onComplete, 
  onCancel,
  soundsReady = false
}) => {
  const [isPaused, setIsPaused] = useState(true);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert minutes to seconds
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [soundType, setSoundType] = useState<'meditation' | 'ambient' | 'nature'>('meditation');
  const [showControls, setShowControls] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [soundTestStatus, setSoundTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  const { play, pause, stop, isLoaded } = useSounds();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (!isPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPaused, timeLeft]);

  // Preload sounds
  useEffect(() => {
    const preloadSounds = async () => {
      try {
        // Force loading of all sound types
        await Promise.all([
          new Audio('/sounds/meditation.mp3').load(),
          new Audio('/sounds/ambient.mp3').load(),
          new Audio('/sounds/nature.mp3').load(),
          new Audio('/sounds/chimes.mp3').load()
        ]);
      } catch (error) {
        console.error("Error preloading sounds:", error);
      }
    };
    
    preloadSounds();
  }, []);

  // Sound playing effect
  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    
    if (!isPaused) {
      const actualVolume = isMuted ? 0 : volume / 100;
      try {
        audio = new Audio(`/sounds/${soundType}.mp3`);
        audio.volume = actualVolume;
        audio.loop = true;
        audio.play().catch(err => console.error("Error playing sound:", err));
        setCurrentAudio(audio);
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    } else if (currentAudio) {
      currentAudio.pause();
    }
    
    return () => {
      if (audio) {
        audio.pause();
      }
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
      }
    };
  }, [isPaused, soundType, volume, isMuted]);

  // Interval chimes effect
  useEffect(() => {
    let intervalChimes: NodeJS.Timeout | null = null;
    
    if (!isPaused) {
      const chimeInterval = 5 * 60; // 5 minutes in seconds
      
      intervalChimes = setInterval(() => {
        if (timeLeft > 10 && timeLeft < (duration * 60 - 10)) {
          try {
            const actualVolume = isMuted ? 0 : (volume / 100) * 0.5;
            const chimeSound = new Audio('/sounds/chimes.mp3');
            chimeSound.volume = actualVolume;
            chimeSound.play().catch(err => console.error("Error playing chimes:", err));
          } catch (error) {
            console.error("Error playing chimes:", error);
          }
        }
      }, chimeInterval * 1000);
    }
    
    return () => {
      if (intervalChimes) clearInterval(intervalChimes);
    };
  }, [isPaused, timeLeft, duration, volume, isMuted]);

  const handlePlayPause = () => {
    if (isPaused) {
      setIsPaused(false);
      toast({
        title: "Session Started",
        description: `Your ${sessionType.toLowerCase()} session has begun.`,
      });
      
      if (isLoaded.chimes) {
        play('chimes', { volume: (isMuted ? 0 : volume / 100) });
      }
    } else {
      setIsPaused(true);
      if (currentAudio) {
        currentAudio.pause();
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
    
    if (currentAudio) {
      currentAudio.volume = newVolume / 100;
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    
    if (currentAudio) {
      currentAudio.muted = !isMuted;
    }
  };

  const handleComplete = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    if (isLoaded.chimes) {
      play('chimes', { volume: (isMuted ? 0 : volume / 100) });
    }
    
    onComplete();
  };

  const handleCancel = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    onCancel();
  };

  const handleSoundTypeChange = (newType: 'meditation' | 'ambient' | 'nature') => {
    if (newType !== soundType) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      
      setSoundType(newType);
      
      if (!isPaused && isLoaded[newType]) {
        const audio = play(newType, { volume: isMuted ? 0 : volume / 100, loop: true });
        setCurrentAudio(audio);
      }
    }
  };
  
  const testSound = () => {
    setSoundTestStatus('testing');
    
    // Try to play a test sound
    try {
      const audio = new Audio('/sounds/chimes.mp3');
      audio.volume = 0.7;
      
      audio.onended = () => {
        setSoundTestStatus('success');
        toast({
          title: "Sound Test Successful",
          description: "Audio is working correctly!",
        });
      };
      
      audio.onerror = () => {
        setSoundTestStatus('failed');
        toast({
          title: "Sound Test Failed",
          description: "We couldn't play the sound. Please check your device volume.",
          variant: "destructive"
        });
      };
      
      audio.play().catch(err => {
        console.error("Error in sound test:", err);
        setSoundTestStatus('failed');
        toast({
          title: "Sound Test Failed",
          description: "Your browser blocked audio playback. Please check permissions and try again.",
          variant: "destructive"
        });
      });
      
      // Set a timeout in case the sound doesn't play or end
      setTimeout(() => {
        if (soundTestStatus === 'testing') {
          setSoundTestStatus('failed');
          toast({
            title: "Sound Test Failed",
            description: "We couldn't confirm if the sound played. Please check your device volume.",
            variant: "destructive"
          });
        }
      }, 3000);
    } catch (error) {
      setSoundTestStatus('failed');
      toast({
        title: "Sound Test Failed",
        description: "We couldn't play the sound. Please check your device volume and browser permissions.",
        variant: "destructive"
      });
    }
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Music className="mr-2 h-5 w-5 text-purple-600" />
            {sessionType} Session
          </div>
          <div className="text-sm font-normal bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {duration} min
          </div>
        </CardTitle>
        <CardDescription>Focus on your breath and clear your mind</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <Button 
            variant="outline"
            onClick={testSound}
            disabled={soundTestStatus === 'testing'}
            className="mb-3"
          >
            {soundTestStatus === 'testing' ? (
              <>Testing Sounds...</>
            ) : soundTestStatus === 'success' ? (
              <>Sound Working ✓</>
            ) : (
              <>Test Sound</>
            )}
          </Button>
          <p className="text-xs text-gray-500">
            If you can't hear sounds, press this button to test your audio
          </p>
        </div>
        
        <div className="text-center py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={timeLeft}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-6xl font-bold text-purple-800"
            >
              {formatTime(timeLeft)}
            </motion.div>
          </AnimatePresence>

          <Progress 
            value={progress} 
            className="h-2 mt-6" 
          />
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            className={`rounded-full p-6 ${
              isPaused 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {isPaused ? (
              <Play className="h-12 w-12" />
            ) : (
              <Pause className="h-12 w-12" />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 p-4 rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium flex items-center">
                  <Waves className="h-4 w-4 mr-2" /> 
                  Sound Settings
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowControls(false)}
                >
                  Hide
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Sound Type</Label>
                  <Select 
                    value={soundType}
                    onValueChange={(value: any) => handleSoundTypeChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sound type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meditation">Meditation Bells</SelectItem>
                      <SelectItem value="ambient">Ambient Rain</SelectItem>
                      <SelectItem value="nature">Birds Singing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Volume</Label>
                    <button
                      onClick={handleMuteToggle}
                      className="text-gray-500 hover:text-purple-600"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className={isMuted ? "opacity-50" : ""}
                    disabled={isMuted}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-bell"
                    checked={true}
                    onCheckedChange={() => {}}
                  />
                  <Label htmlFor="auto-bell">Play bell at start and end</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-guide"
                    checked={showGuide}
                    onCheckedChange={setShowGuide}
                  />
                  <Label htmlFor="show-guide">Show meditation guide</Label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!showControls && (
          <Button 
            variant="ghost" 
            className="w-full text-sm text-gray-500"
            onClick={() => setShowControls(true)}
          >
            Show Sound Controls
          </Button>
        )}
        
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <h3 className="font-semibold mb-2">Meditation Guide</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">1.</span>
                  Find a comfortable position, seated or lying down.
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">2.</span>
                  Close your eyes and take a deep breath in through your nose.
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">3.</span>
                  Exhale slowly through your mouth, releasing all tension.
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">4.</span>
                  Focus on your breath, noticing each inhale and exhale.
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">5.</span>
                  When your mind wanders, gently bring your focus back to your breath.
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!showGuide && !showControls && (
          <div className="text-center text-sm text-gray-500">
            <p>Find a comfortable position and focus on your breath.</p>
            <p>Allow thoughts to pass without judgment.</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          End Session
        </Button>
        <Button 
          onClick={handleComplete}
          className="flex items-center"
        >
          <SkipForward className="h-4 w-4 mr-2" />
          Complete Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MindfulnessSession;
