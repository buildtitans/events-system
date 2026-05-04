import type { FadeProps } from "@mui/material/Fade";

const transitionDurations = {
  enter: 240,
  exit: 100,
} satisfies FadeProps["timeout"];

const easeTransition = {
  enter: "cubic-bezier(0.16, 1, 0.3, 1)",
  exit: "cubic-bezier(0.7, 0, 0.84, 0)",
} satisfies FadeProps["easing"];

export { transitionDurations, easeTransition };
