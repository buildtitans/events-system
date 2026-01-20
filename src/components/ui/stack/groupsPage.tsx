"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { fadeInOut } from "@/src/styles/motion/variants"
import Grid from "@mui/material/Grid"
import { Group } from "../box/cards/group"
import type { CategoryMap } from "./groupsContainer"
import { GroupsSchemaType } from "@/src/schemas/groupSchema"
import { getCategoryName } from "@/src/lib/utils/rendering/getCategoryName"
const MotionGrid = motion.create(Grid);

export function GroupsPage({ page, categoryMap, columns }: { page: GroupsSchemaType, categoryMap: CategoryMap, columns: number }) {
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);

    const handleFocus = (index: number) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    return (
        <MotionGrid
            variants={fadeInOut}
            initial="initial"
            animate="animate"
            exit="exit"

            container spacing={2} columns={columns} sx={{ minHeight: 800 }}>
            {page.map((group, index) => (
                <Group
                    key={group.id}
                    categoryName={getCategoryName(group.category_id, categoryMap)}
                    group={group}
                    index={index}
                    handleBlur={handleBlur}
                    handleFocus={handleFocus}
                    focusedCardIndex={focusedCardIndex}
                />

            ))}
        </MotionGrid>
    )
}