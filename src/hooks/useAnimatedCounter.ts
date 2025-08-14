
import { useState, useEffect } from 'react';

const easeOutExpo = (t: number) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

const useAnimatedCounter = (end: number, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;
    
    const animationFrame = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = timestamp - startTime;
      const timeFraction = Math.min(progress / duration, 1);
      const easedProgress = easeOutExpo(timeFraction);
      const currentCount = Math.floor(easedProgress * end);
      
      setCount(currentCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animationFrame);
      }
    };

    animationFrameId = requestAnimationFrame(animationFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    }
  }, [end, duration]);

  return count;
};

export default useAnimatedCounter;