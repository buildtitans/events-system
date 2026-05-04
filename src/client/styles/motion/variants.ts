import type { Variants } from "framer-motion"
import {
    fadeIn,
    fadeOut,
    smoothMount,
    smoothTransition
} from "./tokens"


const fadeInOut: Variants = {
    initial: {
        opacity: fadeOut.opacity
    },
    animate: {
        opacity: fadeIn.opacity,
        transition: smoothMount
    },
    exit: {
        opacity: fadeOut.opacity,
        transition: smoothTransition
    }
}


export { fadeInOut };