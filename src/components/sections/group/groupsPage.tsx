"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { fadeInOut } from "@/src/styles/motion/variants"
import Grid from "@mui/material/Grid"
import Group from "@/src/components/ui/box/cards/group";
import type { CategoryMap } from "./groupsPages"
import { GroupSchemaType, GroupsSchemaType } from "@/src/schemas/groups/groupSchema"
import { getCategoryName } from "@/src/lib/utils/rendering/getCategoryName"
const MotionGrid = motion.create(Grid);

type GroupsPageProps = { page: GroupsSchemaType, categoryMap: CategoryMap, columns: number, handleGroupClicked: (slug: GroupSchemaType["slug"]) => () => void }

export function GroupsPage({ page, categoryMap, columns, handleGroupClicked }: GroupsPageProps) {
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
                    handleGroupClicked={handleGroupClicked}
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