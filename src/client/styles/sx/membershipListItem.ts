import type { GroupRoleSchemaType } from "@/src/schemas/groups/groupMembersSchema";

const membershipListItemSx = {
  position: "relative",
  px: { xs: 2, md: 2.5 },
  py: { xs: 2, md: 2.25 },
  borderRadius: 3.5,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(24, 24, 24, 0.98) 0%, rgba(15, 15, 15, 0.96) 100%)",
  boxShadow: "0 16px 38px rgba(0, 0, 0, 0.18)",
  overflow: "hidden",
  transition:
    "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-40% auto auto -18%",
    width: 180,
    height: 180,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.12) 0%, rgba(124, 198, 255, 0) 72%)",
    pointerEvents: "none",
  },
  "&:hover": {
    borderColor: "rgba(124, 198, 255, 0.2)",
    boxShadow: "0 20px 44px rgba(0, 0, 0, 0.24)",
  },
};

const membershipListItemLayoutSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  justifyContent: "space-between",
  alignItems: { xs: "flex-start", md: "stretch" },
  gap: { xs: 2, md: 3 },
  width: "100%",
};

const membershipPrimaryColumnSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  flex: 1,
  minWidth: 0,
};

const membershipHeaderSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  minWidth: 0,
};

const membershipTitleRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  flexWrap: "wrap",
  minWidth: 0,
};

const membershipTitleSx = {
  color: "#ffffff",
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  "&::before": {
    backgroundColor: "rgba(124, 198, 255, 0.76)",
    opacity: 0.42,
  },
};

const getMembershipRoleChipSx = (role: GroupRoleSchemaType) => ({
  height: 24,
  borderRadius: 999,
  border: "1px solid",
  borderColor:
    role === "organizer"
      ? "rgba(124, 198, 255, 0.28)"
      : "rgba(255, 255, 255, 0.08)",
  background:
    role === "organizer"
      ? "linear-gradient(135deg, rgba(124, 198, 255, 0.16) 0%, rgba(96, 162, 255, 0.1) 100%)"
      : "rgba(255, 255, 255, 0.04)",
  color: role === "organizer" ? "#cfe7ff" : "rgba(255, 255, 255, 0.76)",
  fontWeight: 700,
  textTransform: "capitalize",
  "& .MuiChip-label": {
    px: 1.2,
  },
  "& .MuiChip-icon": {
    ml: 0.8,
  },
});

const membershipMetaRowSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
};

const getMembershipMetaChipSx = (accent?: boolean) => ({
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

const getMembershipMetaIconSx = (accent?: boolean) => ({
  fontSize: "0.95rem",
  color: accent ? "#7cc6ff" : "rgba(255, 255, 255, 0.58)",
});

const membershipBodySx = {
  minWidth: 0,
};

const membershipDescriptionSx = {
  color: "rgba(255, 255, 255, 0.68)",
  lineHeight: 1.75,
  fontSize: { xs: "0.96rem", md: "1rem" },
};

const membershipNextEventWrapSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.7,
  minWidth: { xs: "100%", md: "fit-content" },
  alignItems: { xs: "flex-start", md: "flex-end" },
  justifyContent: "flex-start",
};

const membershipNextEventEyebrowSx = {
  color: "rgba(255, 255, 255, 0.4)",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const getMembershipEventChipSx = (state: "upcoming" | "past" | "empty") => ({
  height: 34,
  borderRadius: 999,
  border: "1px solid",
  borderColor:
    state === "upcoming"
      ? "rgba(124, 198, 255, 0.28)"
      : "rgba(255, 255, 255, 0.08)",
  background:
    state === "upcoming"
      ? "linear-gradient(135deg, rgba(124, 198, 255, 0.16) 0%, rgba(96, 162, 255, 0.1) 100%)"
      : state === "past"
        ? "rgba(255, 255, 255, 0.06)"
        : "rgba(255, 255, 255, 0.04)",
  color: state === "upcoming" ? "#d7ecff" : "rgba(255, 255, 255, 0.76)",
  "& .MuiChip-label": {
    px: 1.2,
    fontWeight: 700,
  },
  "& .MuiChip-icon": {
    ml: 0.9,
    color:
      state === "upcoming"
        ? "#7cc6ff"
        : state === "past"
          ? "rgba(255, 255, 255, 0.72)"
          : "rgba(255, 255, 255, 0.58)",
  },
});

export {
  getMembershipEventChipSx,
  getMembershipMetaChipSx,
  getMembershipMetaIconSx,
  getMembershipRoleChipSx,
  membershipBodySx,
  membershipDescriptionSx,
  membershipHeaderSx,
  membershipListItemLayoutSx,
  membershipListItemSx,
  membershipMetaRowSx,
  membershipNextEventEyebrowSx,
  membershipNextEventWrapSx,
  membershipPrimaryColumnSx,
  membershipTitleRowSx,
  membershipTitleSx,
};
