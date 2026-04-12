"use client";
import { ActiveSidebar } from "@/src/lib/store/slices/rendering/types";
import MobileGroupNav from "../../ui/drawers/contents/mobileGroupNav";
import MobileDashboardNav from "../../ui/drawers/contents/mobileDashboardNav";

type MobileBottomDrawerProps = {
  sideBar: ActiveSidebar;
};

export default function RenderMobileBottomDrawer({
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
  }
}
