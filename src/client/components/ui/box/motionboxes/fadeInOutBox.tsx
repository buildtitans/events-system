import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import { fadeInOut } from "@/src/styles/motion/variants";
import React from "react";
import { SxProps, Theme } from "@mui/material/styles";
const MotionBox = motion.create(Box);


export default function FadeInOutBox({ children, styles }: { children: React.ReactNode, styles?: SxProps<Theme> }) {


    return (
        <MotionBox
            variants={fadeInOut}
            initial="initial"
            animate="animate"
            exit="exit"
            sx={styles}
        >
            {children}
        </MotionBox>
    )
}