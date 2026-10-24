"use client";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Group from "@/src/client/components/ui/box/cards/group";
import type { GroupCardVariant } from "@/src/client/components/ui/box/cards/group";
import {
  GroupSchemaType,
  GroupDiscoverySummarySchemaType,
} from "@/src/schemas/groups/groupSchema";

type GroupsPageProps = {
  page: GroupDiscoverySummarySchemaType[];
  columns: number;
  handleGroupClicked: (slug: GroupSchemaType["slug"]) => () => void;
  cardVariant?: GroupCardVariant;
};

export function GroupsPage({
  page,
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
      {page.map((summary, index) => (
        <Group
          handleGroupClicked={handleGroupClicked}
          key={summary.group.id}
          summary={summary}
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
