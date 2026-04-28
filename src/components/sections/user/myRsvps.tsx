"use client";
import { JSX } from "react";
import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import { useHydrateEventDrawerFromRsvp } from "@/src/lib/hooks/hydration/useHydrateEventDrawerFromRsvp";
import RsvpListItem from "../../ui/list/rsvpListItem";
import { useRouter } from "next/navigation";
import NoRsvps from "../../ui/feedback/fallbacks/noRsvps";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";

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
      <RenderRsvpsOrFallback
        rsvps={rsvps}
        handleNavigateToGroup={handleNavigateToGroup}
        handleOpenEditStatus={handleOpenEditStatus}
      />
    </Container>
  );
}

type RenderRsvpsOrFallbackProps = {
  rsvps: RsvpSchemaType[];
  handleOpenEditStatus: (event_id: EventSchemaType["id"]) => Promise<void>;
  handleNavigateToGroup: (slug: RsvpSchemaType["group_slug"]) => void;
};

function RenderRsvpsOrFallback({
  rsvps,
  handleNavigateToGroup,
  handleOpenEditStatus,
}: RenderRsvpsOrFallbackProps) {
  if (rsvps.length === 0) {
    return <NoRsvps />;
  }

  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
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
  );
}
