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
import DashboardFallback from "../../ui/feedback/fallbacks/dashboardFallback";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { changeAccountTab } from "@/src/lib/store/slices/user/userSlice";
import { noGroupsFallbackActionButtonSx, noGroupsFallbackIconSx } from "@/src/client/styles/sx/noGroupsFallback";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";

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
  const action = () => {
    return (
      <CheckMembershipsForNextEventButton />
    )
  }
  const icon = () => {
    return (
      <EventAvailableRoundedIcon sx={noGroupsFallbackIconSx} />
    )
  }



  if (rsvps.length === 0) {
    return (
    <DashboardFallback 
    eyeBrow={"Workspace"}
    fallbackTitle={"No commitments yet"}
    fallbackBody={"You have not saved any event plans yet. If you have already joined communities, your memberships can help you find upcoming events worth RSVPing to."}
    action={action()}
    icon={icon()}
    actionCaption={"Once you mark an event as going or interested, it will appear here for quick access later."}
    />);
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


function CheckMembershipsForNextEventButton() {
  const dispatch = useDispatch<AppDispatch>();
  const handleClick = () => {
    dispatch(changeAccountTab("memberships"));
  }

  return (
    <Button
    onClick={handleClick}
    sx={noGroupsFallbackActionButtonSx}
    variant={"contained"}
    startIcon={<PersonSearchIcon />}
    >
    Check memberships
    </Button>
  )
}