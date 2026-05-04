"use client";
import SimpleBackdrop from "@/src/client/components/ui/feedback/pending/backdrop";
import MyMemberships from "@/src/client/components/sections/user/myMemberships";
import { PariticpationsState } from "@/src/lib/store/slices/user/types";
import { JSX } from "react";
import AsyncFailedFallback from "../../ui/feedback/failure/asyncFailedFallback";
import DashboardFallback from "../../ui/feedback/fallbacks/dashboardFallback";
import { Button } from "@mui/material";
import { noGroupsFallbackActionButtonSx } from "@/src/client/styles/sx/noGroupsFallback";
import { useRouter } from "next/navigation";
import ExploreIcon from "@mui/icons-material/Explore";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { enqueueSidebar } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { noGroupsFallbackIconSx } from "@/src/client/styles/sx/noGroupsFallback";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import Fade from "@mui/material/Fade";
import FadeIn from "../../ui/box/motionboxes/fadeIn";

export default function RenderMemberships({
  participations,
}: {
  participations: PariticpationsState;
}): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleFallbackClick = () => {
    dispatch(enqueueSidebar(null));
    router.push("/");
  };

  const fallbackAction = () => {
    return (
      <Button
        sx={noGroupsFallbackActionButtonSx}
        variant="contained"
        onClick={handleFallbackClick}
        startIcon={<ExploreIcon />}
      >
        Explore Communities
      </Button>
    );
  };

  const icon = () => {
    return <Groups2RoundedIcon sx={noGroupsFallbackIconSx} />;
  };

  switch (participations.status) {
    case "pending": {
      return (
        <FadeIn keyValue="pending-memberships-backdrop">
          <SimpleBackdrop />
        </FadeIn>
      );
    }

    case "ready": {
      if (participations.data.memberships.length > 0) {
        return (
          <FadeIn keyValue={"my-memberships-fade-wrapper"}>
            <MyMemberships memberships={participations.data.memberships} />
          </FadeIn>
        );
      } else {
        return (
          <FadeIn keyValue={"dashbaord-fallback-fade-wrapper"}>
            <DashboardFallback
              eyeBrow={"Workspace"}
              fallbackTitle={"Nothing joined yet"}
              fallbackBody={
                "You have not joined any communities yet. Explore groups that match your interests and keep up with their events, members, and updates in one place."
              }
              action={fallbackAction()}
              icon={icon()}
              actionCaption={
                "Once you join a group, it will show up here for quick access to its activity and upcoming events."
              }
            />
          </FadeIn>
        );
      }
    }

    case "failed": {
      return (
        <FadeIn keyValue={"failure-fallback-fade-wrapper"}>
          <AsyncFailedFallback error={participations.error} />
        </FadeIn>
      );
    }
    case "n/a": {
      <FadeIn keyValue={"na-fallback-fade-wrapper"}>
        <AsyncFailedFallback message={participations.message} />
      </FadeIn>;
    }

    default: {
      return (
        <FadeIn keyValue={"default-case-backdrop-fade-wrapper"}>
          <SimpleBackdrop />
        </FadeIn>
      );
    }
  }
}
