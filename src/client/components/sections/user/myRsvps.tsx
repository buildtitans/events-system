"use client";
import { JSX } from "react";
import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import { useSelectEvent } from "@/src/lib/hooks/hydration/event/useSelectEvent";
import RsvpListItem from "../../ui/list/rsvps/rsvpListItem";
import { useRouter } from "next/navigation";

type MyRsvpsProps = {
  rsvps: RsvpSchemaType[];
};

export default function MyRsvps({ rsvps }: MyRsvpsProps): JSX.Element {
  const router = useRouter();
  const { handleOpenEvent } = useSelectEvent();

  const handleNavigateToGroup = (slug: RsvpSchemaType["group_slug"]) => {
    const path = `/group/${slug}`;
    router.push(path);
  };

  return (
    <Container>
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
            handleOpenEvent={handleOpenEvent}
            handleNavigateToGroup={handleNavigateToGroup}
          />
        ))}
      </List>
    </Container>
  );
}
