// Howl-based universal audio component — cross-browser audio handling
import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

export function useAudioPlayer(audioUrl, options = {}) {
  const howlRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    howlRef.current = new Howl({
      src: [audioUrl],
      volume: options.volume || 0.8,
      loop: options.loop || false,
      autoplay: false,
      onload: () => {
        setDuration(howlRef.current.duration());
      },
      onloaderror: () => {
        console.warn(`Failed to load audio: ${audioUrl}`);
      },
      onplay: () => setIsPlaying(true),
      onstop: () => setIsPlaying(false),
      onpause: () => setIsPlaying(false)
    });

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, [audioUrl, options.volume, options.loop]);

  useEffect(() => {
    if (!howlRef.current) return;

    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentTime(howlRef.current.seek());
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return {
    play: () => howlRef.current?.play(),
    pause: () => howlRef.current?.pause(),
    stop: () => howlRef.current?.stop(),
    seek: (time) => howlRef.current?.seek(time),
    setVolume: (vol) => howlRef.current?.volume(vol),
    isPlaying,
    duration,
    currentTime
  };
}

export const AudioPlayer = ({ src, autoplay = false, volume = 0.8, onError = null }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    if (autoplay) {
      audio.play().catch(err => {
        if (onError) onError(err);
      });
    }
  }, [src, autoplay, volume, onError]);

  return (
    <audio
      ref={audioRef}
      src={src}
      crossOrigin="anonymous"
      onError={() => {
        if (onError) onError(new Error(`Failed to load: ${src}`));
      }}
    />
  );
};
