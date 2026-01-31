import { NotFound } from "@/src/components/ui/feedback";
import Box from "@mui/material/Box";
import { motion } from 'framer-motion';
import { fadeInOut } from '@/src/styles/motion/variants';
const MotionBox = motion.create(Box);


function NoEventsFound() {

    return (
        <MotionBox
            variants={fadeInOut}
            initial="initial"
            animate="animate"
            exit="exit"

            sx={{ display: 'flex', marginTop: 20, flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "auto", gap: 2 }}>

            <h2 className="text-zinc-400 font-light tracking-tight text-xl">
                Could not find any events
            </h2>

            <NotFound />
        </MotionBox>
    )
}

export { NoEventsFound }