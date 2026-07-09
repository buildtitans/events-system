"use client";
import { EventCategories } from "@/src/client/features/events/categories";
import type { AppBootState } from "@/src/lib/types/state/types";
import type { EventCategoriesProps } from "@/src/client/features/events/categories";
import { JSX } from "react";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

type ChipRendererProps = {
  rest: EventCategoriesProps;
  status: AppBootState["status"];
};

export const RenderCategoryChips = ({
  status,
  rest,
}: ChipRendererProps): JSX.Element | null => {
  switch (status) {
    case "pending":
    case "failed":
    case "n/a":
    case "initial": {
      return null;
    }
    case "ready": {
      return <EventCategories {...rest} />;
    }
    default: {
      return assertNever(status);
    }
  }
};
