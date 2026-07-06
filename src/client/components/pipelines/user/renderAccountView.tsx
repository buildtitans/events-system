"use client";
import type { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import { JSX } from "react";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { AsyncStateRenderer } from "../async/asyncStateRenderer";
import DashboardFallback from "../../ui/feedback/fallbacks/dashboardFallback";
import MyRsvps from "../../sections/user/myRsvps";
import MyMemberships from "../../sections/user/myMemberships";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";
import RenderMyGroups from "../groups/status/renderMyGroups";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import RsvpIcon from "@mui/icons-material/Rsvp";
import { Container } from "@mui/material";
import { noGroupsFallbackIconSx } from "@/src/client/styles/sx/noGroupsFallback";
import CreateNewGroupButton from "../../ui/buttons/createNewGroupButton";

export default function RenderAccountView(): JSX.Element | null {
  const view = useSelector((s: RootState) => s.user.view);
  const participations = useSelector((s: RootState) => s.user.participations);
  const myGroups = useSelector((s: RootState) => s.user.myGroups);
  const memberships = useSelector((s: RootState) => s.user.memberships);

  const action = () => {
    return <CreateNewGroupButton />;
  };

  const myGroupsFallbackIcon = () => (
    <GroupRoundedIcon sx={noGroupsFallbackIconSx} />
  );

  const membershipsFallbackIcon = () => (
    <GroupAddIcon sx={noGroupsFallbackIconSx} />
  );

  const rsvpFallbackIcon = () => <RsvpIcon sx={noGroupsFallbackIconSx} />;

  switch (view) {
    case "rsvps": {
      return (
        <AsyncStateRenderer
          state={participations}
          empty={() => (
            <DashboardFallback
              eyeBrow={"Workspace"}
              fallbackBody="No commitments yet"
              fallbackTitle={"No commitments yet"}
              icon={rsvpFallbackIcon()}
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
              icon={membershipsFallbackIcon()}
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
              action={action()}
              icon={myGroupsFallbackIcon()}
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
