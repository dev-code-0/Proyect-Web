// Web Audio API + Meyda wrapper — audio reactivity (bass/mid/treble/rms/beat)
import { useEffect, useRef, useState } from 'react';

export function useAudioReactive(audioElement) {
  const [audioData, setAudioData] = useState({
    bass: 0,
    mid: 0,
    treble: 0,
    rms: 0,
    beat: false,
    frequency: []
  });

  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const dataArrayRef = useRef(null);
  const lastBeatTimeRef = useRef(0);

  useEffect(() => {
    if (!audioElement) return;

    const initAudio = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 2048;

      const source = audioContext.createMediaElementAudioSource(audioElement);
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);

      audioContextRef.current = audioContext;
      analyzerRef.current = analyzer;
      dataArrayRef.current = dataArray;

      audioContext.resume();
    };

    audioElement.addEventListener('play', initAudio);

    const animate = () => {
      if (!analyzerRef.current || !dataArrayRef.current) {
        requestAnimationFrame(animate);
        return;
      }

      analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
      const dataArray = dataArrayRef.current;

      const bass = dataArray.slice(0, 10).reduce((a, b) => a + b) / 10 / 255;
      const mid = dataArray.slice(40, 100).reduce((a, b) => a + b) / 60 / 255;
      const treble = dataArray.slice(200, 255).reduce((a, b) => a + b) / 55 / 255;
      const rms = Math.sqrt(dataArray.reduce((sum, v) => sum + v * v, 0) / dataArray.length) / 255;

      const beatThreshold = 0.5;
      const isBeat = bass > beatThreshold && (Date.now() - lastBeatTimeRef.current) > 300;
      if (isBeat) {
        lastBeatTimeRef.current = Date.now();
      }

      setAudioData({
        bass: Math.min(bass, 1),
        mid: Math.min(mid, 1),
        treble: Math.min(treble, 1),
        rms: Math.min(rms, 1),
        beat: isBeat,
        frequency: Array.from(dataArray)
      });

      requestAnimationFrame(animate);
    };

    const rafId = requestAnimationFrame(animate);

    return () => {
      audioElement.removeEventListener('play', initAudio);
      cancelAnimationFrame(rafId);
    };
  }, [audioElement]);

  return audioData;
}

export function createAudioReactive(audioElement) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 256;

  const source = audioContext.createMediaElementAudioSource(audioElement);
  source.connect(analyzer);
  analyzer.connect(audioContext.destination);

  return {
    getFrequency: () => {
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(dataArray);
      return dataArray;
    },
    getBass: () => {
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(dataArray);
      return dataArray.slice(0, 4).reduce((a, b) => a + b) / 4 / 255;
    },
    getRMS: () => {
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(dataArray);
      return Math.sqrt(dataArray.reduce((sum, v) => sum + v * v, 0) / dataArray.length) / 255;
    }
  };
}
