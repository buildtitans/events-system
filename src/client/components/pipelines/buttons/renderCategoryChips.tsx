"use client";
import { EventCategories } from "@/src/client/features/events/categories";
import type { EventCategoriesProps } from "@/src/client/features/events/categories";
import { JSX } from "react";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

type ChipRendererProps = {
  rest: EventCategoriesProps;
};

export default function RenderCategoryChips({
  rest,
}: ChipRendererProps): JSX.Element | null {
  const appBoot = useSelector((s: RootState) => s.rendering.appBoot);

  switch (appBoot.status) {
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
      return assertNever(appBoot);
    }
  }
}
