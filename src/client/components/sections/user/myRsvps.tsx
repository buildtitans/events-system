"use client";
import { JSX } from "react";
import type { RsvpSurfaceSchemaType } from "@/src/schemas/events/rsvpSchema";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import { useSelectEvent } from "@/src/lib/hooks/hydration/event/useSelectEvent";
import RsvpListItem from "../../ui/list/rsvps/rsvpListItem";
import { useRouter } from "next/navigation";

type MyRsvpsProps = {
  participations: RsvpSurfaceSchemaType[];
};

export default function MyRsvps({ participations }: MyRsvpsProps): JSX.Element {
  const router = useRouter();
  const { handleOpenEvent } = useSelectEvent();

  const handleNavigateToGroup = (
    slug: RsvpSurfaceSchemaType["meta"]["group_slug"],
  ) => {
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
        {participations.map((participation) => (
          <RsvpListItem
            key={participation.rsvp.event_id}
            rsvp={participation}
            handleOpenEvent={handleOpenEvent}
            handleNavigateToGroup={handleNavigateToGroup}
          />
        ))}
      </List>
    </Container>
  );
}
