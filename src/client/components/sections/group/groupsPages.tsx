"use client";
import type { JSX } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import GroupsPaginaton from "../../ui/box/pagination/groupsPagination";
import { GroupsPage } from "./groupsPage";
import { useGroupPages } from "@/src/lib/hooks/rendering/useGroupPages";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  GroupSchemaType,
  GroupsSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { assertIsDefined } from "@/src/lib/utils/helpers/assertIsDefined";
import type { GroupCardVariant } from "@/src/client/components/ui/box/cards/group";

export type CategoryMap = Map<string, string>;

export default function GroupsPagesContainer({
  groupsPages,
  silenceHeader,
  cardVariant = "landing",
}: {
  groupsPages: GroupsSchemaType[];
  silenceHeader?: boolean;
  cardVariant?: GroupCardVariant;
}): JSX.Element | null {
  const { currentPage, categoryMap, columns } = useGroupPages(groupsPages);
  const router = useRouter();

  const handleGroupClicked = useCallback(
    (slug: GroupSchemaType["slug"]) => {
      return () => {
        const route = `/group/${slug}`;
        router.push(route);
      };
    },
    [router],
  );

  if (!groupsPages[currentPage]) return null;

  return (
    <Fade in={assertIsDefined(groupsPages[currentPage])} timeout={400}>
      <Box minHeight={600}>
        {!silenceHeader && (
          <Typography variant="h2" gutterBottom>
            Groups
          </Typography>
        )}
        {groupsPages[currentPage] && (
          <GroupsPage
            handleGroupClicked={handleGroupClicked}
            key={groupsPages[currentPage][0].id}
            page={groupsPages[currentPage]}
            categoryMap={categoryMap}
            columns={columns}
            cardVariant={cardVariant}
          />
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            pt: cardVariant === "dashboard" ? 5 : 4,
          }}
        >
          <GroupsPaginaton numButtons={groupsPages.length} />
        </Box>
      </Box>
    </Fade>
  );
}
