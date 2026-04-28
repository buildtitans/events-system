"use client";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Group from "@/src/components/ui/box/cards/group";
import type { GroupCardVariant } from "@/src/components/ui/box/cards/group";
import type { CategoryMap } from "./groupsPages";
import {
  GroupSchemaType,
  GroupsSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { getCategoryName } from "@/src/lib/utils/rendering/getCategoryName";

type GroupsPageProps = {
  page: GroupsSchemaType;
  categoryMap: CategoryMap;
  columns: number;
  handleGroupClicked: (slug: GroupSchemaType["slug"]) => () => void;
  cardVariant?: GroupCardVariant;
};

export function GroupsPage({
  page,
  categoryMap,
  columns,
  handleGroupClicked,
  cardVariant = "landing",
}: GroupsPageProps) {
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  return (
    <Grid
      container
      spacing={cardVariant === "dashboard" ? 3 : 2}
      columns={columns}
      sx={{ minHeight: 400 }}
    >
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
          variant={cardVariant}
        />
      ))}
    </Grid>
  );
}
