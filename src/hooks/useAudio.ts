import { useRef, useCallback, useEffect, useState } from 'react';
import { DefenderType } from '@/types/game';

// Simple synthesized sounds using Web Audio API
export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgMusicIntervalRef = useRef<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    return audioContextRef.current;
  }, []);

  const playAttackSound = useCallback((defenderType: DefenderType) => {
    if (isMuted) return;

    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Different sounds for different defenders
    switch (defenderType) {
      case 'warrior':
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);
        oscillator.type = 'sawtooth';
        break;
      case 'archer':
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
        oscillator.type = 'sine';
        break;
      case 'miner':
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
        oscillator.type = 'square';
        break;
    }

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }, [isMuted, getAudioContext]);

  const playBgMusic = useCallback(() => {
    if (musicPlaying) return;

    const ctx = getAudioContext();
    setMusicPlaying(true);

    // Upbeat Arcade Melody
    const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 293.66, 349.23, 440.00, 587.33, 440.00, 349.23, 293.66]; // C-Major Arpeggio -> D-Minor
    let noteIndex = 0;

    const playNote = () => {
      if (isMuted) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(notes[noteIndex], ctx.currentTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);

      noteIndex = (noteIndex + 1) % notes.length;
    };

    playNote();
    bgMusicIntervalRef.current = window.setInterval(playNote, 400);
  }, [isMuted, musicPlaying, getAudioContext]);

  const stopBgMusic = useCallback(() => {
    if (bgMusicIntervalRef.current) {
      clearInterval(bgMusicIntervalRef.current);
      bgMusicIntervalRef.current = null;
    }
    setMusicPlaying(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (!isMuted) {
      stopBgMusic();
    }
  }, [isMuted, stopBgMusic]);

  useEffect(() => {
    return () => {
      stopBgMusic();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopBgMusic]);

  return {
    playAttackSound,
    playBgMusic,
    stopBgMusic,
    toggleMute,
    isMuted,
    musicPlaying,
  };
};
