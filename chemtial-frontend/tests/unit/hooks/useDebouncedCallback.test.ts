import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedCallback } from "../../../src/hooks/useDebouncedCallback";

describe("useDebouncedCallback", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("calls callback after delay", () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(cb, 300));

    act(() => {
      result.current("a");
    });
    expect(cb).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(cb).toHaveBeenCalledWith("a");
  });

  it("only calls once on rapid calls", () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(cb, 300));

    act(() => {
      result.current("a");
      result.current("b");
      result.current("c");
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(cb).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledWith("c");
  });

  it("clears timer on unmount", () => {
    const cb = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedCallback(cb, 300));

    act(() => {
      result.current("a");
    });
    unmount();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(cb).not.toHaveBeenCalled();
  });
});
