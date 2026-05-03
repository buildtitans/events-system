"use client";
import AsyncFailedFallback from "@/src/client/components/ui/feedback/failure/asyncFailedFallback";
import UserAccountMenu from "@/src/client/components/ui/menus/userAccountMenu";
import SidebarSkeleton from "@/src/client/components/ui/skeletons/sidebarSkeleton";
import type { UserEmailState } from "@/src/lib/store/slices/user/types";
import { JSX } from "react";

export default function RenderUserAccountMenu({
  email,
}: {
  email: UserEmailState;
}): JSX.Element | null {
  switch (email.status) {
    case "pending": {
      return <SidebarSkeleton />;
    }

    case "ready": {
      return <UserAccountMenu email={email.data} />;
    }

    case "failed": {
      return <AsyncFailedFallback error={email.error} />;
    }
    case "n/a": {
        return (
            <AsyncFailedFallback message={email.message} />
        )
    }
    default: {
      return null;
    }
  }
}
