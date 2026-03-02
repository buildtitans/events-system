"use client";
import { EventCategories } from "@/src/features/events/categories";
import type { DomainStatus } from "@/src/lib/types/tokens/types";
import type { EventCategoriesProps } from "@/src/features/events/categories";
import { JSX } from "react";

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
       
        default: {
            return null
        }
    }

}