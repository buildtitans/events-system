const openedEventDrawerPaperSx = {
  width: { xs: 350, md: 550 },
  borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(18, 18, 18, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)",
  boxShadow: "-24px 0 56px rgba(0, 0, 0, 0.34)",
  backdropFilter: "blur(12px)",
};

const openedEventDrawerRootSx = {
  position: "relative",
  minHeight: "100%",
  width: "100%",
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(18, 18, 18, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-12% auto auto -14%",
    width: 220,
    height: 220,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.14) 0%, rgba(124, 198, 255, 0) 72%)",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "auto -18% -12% auto",
    width: 260,
    height: 260,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 74%)",
    pointerEvents: "none",
  },
};

const openedEventDrawerInnerSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 2.5,
  width: "100%",
  px: { xs: 2.5, md: 3 },
  py: { xs: 2.5, md: 3 },
};

const openedEventHeroSx = {
  width: "100%",
  pb: 2.5,
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
};

const openedEventGroupLinkSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.65,
  width: "fit-content",
  cursor: "pointer",
  color: "rgba(255, 255, 255, 0.7)",
  transition: "color 180ms ease, transform 180ms ease",
  "&:hover": {
    color: "#d7ecff",
    transform: "translateX(2px)",
  },
};

const openedEventGroupNameSx = {
  color: "inherit",
  fontSize: "0.9rem",
  fontWeight: 600,
  lineHeight: 1.4,
};

const openedEventTitleSx = {
  color: "#ffffff",
  fontWeight: 600,
  letterSpacing: "-0.03em",
  lineHeight: 1.16,
  fontSize: { xs: "1.95rem", md: "1.95rem" },
};

const openedEventImageWrapSx = {
  width: "100%",
  maxWidth: 500,
  borderRadius: 4,
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 18px 42px rgba(0, 0, 0, 0.22)",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
};

const openedEventImageMediaSx = {
  display: "block",
  width: "100%",
  height: "auto",
};

const openedEventImageSkeletonSx = {
  borderRadius: 0,
  overflow: "hidden",
};

const openedEventSectionSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  width: "100%",
  p: 1.35,
  borderRadius: 3.25,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
};

const openedEventSectionLabelSx = {
  color: "rgba(255, 255, 255, 0.4)",
  fontSize: "0.60rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const openedEventBodyTextSx = {
  color: "rgba(255, 255, 255, 0.82)",
  fontSize: "0.95rem",
  lineHeight: 1.75,
};

const openedEventMetaRowSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
  width: "100%",
};

const getOpenedEventMetaChipSx = (accent?: boolean) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.65,
  minHeight: 32,
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

const getOpenedEventMetaIconSx = (accent?: boolean) => ({
  fontSize: "1rem",
  color: accent ? "#7cc6ff" : "rgba(255, 255, 255, 0.58)",
});

const openedEventAttendancePanelSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.7,
  width: "100%",
  p: 1.6,
  borderRadius: 3.5,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.032) 0%, rgba(255, 255, 255, 0.02) 100%)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
};

const openedEventAttendancePrimarySx = {
  color: "#ffffff",
  fontSize: "1.02rem",
  fontWeight: 700,
  lineHeight: 1.5,
};

const openedEventAttendanceSecondarySx = {
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "0.98rem",
  fontWeight: 600,
  lineHeight: 1.55,
};

const openedEventControlsSectionSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.35,
  width: "100%",
  p: 1.6,
  borderRadius: 3.5,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.032) 0%, rgba(255, 255, 255, 0.018) 100%)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 18px 36px rgba(0, 0, 0, 0.16)",
};

const openedEventControlsFormSx = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 2,
};

const openedEventControlsTitleSx = {
  color: "#ffffff",
  fontSize: "1.05rem",
  fontWeight: 700,
  lineHeight: 1.3,
  letterSpacing: "-0.02em",
};

