import type { Variants } from "framer-motion"
import {
    fadeIn,
    fadeOut,
    smoothTransition
} from "./tokens"


const fadeInOut: Variants = {
    initial: {
        opacity: fadeOut.opacity
    },
    animate: {
        opacity: fadeIn.opacity,
        transition: smoothTransition
    },
    exit: {
        opacity: fadeOut.opacity,
        transition: smoothTransition
    }
}


export { fadeInOut };