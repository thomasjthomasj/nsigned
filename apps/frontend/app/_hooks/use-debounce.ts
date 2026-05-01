import { debounce } from "lodash"
import { useEffect, useMemo, useRef } from "react";

export const useDebounce = <F extends (...args: any) => any>(callback: F, timeout: number = 1000) => {
  const ref = useRef<F | undefined>(undefined);
  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...args: any) => {
      return ref.current?.(...args)
    };

    return debounce<(...args: any) => F>(func, timeout);
  }, [timeout]);

  return debouncedCallback;
}
