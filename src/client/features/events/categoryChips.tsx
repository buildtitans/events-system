"use client";
import { type JSX } from "react";
import Box from "@mui/material/Box";
import { EventCategoriesProps } from "./categories";
import { useChangeActiveCategory } from "@/src/lib/hooks/filters/useChangeActiveCategory";
import { activeCategorySx } from "@/src/lib/tokens/sxTokens";
import RenderCategoryChips from "@/src/client/components/pipelines/buttons/renderCategoryChips";

function CategoryChips({ isMobile }: { isMobile: boolean }): JSX.Element {
  const { pendingFilter, filterFor } = useChangeActiveCategory();

  const chipProps: EventCategoriesProps = {
    filterFor,
    pendingFilter,
    isMobile,
  };

  return (
    <Box sx={activeCategorySx}>
      <RenderCategoryChips rest={chipProps} />
    </Box>
  );
}

export { CategoryChips };
