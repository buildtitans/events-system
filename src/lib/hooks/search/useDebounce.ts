"use client";
import { useCallback, useRef, useEffect } from "react";
const WAIT_DURATION = 300;

interface DebouncedCallbackHook<Args extends unknown[]> {
  run: (...args: Args) => void;
  cancel: () => void;
}

export const useDebouncedCallback = <Args extends unknown[]>(
  callBack: (...args: Args) => void | Promise<void>,
): DebouncedCallbackHook<Args> => {
  const timerRef = useRef<number | null>(null);

  const cancel = useCallback((): void => {
    if (timerRef.current === null) return;

    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const run = useCallback(
    (...args: Args): void => {
      cancel();

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        void callBack(...args);
      }, WAIT_DURATION);
    },
    [callBack, cancel],
  );

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return { run, cancel };
};
