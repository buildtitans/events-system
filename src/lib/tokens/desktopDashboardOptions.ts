import type { UserAccountViewType } from "@/src/lib/store/slices/user/types";

type ViewOptionsType = { label: string; value: UserAccountViewType };

type AccountPresentationOptions = Array<ViewOptionsType>;

const opts = [
  { label: "My Groups", value: "my groups" },
  { label: "Memberships", value: "memberships" },
  { label: "RSVPs", value: "rsvps" },
] satisfies AccountPresentationOptions;

export { opts };

export type { ViewOptionsType, AccountPresentationOptions };
