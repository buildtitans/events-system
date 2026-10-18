"use client";
import type { AppDispatch } from "@/src/lib/store";
import type { RsvpsState } from "@/src/lib/store/slices/user/types";
import { useDispatch } from "react-redux";
import type { JSX } from "react";
import { AsyncStateRenderer } from "../async/asyncStateRenderer";
import DashboardFallback from "../../ui/feedback/fallbacks/widgets/dashboardFallback";
import MyRsvps from "../../sections/user/myRsvps";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";
import RsvpIcon from "@mui/icons-material/Rsvp";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { noGroupsFallbackIconSx } from "@/src/client/styles/sx/noGroupsFallback";
import { changeAccountTab } from "@/src/lib/store/slices/user/userSlice";

export default function RenderRsvps({
  state,
}: {
  state: RsvpsState;
}): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const rsvpIcon = () => {
    return <RsvpIcon sx={noGroupsFallbackIconSx} />;
  };

  const rsvpsStartIcon = () => {
    return <PersonSearchIcon />;
  };

  const handleEmptyRsvpsClick = () => {
    dispatch(changeAccountTab("memberships"));
  };

  return (
    <AsyncStateRenderer
      state={state}
      empty={() => (
        <DashboardFallback
          eyeBrow={"Workspace"}
          fallbackTitle={"No commitments yet"}
          fallbackBody={
            "You have not saved any event plans yet. Once you mark an event as going or interested, it will appear here for quick access later."
          }
          actionTitle={"Check memberships"}
          icon={rsvpIcon()}
          startIcon={rsvpsStartIcon()}
          handleClick={handleEmptyRsvpsClick}
          actionCaption={
            "If you have already joined communities, your memberships can help you find upcoming events worth RSVPing to."
          }
        />
      )}
      pending={() => <SimpleBackdrop />}
    >
      {(state) => <MyRsvps participations={state} />}
    </AsyncStateRenderer>
  );
}
