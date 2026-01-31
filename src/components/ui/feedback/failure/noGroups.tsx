import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { NotFound } from './notFound';
import type { JSX } from 'react';
import { motion } from 'framer-motion';
import { fadeInOut } from '@/src/styles/motion/variants';
const MotionBox = motion.create(Box);

export default function NoGroups(): JSX.Element {

    return (
        <MotionBox
            variants={fadeInOut}
            initial="initial"
            animate="animate"
            exit="exit"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                height: '300px',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
            }} >
            <NotFound />
            <Typography component={"h4"} color="info">
                No groups found
            </Typography>
        </MotionBox>
    )
}