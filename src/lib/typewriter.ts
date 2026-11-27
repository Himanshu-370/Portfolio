/** Delays in ms for the hero's terminal-style retype loop. */
export const TYPEWRITER_TIMING = {
  type: 45, // per character typed
  erase: 18, // per character erased
  hold: 2400, // full phrase stays visible
  gap: 350, // pause on an empty line before the next phrase
} as const;

export interface TypewriterState {
  phrase: number; // index into phrases
  chars: number; // characters currently shown
  erasing: boolean;
}

export interface TypewriterFrame {
  state: TypewriterState;
  text: string;
  delay: number; // wait this long before the next step
}

/** One step of type → hold → erase → next phrase. Pure; the caller owns timers. */
export function typewriterStep(s: TypewriterState, phrases: readonly string[]): TypewriterFrame {
  const T = TYPEWRITER_TIMING;
  let next: TypewriterState;
  let delay: number;

  if (s.erasing && s.chars === 0) {
    next = { phrase: (s.phrase + 1) % phrases.length, chars: 1, erasing: false };
    delay = T.type;
  } else if (s.erasing) {
    next = { ...s, chars: s.chars - 1 };
    delay = next.chars === 0 ? T.gap : T.erase;
  } else if (s.chars >= phrases[s.phrase]!.length) {
    next = { ...s, chars: s.chars - 1, erasing: true };
    delay = T.erase;
  } else {
    next = { ...s, chars: s.chars + 1 };
    delay = next.chars === phrases[s.phrase]!.length ? T.hold : T.type;
  }

  return { state: next, text: phrases[next.phrase]!.slice(0, next.chars), delay };
}
