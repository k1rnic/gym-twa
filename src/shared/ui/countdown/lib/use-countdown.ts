import { useCallback, useEffect, useRef, useState } from 'react';

type CountdownControls = {
  remaining: number;
  formatted: string;
  formattedHMS: string;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: (seconds?: number) => void;
  addSeconds: (seconds: number) => void;
  removeSeconds: (seconds: number) => void;
};

function formatMmSs(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function formatHMS(total: number) {
  const h = Math.floor(total / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((total % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function useCountDown(initialSeconds: number): CountdownControls {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const tick = useCallback(() => {
    setRemaining((prev) => {
      if (prev <= 1) {
        clear();
        setIsRunning(false);
        return 0;
      }
      return prev - 1;
    });
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const stop = useCallback(() => {
    clear();
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (seconds?: number) => {
      clear();
      setIsRunning(false);
      setRemaining(seconds ?? initialSeconds);
    },
    [initialSeconds],
  );

  const addSeconds = useCallback((seconds: number) => {
    setRemaining((prev) => prev + seconds);
  }, []);

  const removeSeconds = useCallback((seconds: number) => {
    setRemaining((prev) => Math.max(0, prev - seconds));
  }, []);

  useEffect(() => clear, []);

  return {
    remaining,
    formatted: formatMmSs(remaining),
    formattedHMS: formatHMS(remaining),
    isRunning,
    start,
    stop,
    reset,
    addSeconds,
    removeSeconds,
  };
}
