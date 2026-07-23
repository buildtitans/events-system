"use client";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { JSX } from "react";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { AsyncStateRenderer } from "../async/asyncStateRenderer";
import DashboardFallback from "../../ui/feedback/fallbacks/widgets/dashboardFallback";
import MyRsvps from "../../sections/user/myRsvps";
import GroupsIcon from "@mui/icons-material/Groups";
import MyMemberships from "../../sections/user/myMemberships";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";
import RenderMyGroups from "../groups/status/renderMyGroups";
import RsvpIcon from "@mui/icons-material/Rsvp";
import GroupOffIcon from "@mui/icons-material/GroupOff";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AddIcon from "@mui/icons-material/Add";
import { Container } from "@mui/material";
import { noGroupsFallbackIconSx } from "@/src/client/styles/sx/noGroupsFallback";
import { changeAccountTab } from "@/src/lib/store/slices/user/userSlice";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";

export default function RenderAccountView(): JSX.Element | null {
  const view = useSelector((s: RootState) => s.user.view);
  const participations = useSelector((s: RootState) => s.user.participations);
  const myGroups = useSelector((s: RootState) => s.user.myGroups);
  const memberships = useSelector((s: RootState) => s.user.memberships);
  const dispatch = useDispatch<AppDispatch>();

  const membershipsIcon = () => {
    return <GroupOffIcon sx={noGroupsFallbackIconSx} />;
  };

  const myGroupsIcon = () => {
    return <GroupsIcon sx={noGroupsFallbackIconSx} />;
  };

  const rsvpIcon = () => {
    return <RsvpIcon sx={noGroupsFallbackIconSx} />;
  };

  const myGroupsStartIcon = () => {
    return <AddIcon />;
  };

  const rsvpsStartIcon = () => {
    return <PersonSearchIcon />;
  };

  const handleEmptyRsvpsClick = () => {
    dispatch(changeAccountTab("memberships"));
  };

  const handleEmptyMyGroupsClick = () => {
    dispatch(enqueueDrawer("new group"));
  };

  switch (view) {
    case "rsvps": {
      return (
        <AsyncStateRenderer
          state={participations}
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
          {(state) => <MyRsvps rsvps={state} />}
        </AsyncStateRenderer>
      );
    }
    case "memberships": {
      return (
        <AsyncStateRenderer
          state={memberships}
          pending={() => <SimpleBackdrop />}
          empty={() => (
            <DashboardFallback
              eyeBrow={"Workspace"}
              fallbackBody={"No commitments yet"}
              fallbackTitle={"Nothing joined yet"}
              actionCaption={
                "Either create a group, browse existing groups to become a member of a community"
              }
              icon={membershipsIcon()}
            />
          )}
        >
          {(state) => <MyMemberships memberships={state} />}
        </AsyncStateRenderer>
      );
    }
    case "my groups": {
      return (
        <AsyncStateRenderer
          state={myGroups}
          pending={() => <SimpleBackdrop />}
          empty={() => (
            <DashboardFallback
              actionTitle={"Create Group"}
              icon={myGroupsIcon()}
              startIcon={myGroupsStartIcon()}
              handleClick={handleEmptyMyGroupsClick}
              eyeBrow={"Workspace"}
              fallbackTitle={"No groups created yet"}
              fallbackBody={
                "Create your first community to start organizing events, invite members, and build a shared schedule around the things you care about."
              }
            />
          )}
        >
          {(state) => (
            <Container>
              <RenderMyGroups pages={state} />
            </Container>
          )}
        </AsyncStateRenderer>
      );
    }

    default: {
      return assertNever(view);
    }
  }
}
