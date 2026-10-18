"use client";
import { JSX } from "react";
import { AsyncStateRenderer } from "../async/asyncStateRenderer";
import DashboardFallback from "../../ui/feedback/fallbacks/widgets/dashboardFallback";
import MyMemberships from "../../sections/user/myMemberships";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";
import GroupOffIcon from "@mui/icons-material/GroupOff";
import { noGroupsFallbackIconSx } from "@/src/client/styles/sx/noGroupsFallback";
import { MembershipsState } from "@/src/lib/store/slices/user/types";

export default function RenderMemberships({
  state,
}: {
  state: MembershipsState;
}): JSX.Element {
  const membershipsIcon = () => {
    return <GroupOffIcon sx={noGroupsFallbackIconSx} />;
  };

  return (
    <AsyncStateRenderer
      state={state}
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
