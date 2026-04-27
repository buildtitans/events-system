"use client";
import React from "react";
import Chip from "@mui/material/Chip"
import type { EventDisplayFilter } from "@/src/lib/store/slices/events/types"

type CategoryChipProps = {
    isActive: boolean,
    handleFilter: (filter: EventDisplayFilter) => void,
    filter: EventDisplayFilter,
    pendingFilter: boolean,
    isMobile: boolean
};

function CategoryChip({
    isActive,
    filter,
    handleFilter,
    pendingFilter,
    isMobile
}: CategoryChipProps
): React.JSX.Element {
    const activeBackground =
        "linear-gradient(135deg, rgba(126, 204, 255, 0.98) 0%, rgba(96, 162, 255, 0.92) 100%)";

    const requestFilter = () => {
        handleFilter(filter);
    }

    return (
        <Chip
            clickable={true}
            onClick={requestFilter}
            size={isMobile ? "small" : "medium"}
            label={filter}
            disabled={pendingFilter}
            aria-pressed={isActive}
            sx={{
                height: isMobile ? 34 : 40,
                borderRadius: 999,
                border: "1px solid",
                borderColor: isActive
                    ? "rgba(124, 198, 255, 0.45)"
                    : "rgba(255, 255, 255, 0.08)",
                background: isActive ? activeBackground : "rgba(255, 255, 255, 0.03)",
                color: isActive ? "#07111d" : "rgba(255, 255, 255, 0.88)",
                fontWeight: 700,
                transition: "all 180ms ease",
                boxShadow: isActive ? "0 14px 32px rgba(92, 167, 255, 0.24)" : "none",
                '& .MuiChip-label': {
                    px: isMobile ? 1.5 : 2.25,
                },
                '&:hover': {
                    background: isActive ? activeBackground : "rgba(255, 255, 255, 0.08)",
                    transform: "translateY(-1px)",
                },
                '&.Mui-focusVisible': {
                    outline: "2px solid rgba(124, 198, 255, 0.45)",
                    outlineOffset: "2px",
                },
                '&.Mui-disabled': {
                    opacity: 0.72,
                    color: isActive ? "#07111d" : "rgba(255, 255, 255, 0.52)",
                },
            }}
        />
    )
};

export default React.memo(CategoryChip)
