"use client";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { JSX } from "react";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { AsyncStateRenderer } from "../async/asyncStateRenderer";
import DashboardFallback from "../../ui/feedback/fallbacks/widgets/dashboardFallback";
import GroupsIcon from "@mui/icons-material/Groups";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";
import RenderMyGroups from "../groups/status/renderMyGroups";
import AddIcon from "@mui/icons-material/Add";
import { Container } from "@mui/material";
import { noGroupsFallbackIconSx } from "@/src/client/styles/sx/noGroupsFallback";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import Rsvps from "../../sections/user/rsvps";
import Memberships from "../../sections/user/memberships";

export default function RenderAccountView(): JSX.Element | null {
  const view = useSelector((s: RootState) => s.user.view);
  const myGroups = useSelector((s: RootState) => s.user.myGroups);
  const dispatch = useDispatch<AppDispatch>();

  const myGroupsIcon = () => {
    return <GroupsIcon sx={noGroupsFallbackIconSx} />;
  };

  const myGroupsStartIcon = () => {
    return <AddIcon />;
  };

  const handleEmptyMyGroupsClick = () => {
    dispatch(enqueueDrawer("new group"));
  };

  switch (view) {
    case "rsvps": {
      return <Rsvps />;
    }
    case "memberships": {
      return <Memberships />;
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
