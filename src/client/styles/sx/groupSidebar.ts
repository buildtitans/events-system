import type { CurrentDisplay } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

const groupSidebarRootSx = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  px: 1,
  pt: "88px",
  pb: 1,
};

const groupSidebarPanelSx = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: 1.25,
  width: "100%",
  minHeight: "100%",
  p: 1,
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.24)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-20% auto auto -35%",
    width: 180,
    height: 180,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.16) 0%, rgba(124, 198, 255, 0) 74%)",
    pointerEvents: "none",
  },
};

const groupSidebarHeaderSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  p: 1.25,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
};

const groupSidebarHeaderBadgeSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 34,
  height: 34,
  borderRadius: "50%",
  flexShrink: 0,
  border: "1px solid rgba(124, 198, 255, 0.26)",
  background:
    "linear-gradient(135deg, rgba(126, 204, 255, 0.98) 0%, rgba(96, 162, 255, 0.9) 100%)",
  boxShadow: "0 12px 28px rgba(92, 167, 255, 0.2)",
  color: "#07111d",
};

const groupSidebarSectionLabelSx = {
  px: 1,
  pt: 0.25,
  color: "rgba(255, 255, 255, 0.42)",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const groupSidebarTitleSx = {
  color: "#ffffff",
  fontWeight: 700,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
};

const groupSidebarMetaRowSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
};

const getGroupSidebarMetaChipSx = (accent?: boolean) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.65,
  minHeight: 28,
  px: 1,
  py: 0.45,
  borderRadius: 999,
  border: "1px solid",
  borderColor: accent
    ? "rgba(124, 198, 255, 0.22)"
    : "rgba(255, 255, 255, 0.08)",
  backgroundColor: accent
    ? "rgba(124, 198, 255, 0.1)"
    : "rgba(255, 255, 255, 0.03)",
  color: accent ? "#cfe7ff" : "rgba(255, 255, 255, 0.74)",
});

const getGroupSidebarMetaIconSx = (accent?: boolean) => ({
  fontSize: "0.95rem",
  color: accent ? "#7cc6ff" : "rgba(255, 255, 255, 0.58)",
});

const groupSidebarNavSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  p: 0.75,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
};

const groupSidebarListSx = {
  p: 0,
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
};

const getGroupSidebarItemSx = (active: boolean) => ({
  alignItems: "center",
  borderRadius: 2.5,
  px: 1,
  py: 0.85,
  minHeight: 52,
  gap: 1,
  border: "1px solid",
  borderColor: active
    ? "rgba(124, 198, 255, 0.26)"
    : "rgba(255, 255, 255, 0.02)",
  background: active
    ? "linear-gradient(135deg, rgba(124, 198, 255, 0.2) 0%, rgba(96, 162, 255, 0.1) 100%)"
    : "transparent",
  color: active ? "#ffffff" : "rgba(255, 255, 255, 0.78)",
  transition: "all 180ms ease",
  "&:hover": {
    backgroundColor: active
      ? "rgba(124, 198, 255, 0.2)"
      : "rgba(255, 255, 255, 0.05)",
    borderColor: active
      ? "rgba(124, 198, 255, 0.32)"
      : "rgba(255, 255, 255, 0.08)",
  },
  "&.Mui-selected": {
    background:
      "linear-gradient(135deg, rgba(124, 198, 255, 0.2) 0%, rgba(96, 162, 255, 0.1) 100%)",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "rgba(124, 198, 255, 0.2)",
  },
});

const getGroupSidebarIconSx = (active: boolean) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: "50%",
  flexShrink: 0,
  background: active
    ? "linear-gradient(135deg, rgba(126, 204, 255, 0.98) 0%, rgba(96, 162, 255, 0.9) 100%)"
    : "rgba(255, 255, 255, 0.06)",
  color: active ? "#07111d" : "rgba(255, 255, 255, 0.7)",
  boxShadow: active ? "0 10px 24px rgba(92, 167, 255, 0.18)" : "none",
});

const groupSidebarActionsSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  p: 0.75,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
};

const groupSidebarActionCardSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  width: "100%",
  p: 1,
  borderRadius: 2.75,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
};

const groupSidebarActionTitleSx = {
  color: "#ffffff",
  fontWeight: 700,
  lineHeight: 1.2,
};

const groupSidebarActionDescriptionSx = {
  color: "rgba(255, 255, 255, 0.62)",
  fontSize: "0.87rem",
  lineHeight: 1.55,
};

const groupSidebarPrimaryButtonSx = {
  minWidth: "fit-content",
  minHeight: 40,
  px: 1.5,
  borderRadius: 999,
  border: "1px solid rgba(124, 198, 255, 0.28)",
  background:
    "linear-gradient(135deg, rgba(126, 204, 255, 0.98) 0%, rgba(96, 162, 255, 0.92) 100%)",
  color: "#07111d",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontWeight: 800,
  textWrap: "nowrap",
  boxShadow: "0 14px 32px rgba(92, 167, 255, 0.22)",
  "& .MuiButton-startIcon": {
    color: "#07111d",
  },
  "&:hover": {
    background:
      "linear-gradient(135deg, rgba(141, 211, 255, 1) 0%, rgba(108, 172, 255, 0.94) 100%)",
    boxShadow: "0 18px 40px rgba(92, 167, 255, 0.28)",
  },
};

const groupSidebarDangerButtonSx = {
  minWidth: "fit-content",
  minHeight: 40,
  px: 1.5,
  borderRadius: 999,
  border: "1px solid rgba(255, 138, 138, 0.22)",
  background: "rgba(255, 138, 138, 0.08)",
  color: "#ffd2d2",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontWeight: 800,
  textWrap: "nowrap",
  "& .MuiButton-startIcon": {
    color: "#ffb5b5",
  },
  "&:hover": {
    background: "rgba(255, 138, 138, 0.12)",
    borderColor: "rgba(255, 138, 138, 0.3)",
  },
};

const groupSidebarSkeletonSx = {
  width: "100%",
  height: "100%",
  px: 1,
  pt: "88px",
  pb: 1,
};

const groupSidebarRoleLabelMap: Record<GroupMemberSchemaType["role"], string> = {
  organizer: "Organizer",
  member: "Member",
  anonymous: "Guest",
};

const groupSidebarSectionLabelMap: Record<CurrentDisplay, string> = {
  overview: "Overview",
  events: "Events",
  "group history": "History",
};

export {
  getGroupSidebarIconSx,
  getGroupSidebarItemSx,
  getGroupSidebarMetaChipSx,
  getGroupSidebarMetaIconSx,
  groupSidebarActionCardSx,
  groupSidebarActionDescriptionSx,
  groupSidebarActionsSx,
  groupSidebarActionTitleSx,
  groupSidebarDangerButtonSx,
  groupSidebarHeaderBadgeSx,
  groupSidebarHeaderSx,
  groupSidebarListSx,
  groupSidebarMetaRowSx,
  groupSidebarNavSx,
  groupSidebarPanelSx,
  groupSidebarPrimaryButtonSx,
  groupSidebarRootSx,
  groupSidebarRoleLabelMap,
  groupSidebarSectionLabelMap,
  groupSidebarSectionLabelSx,
  groupSidebarSkeletonSx,
  groupSidebarTitleSx,
};
