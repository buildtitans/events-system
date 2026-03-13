"use client";
import { JSX } from "react";
import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useHydrateEventDrawerFromRsvp } from "@/src/lib/hooks/hydration/useHydrateEventDrawerFromRsvp";
import RsvpListItem from "../../ui/list/rsvpListItem";
import { useRouter } from "next/navigation";

type MyRsvpsProps = {
  rsvps: RsvpSchemaType[];
};

export default function MyRsvps({ rsvps }: MyRsvpsProps): JSX.Element {
  const router = useRouter();
  const { handleOpenEditStatus } = useHydrateEventDrawerFromRsvp();

  const handleNavigateToGroup = (slug: RsvpSchemaType["group_slug"]) => {
    const path = `/group/${slug}`;
    router.push(path);
  };

  return (
    <Container>
      <Stack
        gap={6}
        divider={<Divider />}
        sx={{
          width: "100%",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            color="primary.info"
            fontWeight={"light"}
            fontSize={"30px"}
          >
            RSVP'd Events
          </Typography>
        </Box>

        <Box>
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {rsvps.map((rsvp) => (
              <RsvpListItem
                key={rsvp.event_id}
                rsvp={rsvp}
                handleOpenEditStatus={handleOpenEditStatus}
                handleNavigateToGroup={handleNavigateToGroup}
              />
            ))}
          </List>
        </Box>
      </Stack>
    </Container>
  );
}
