const groupCalendarHeaderSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 0.75,
};

const groupCalendarEyebrowSx = {
  color: "rgba(124, 198, 255, 0.82)",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const groupCalendarTitleSx = {
  color: "#ffffff",
  fontSize: { xs: "2rem", md: "2.2rem" },
  fontWeight: 300,
  letterSpacing: "-0.02em",
  lineHeight: 1.08,
};

const groupCalendarDescriptionSx = {
  color: "rgba(255, 255, 255, 0.62)",
  fontSize: { xs: "0.94rem", md: "0.98rem" },
  lineHeight: 1.7,
};

const groupCalendarRootSx = {
  width: "100%",
  maxWidth: { xs: 380, md: 520 },
};

const groupCalendarSurfaceSx = {
  position: "relative",
  width: "100%",
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(24, 24, 24, 0.98) 0%, rgba(15, 15, 15, 0.96) 100%)",
  boxShadow: "0 18px 42px rgba(0, 0, 0, 0.22)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-25% auto auto -14%",
    width: 200,
    height: 200,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.14) 0%, rgba(124, 198, 255, 0) 74%)",
    pointerEvents: "none",
  },
};

const groupCalendarPickerWrapSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  p: { xs: 1.25, md: 1.5 },
};

const groupCalendarPickerSx = {
  width: "100%",
  maxWidth: "100%",
  backgroundColor: "transparent",
  color: "#ffffff",
  "& .MuiPickersCalendarHeader-root": {
    px: { xs: 0.25, md: 0.5 },
    py: 0.5,
    mb: 1,
  },
  "& .MuiPickersCalendarHeader-label": {
    color: "#ffffff",
    fontSize: { xs: "1.45rem", md: "1.6rem" },
    fontWeight: 700,
    letterSpacing: "-0.03em",
  },
  "& .MuiPickersArrowSwitcher-root": {
    gap: 0.5,
  },
  "& .MuiPickersArrowSwitcher-button": {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    color: "rgba(255, 255, 255, 0.82)",
    transition: "all 180ms ease",
    "&:hover": {
      backgroundColor: "rgba(124, 198, 255, 0.12)",
      borderColor: "rgba(124, 198, 255, 0.2)",
      color: "#d6ebff",
    },
  },
  "& .MuiDayCalendar-header": {
    justifyContent: "space-between",
    mb: 0.5,
  },
  "& .MuiDayCalendar-weekDayLabel": {
    width: { xs: 36, md: 44 },
    color: "rgba(255, 255, 255, 0.42)",
    fontSize: "0.74rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  "& .MuiPickersSlideTransition-root": {
    minHeight: { xs: 260, md: 320 },
  },
  "& .MuiDayCalendar-monthContainer": {
    rowGap: 0.5,
  },
};

const groupCalendarLegendSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
  px: { xs: 1.5, md: 2 },
  pb: { xs: 1.5, md: 1.75 },
  pt: 0.25,
};

const groupCalendarLegendItemSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.65,
  minHeight: 30,
  px: 1,
  py: 0.45,
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  color: "rgba(255, 255, 255, 0.74)",
};

const getGroupCalendarLegendDotSx = (state: "upcoming" | "past") => ({
  width: 9,
  height: 9,
  borderRadius: "50%",
  backgroundColor: state === "upcoming" ? "#7cc6ff" : "#ffbd59",
  boxShadow:
    state === "upcoming"
      ? "0 0 0 3px rgba(124, 198, 255, 0.14)"
      : "0 0 0 3px rgba(255, 189, 89, 0.12)",
});

const getGroupCalendarDayBadgeSx = (state: "upcoming" | "past") => ({
  "& .MuiBadge-badge": {
    minWidth: 8,
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: state === "upcoming" ? "#7cc6ff" : "#ffbd59",
    boxShadow: "0 0 0 2px rgba(16, 16, 16, 0.98)",
  },
});

const getGroupCalendarDaySx = (
  hasScheduledEvent: boolean,
  isPast: boolean,
  isOutsideMonth: boolean,
) => ({
  width: { xs: 36, md: 44 },
  height: { xs: 36, md: 44 },
  margin: 0,
  color: isOutsideMonth
    ? "rgba(255, 255, 255, 0.2)"
    : "rgba(255, 255, 255, 0.82)",
  fontWeight: hasScheduledEvent ? 700 : 600,
  borderRadius: "50%",
  border: "1px solid transparent",
  backgroundColor:
    hasScheduledEvent && !isPast
      ? "rgba(124, 198, 255, 0.05)"
      : hasScheduledEvent && isPast
        ? "rgba(255, 189, 89, 0.05)"
        : "transparent",
  transition: "all 180ms ease",
  "&:hover": {
    backgroundColor: "rgba(124, 198, 255, 0.12)",
    borderColor: "rgba(124, 198, 255, 0.18)",
  },
  "&.Mui-selected": {
    background:
      "linear-gradient(135deg, rgba(126, 204, 255, 0.98) 0%, rgba(96, 162, 255, 0.92) 100%)",
    color: "#07111d",
    boxShadow: "0 10px 24px rgba(92, 167, 255, 0.22)",
    fontWeight: 800,
  },
  "&.Mui-selected:hover": {
    background:
      "linear-gradient(135deg, rgba(141, 211, 255, 1) 0%, rgba(108, 172, 255, 0.94) 100%)",
  },
  "&.MuiPickersDay-today": {
    borderColor: hasScheduledEvent
      ? isPast
        ? "rgba(255, 189, 89, 0.3)"
        : "rgba(124, 198, 255, 0.34)"
      : "rgba(255, 255, 255, 0.22)",
  },
  "&.Mui-selected.MuiPickersDay-today": {
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
});

export {
  getGroupCalendarDayBadgeSx,
  getGroupCalendarDaySx,
  getGroupCalendarLegendDotSx,
  groupCalendarDescriptionSx,
  groupCalendarEyebrowSx,
  groupCalendarHeaderSx,
  groupCalendarLegendItemSx,
  groupCalendarLegendSx,
  groupCalendarPickerSx,
  groupCalendarPickerWrapSx,
  groupCalendarRootSx,
  groupCalendarSurfaceSx,
  groupCalendarTitleSx,
};
