"use client";
import { ActiveSidebar } from "@/src/lib/store/slices/rendering/types";
import MobileGroupNav from "../../ui/drawers/contents/mobileGroupNav";
import MobileDashboardNav from "../../ui/drawers/contents/mobileDashboardNav";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

type MobileBottomDrawerProps = {
  sideBar: ActiveSidebar;
};

export default function RenderMobileBottomDrawerContents({
  sideBar,
}: MobileBottomDrawerProps) {
  switch (sideBar) {
    case "group": {
        return (
            <MobileGroupNav />
        )
    }

    case "user": {
        return (
            <MobileDashboardNav />
        )
    }

    case null: {
      return null;
    }

    default: {
      assertNever(sideBar)
    }
  }
}