const openedEventControlsDescriptionSx = {
  color: "rgba(255, 255, 255, 0.62)",
  fontSize: "0.95rem",
  lineHeight: 1.7,
};

const openedEventActionsSectionSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.15,
  width: "100%",
  p: 0.7,
  borderRadius: 3.2,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.026) 0%, rgba(255, 255, 255, 0.014) 100%)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.025)",
};

const openedEventActionsLabelSx = {
  color: "rgba(255, 255, 255, 0.42)",
  fontSize: "0.66rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  textAlign: "center",
};

const openedEventActionRailSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    md: "repeat(auto-fit, minmax(0, 1fr))",
  },
  gap: 0.8,
  width: "100%",
  p: 0.7,
};

const getOpenedEventActionOptionSx = (active?: boolean) => ({
  minHeight: 48,
  width: "100%",
  justifyContent: "flex-start",
  gap: 0.95,
  px: 1.35,
  py: 1,
  borderRadius: 2.8,
  border: "1px solid",
  borderColor: active
    ? "rgba(124, 198, 255, 0.24)"
    : "rgba(255, 255, 255, 0.06)",
  background: active
    ? "linear-gradient(135deg, rgba(124, 198, 255, 0.18) 0%, rgba(92, 157, 255, 0.12) 100%)"
    : "rgba(255, 255, 255, 0.02)",
  color: active ? "#e5f2ff" : "rgba(255, 255, 255, 0.72)",
  textTransform: "none",
  fontWeight: 700,
  fontSize: "0.93rem",
  letterSpacing: "-0.01em",
  boxShadow: active ? "0 14px 30px rgba(92, 167, 255, 0.12)" : "none",
  "& .MuiButton-startIcon": {
    margin: 0,
    color: active ? "#7cc6ff" : "rgba(255, 255, 255, 0.46)",
  },
  "&:hover": {
    background: active
      ? "linear-gradient(135deg, rgba(124, 198, 255, 0.22) 0%, rgba(92, 157, 255, 0.16) 100%)"
      : "rgba(255, 255, 255, 0.05)",
    borderColor: active
      ? "rgba(124, 198, 255, 0.32)"
      : "rgba(255, 255, 255, 0.1)",
  },
});

const openedEventSelectLabelSx = {
  color: "rgba(255, 255, 255, 0.55)",
  "&.Mui-focused": {
    color: "#7cc6ff",
  },
};

const openedEventSelectSx = {
  borderRadius: 2.75,
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  color: "#ffffff",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.22)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(124, 198, 255, 0.3)",
  },
  "& .MuiSelect-icon": {
    color: "rgba(255, 255, 255, 0.72)",
  },
};

const openedEventMenuPaperSx = {
  mt: 0.75,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 18px 42px rgba(0, 0, 0, 0.26)",
  "& .MuiMenuItem-root": {
    color: "rgba(255, 255, 255, 0.82)",
    fontSize: "0.96rem",
    "&.Mui-selected": {
      backgroundColor: "rgba(124, 198, 255, 0.12)",
    },
    "&.Mui-selected:hover": {
      backgroundColor: "rgba(124, 198, 255, 0.16)",
    },
  },
};

const openedEventPrimaryButtonSx = {
  minHeight: 44,
  borderRadius: 999,
  border: "1px solid rgba(124, 198, 255, 0.28)",
  background:
    "linear-gradient(135deg, rgba(126, 204, 255, 0.98) 0%, rgba(96, 162, 255, 0.92) 100%)",
  color: "#07111d",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontWeight: 800,
  boxShadow: "0 14px 32px rgba(92, 167, 255, 0.2)",
  "& .MuiButton-startIcon": {
    color: "#07111d",
  },
  "&:hover": {
    background:
      "linear-gradient(135deg, rgba(141, 211, 255, 1) 0%, rgba(108, 172, 255, 0.94) 100%)",
    boxShadow: "0 18px 40px rgba(92, 167, 255, 0.26)",
  },
  "&.Mui-disabled": {
    background: "rgba(255, 255, 255, 0.08)",
    color: "rgba(255, 255, 255, 0.32)",
    borderColor: "rgba(255, 255, 255, 0.05)",
    boxShadow: "none",
  },
};

