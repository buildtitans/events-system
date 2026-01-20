import type { Transition, Target } from "framer-motion";

export const softEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const smoothTransition: Transition = {
    type: "tween",
    duration: 0.3,
    ease: softEase,
};

export const smoothMount: Transition = {
    type: "tween",
    delay: 0.3,
    duration: 0.3,
    ease: softEase
}

export const fadeIn: Target = {
    opacity: 1,
};

export const fadeOut: Target = {
    opacity: 0,
};
