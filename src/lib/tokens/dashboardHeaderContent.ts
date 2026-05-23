import { UserAccountViewType } from "../store/slices/user/types";

type DashboardHeaderContent = {
  description: string;
  eyebrow: string;
  title: string;
};

export const dashboardHeaderContent: Record<
  UserAccountViewType,
  DashboardHeaderContent
> = {
  memberships: {
    eyebrow: "Community",
    title: "Memberships",
    description:
      "Keep up with the groups you follow and see what they are planning next.",
  },
  "my groups": {
    eyebrow: "Workspace",
    title: "My Groups",
    description:
      "Manage the communities you have created and jump back into the ones you lead.",
  },
  rsvps: {
    eyebrow: "Plans",
    title: "RSVP'd Events",
    description:
      "Track the events you have saved and revisit your upcoming schedule.",
  },
  settings: {
    eyebrow: "Account",
    title: "Settings",
    description: "Review the preferences and details tied to your account.",
  },
};