const getOpenedEventActionButtonSx = (danger?: boolean) => ({
  minHeight: 44,
  borderRadius: 999,
  border: "1px solid",
  borderColor: danger
    ? "rgba(255, 138, 138, 0.24)"
    : "rgba(124, 198, 255, 0.22)",
  background: danger
    ? "linear-gradient(135deg, rgba(255, 138, 138, 0.18) 0%, rgba(220, 72, 72, 0.12) 100%)"
    : "rgba(255, 255, 255, 0.04)",
  color: danger ? "#ffd2d2" : "#d8edff",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontWeight: 800,
  "& .MuiButton-startIcon": {
    color: danger ? "#ffb5b5" : "#7cc6ff",
  },
  "&:hover": {
    background: danger
      ? "linear-gradient(135deg, rgba(255, 138, 138, 0.22) 0%, rgba(220, 72, 72, 0.16) 100%)"
      : "rgba(124, 198, 255, 0.12)",
    borderColor: danger
      ? "rgba(255, 138, 138, 0.32)"
      : "rgba(124, 198, 255, 0.28)",
  },
});

const openedEventCheckboxLabelSx = {
  color: "rgba(255, 255, 255, 0.78)",
  fontWeight: 600,
  "& .MuiFormControlLabel-label": {
    fontSize: "0.98rem",
  },
  padding: 2,
};

const getOpenedEventCheckboxSx = (danger?: boolean) => ({
  color: "rgba(255, 255, 255, 0.42)",
  "&.Mui-checked": {
    color: danger ? "#ff8a8a" : "#7cc6ff",
  },
});

const openedEventPopoverPaperSx = {
  width: 340,
  p: 3,
  borderRadius: 3.5,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 24px 56px rgba(0, 0, 0, 0.32)",
};

const openedEventPopoverTitleSx = {
  color: "#ffffff",
  fontSize: "1.4rem",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  textAlign: "center",
};

const openedEventPopoverActionsSx = {
  display: "flex",
  gap: 1.5,
};

const openedEventSpinnerSx = {
  position: "relative",
  minHeight: "100%",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background:
    "linear-gradient(180deg, rgba(18, 18, 18, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)",
};

export {
  getOpenedEventActionOptionSx,
  getOpenedEventActionButtonSx,
  getOpenedEventCheckboxSx,
  getOpenedEventMetaChipSx,
  getOpenedEventMetaIconSx,
  openedEventActionRailSx,
  openedEventActionsLabelSx,
  openedEventActionsSectionSx,
  openedEventAttendancePanelSx,
  openedEventAttendancePrimarySx,
  openedEventAttendanceSecondarySx,
  openedEventBodyTextSx,
  openedEventCheckboxLabelSx,
  openedEventControlsDescriptionSx,
  openedEventControlsFormSx,
  openedEventControlsSectionSx,
  openedEventControlsTitleSx,
  openedEventDrawerInnerSx,
  openedEventDrawerPaperSx,
  openedEventDrawerRootSx,
  openedEventGroupLinkSx,
  openedEventGroupNameSx,
  openedEventHeroSx,
  openedEventImageMediaSx,
  openedEventImageSkeletonSx,
  openedEventImageWrapSx,
  openedEventMenuPaperSx,
  openedEventMetaRowSx,
  openedEventPopoverActionsSx,
  openedEventPopoverPaperSx,
  openedEventPopoverTitleSx,
  openedEventPrimaryButtonSx,
  openedEventSectionLabelSx,
  openedEventSectionSx,
  openedEventSelectLabelSx,
  openedEventSelectSx,
  openedEventSpinnerSx,
  openedEventTitleSx,
};
