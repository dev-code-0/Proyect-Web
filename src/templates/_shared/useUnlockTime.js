// Supabase unlock_at validation — delayed-reveal mechanics
import { useEffect, useState } from 'react';

export function useUnlockTime(unlockAt) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!unlockAt) {
      setIsUnlocked(true);
      return;
    }

    const unlockTime = new Date(unlockAt).getTime();
    const now = Date.now();

    if (now >= unlockTime) {
      setIsUnlocked(true);
      return;
    }

    setTimeRemaining(Math.ceil((unlockTime - now) / 1000));

    const interval = setInterval(() => {
      const remaining = Math.ceil((unlockTime - Date.now()) / 1000);
      if (remaining <= 0) {
        setIsUnlocked(true);
        clearInterval(interval);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockAt]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return {
    isUnlocked,
    timeRemaining,
    formattedTime: formatTime(timeRemaining)
  };
}

export function checkUnlockStatus(unlockAt) {
  if (!unlockAt) return true;
  return new Date(unlockAt).getTime() <= Date.now();
}
