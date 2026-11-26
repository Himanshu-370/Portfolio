import { TYPEWRITER_TIMING, typewriterStep, type TypewriterState } from "@/lib/typewriter";

const target = document.querySelector<HTMLElement>("[data-typewriter]");
const dataEl = document.getElementById("typewriter-data");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let phrases: string[] = [];
try {
  phrases = JSON.parse(dataEl?.textContent ?? "[]") as string[];
} catch {
  phrases = [];
}

// Static first phrase (already server-rendered) when there's nothing to cycle or motion is reduced.
if (target && phrases.length > 1 && !reduceMotion) {
  let state: TypewriterState = { phrase: 0, chars: phrases[0]!.length, erasing: false };
  let timer: number | undefined;
  let visible = true;

  const run = (delay: number) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (!visible || document.hidden) return; // resumed by the observers below
      const frame = typewriterStep(state, phrases);
      state = frame.state;
      target.textContent = frame.text;
      run(frame.delay);
    }, delay);
  };

  // Pause off-screen and in background tabs; resume where it left off.
  new IntersectionObserver(([entry]) => {
    const wasVisible = visible;
    visible = Boolean(entry?.isIntersecting);
    if (visible && !wasVisible) run(TYPEWRITER_TIMING.type);
  }).observe(target);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && visible) run(TYPEWRITER_TIMING.type);
  });

  run(TYPEWRITER_TIMING.hold);
}
