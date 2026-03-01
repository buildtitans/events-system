"use client";
import React from "react";
import Chip from "@mui/material/Chip"
import type { PresentedCategory } from "@/src/lib/store/slices/events/types"

type CategoryChipProps = {
    isActive: boolean,
    handleFilter: (category: PresentedCategory) => void,
    filter: PresentedCategory,
    pendingFilter: boolean
};

function CategoryChip({
    isActive,
    filter,
    handleFilter,
    pendingFilter
}: CategoryChipProps
): React.JSX.Element {

    const requestFilter = () => {
        handleFilter(filter);
    }

    return (
        <Chip
            color={(isActive) ? 'primary' : "default"}
            clickable={true}
            onClick={requestFilter}
            size="medium"
            label={filter}
            disabled={pendingFilter}
        />
    )
};

export default React.memo(CategoryChip)