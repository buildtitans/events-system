import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import { fadeInOut } from "@/src/styles/motion/variants";
import React from "react";
const MotionBox = motion.create(Box);


export default function FadeInOutBox({ children }: { children: React.ReactNode }) {


    return (
        <MotionBox
            variants={fadeInOut}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {children}
        </MotionBox>
    )
}