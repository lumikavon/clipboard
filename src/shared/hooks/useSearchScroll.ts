import { useCallback, useRef } from "react";
import type { WheelEvent as ReactWheelEvent } from "react";

type UseSearchScrollOptions = {
  showSearchBox: boolean;
  setShowSearchBox: (val: boolean) => void;
  search: string;
  showSettings: boolean;
  appSettings: Record<string, string>;
};

export const useSearchScroll = ({
  showSettings,
}: UseSearchScrollOptions) => {
  const listScrollTopRef = useRef(0);
  const topReachedTimeRef = useRef(0);

  const handleListScroll = useCallback((offset: number) => {
    if (offset === 0 && listScrollTopRef.current > 0) {
      topReachedTimeRef.current = Date.now();
    }
    listScrollTopRef.current = offset;
  }, []);

  // Search box is always shown now: wheel gestures no longer hide/reveal it.
  const handleMainWheel = useCallback(
    (_e: ReactWheelEvent<HTMLElement>) => {
      if (showSettings) return;
    },
    [
      showSettings,
    ]
  );

  return {
    handleListScroll,
    handleMainWheel
  };
};
