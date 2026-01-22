/**
 * Tests for useDebounce hook
 */

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebounce } from "./use-debounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("debounces value changes with default delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "initial" },
    });

    // Value should remain initial before delay
    expect(result.current).toBe("initial");

    // Update the value
    rerender({ value: "updated" });

    // Value should still be initial immediately after update
    expect(result.current).toBe("initial");

    // Fast-forward past the default 400ms delay
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // Now the value should be updated
    expect(result.current).toBe("updated");
  });

  it("debounces value changes with custom delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "initial" },
    });

    // Update the value
    rerender({ value: "updated" });

    // Fast-forward to 200ms (before delay)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("initial");

    // Fast-forward to 300ms (at delay threshold)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("updated");
  });

  it("resets timer on rapid value changes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: "initial" },
    });

    // First update
    rerender({ value: "update1" });

    // Advance 300ms (not enough to trigger)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("initial");

    // Second update before timer completes
    rerender({ value: "update2" });

    // Advance 300ms more (total 600ms from start, but only 300ms from second update)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    // Should still be initial because timer was reset
    expect(result.current).toBe("initial");

    // Advance remaining 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Now should be the latest value
    expect(result.current).toBe("update2");
  });

  it("handles empty string correctly", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "search" },
    });

    expect(result.current).toBe("search");

    // Clear search
    rerender({ value: "" });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe("");
  });

  it("cleans up timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    const { rerender, unmount } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "initial" },
    });

    rerender({ value: "updated" });

    // Unmount before timer completes
    unmount();

    // Verify clearTimeout was called
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });
});
