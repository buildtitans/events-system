"use client";
import { EventCategories } from "@/src/client/features/events/categories";
import type { DomainStatus } from "@/src/lib/types/tokens/types";
import type { EventCategoriesProps } from "@/src/client/features/events/categories";
import { JSX } from "react";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

type ChipRendererProps = { rest: EventCategoriesProps, status: DomainStatus}

export const RenderCategoryChips = ({ status, rest }:ChipRendererProps): JSX.Element | null => {

    switch(status) {
        case "idle": {
            return (
                <EventCategories 
                {...rest}
                />
            )
        }
        case "pending": 
        case "failed":
        case "warning":
        case "initial": {
            return null
        }
        default: {
            return assertNever(status)
        }
    }
}