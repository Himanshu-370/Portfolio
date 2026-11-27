import { describe, expect, it } from "vitest";
import { TYPEWRITER_TIMING as T, typewriterStep, type TypewriterState } from "@/lib/typewriter";

const phrases = ["ab", "xyz"];

describe("typewriterStep", () => {
  it("starts erasing a fully typed phrase", () => {
    const r = typewriterStep({ phrase: 0, chars: 2, erasing: false }, phrases);
    expect(r.state).toEqual({ phrase: 0, chars: 1, erasing: true });
    expect(r.text).toBe("a");
    expect(r.delay).toBe(T.erase);
  });

  it("waits a short gap after erasing the last character", () => {
    const r = typewriterStep({ phrase: 0, chars: 1, erasing: true }, phrases);
    expect(r.state).toEqual({ phrase: 0, chars: 0, erasing: true });
    expect(r.text).toBe("");
    expect(r.delay).toBe(T.gap);
  });

  it("moves to the next phrase once empty", () => {
    const r = typewriterStep({ phrase: 0, chars: 0, erasing: true }, phrases);
    expect(r.state).toEqual({ phrase: 1, chars: 1, erasing: false });
    expect(r.text).toBe("x");
    expect(r.delay).toBe(T.type);
  });

  it("holds when a phrase finishes typing", () => {
    const r = typewriterStep({ phrase: 1, chars: 2, erasing: false }, phrases);
    expect(r.state).toEqual({ phrase: 1, chars: 3, erasing: false });
    expect(r.text).toBe("xyz");
    expect(r.delay).toBe(T.hold);
  });

  it("wraps from the last phrase back to the first", () => {
    const r = typewriterStep({ phrase: 1, chars: 0, erasing: true }, phrases);
    expect(r.state.phrase).toBe(0);
    expect(r.text).toBe("a");
  });

  it("cycles through every phrase and returns to the start", () => {
    let state: TypewriterState = { phrase: 0, chars: 2, erasing: false };
    const seen = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const r = typewriterStep(state, phrases);
      if (!r.state.erasing && r.state.chars === phrases[r.state.phrase]!.length) seen.add(r.text);
      state = r.state;
    }
    expect([...seen].sort()).toEqual(["ab", "xyz"]);
  });
});
