/**
 * useDebounce Hook
 *
 * Custom hook that debounces a value, delaying updates until after a specified delay
 * has passed since the last change. Useful for search inputs to avoid excessive API calls.
 */

import { useEffect, useState } from "react";

/**
 * Debounces a value by the specified delay
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 400ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timer if value changes before delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
