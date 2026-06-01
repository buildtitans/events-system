"use client";
import type { RootState } from "@/src/lib/store";
import { useSelector } from "react-redux";
import { JSX } from "react";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { AsyncStateRenderer } from "../asyncRenderer";
import DashboardFallback from "../../ui/feedback/fallbacks/dashboardFallback";
import MyRsvps from "../../sections/user/myRsvps";
import MyMemberships from "../../sections/user/myMemberships";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";
import RenderGroupsOrFallback from "../groups/status/renderGroupsOrFallback";
import { Container } from "@mui/material";

export default function RenderAccountView(): JSX.Element | null {
  const view = useSelector((s: RootState) => s.user.view);
  const participations = useSelector((s: RootState) => s.user.participations);
  const myGroups = useSelector((s: RootState) => s.user.myGroups);

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
            />
          )}
          pending={() => (<SimpleBackdrop />)}
        >
          {(state) => <MyRsvps rsvps={state.rsvps} />}
        </AsyncStateRenderer>
      );
    }
    case "memberships": {
      return (
        <AsyncStateRenderer 
        state={participations} 
        pending={() => (<SimpleBackdrop />)}
        >
          {(state) => (<MyMemberships memberships={state.memberships}/>)}
        </AsyncStateRenderer>
      )
    }
    case "my groups": {
       return (
        <AsyncStateRenderer 
        state={myGroups} 
        pending={() => (<SimpleBackdrop />)}
        >
          {(state) => (
            <Container>
              <RenderGroupsOrFallback pages={state}/>
            </Container>
            )}
        </AsyncStateRenderer>
      )
    }

    default: {
      return assertNever(view);
    }
  }
}
