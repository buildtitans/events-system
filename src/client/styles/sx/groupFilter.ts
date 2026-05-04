const groupsFilterRootSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 1.25,
};

const groupsFilterSurfaceSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 1,
  px: 0.75,
  py: 0.75,
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.96) 0%, rgba(14, 14, 14, 0.94) 100%)",
  boxShadow: "0 16px 34px rgba(0, 0, 0, 0.18)",
};

const getGroupsFilterChipSx = (active: boolean, isMobile: boolean) => ({
  height: isMobile ? 36 : 40,
  borderRadius: 999,
  border: "1px solid",
  borderColor: active
    ? "rgba(124, 198, 255, 0.28)"
    : "rgba(255, 255, 255, 0.08)",
  background: active
    ? "linear-gradient(135deg, rgba(124, 198, 255, 0.94) 0%, rgba(90, 157, 255, 0.84) 100%)"
    : "rgba(255, 255, 255, 0.03)",
  color: active ? "#0d1117" : "rgba(255, 255, 255, 0.82)",
  boxShadow: active ? "0 14px 28px rgba(75, 145, 255, 0.22)" : "none",
  fontWeight: 700,
  letterSpacing: active ? "0.01em" : "0",
  transition:
    "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
  "& .MuiChip-label": {
    px: isMobile ? 1.4 : 1.7,
  },
  "&:hover": {
    transform: "translateY(-1px)",
    borderColor: active
      ? "rgba(124, 198, 255, 0.4)"
      : "rgba(255, 255, 255, 0.16)",
    background: active
      ? "linear-gradient(135deg, rgba(138, 206, 255, 0.96) 0%, rgba(108, 169, 255, 0.88) 100%)"
      : "rgba(255, 255, 255, 0.05)",
  },
  "&:focus-visible": {
    outline: "2px solid rgba(124, 198, 255, 0.45)",
    outlineOffset: 2,
  },
});

const groupsFilterPendingWrapSx = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 32,
  px: 1,
  borderRadius: 999,
  border: "1px solid rgba(124, 198, 255, 0.16)",
  backgroundColor: "rgba(124, 198, 255, 0.08)",
  color: "rgba(205, 230, 255, 0.82)",
};

export {
  getGroupsFilterChipSx,
  groupsFilterPendingWrapSx,
  groupsFilterRootSx,
  groupsFilterSurfaceSx,
};
