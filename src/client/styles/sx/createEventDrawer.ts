const createEventDrawerPaperSx = {
  width: { xs: 350, md: 550 },
  borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(18, 18, 18, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)",
  boxShadow: "-24px 0 56px rgba(0, 0, 0, 0.34)",
  backdropFilter: "blur(12px)",
  overflow: "hidden",
};

const createEventDrawerRootSx = {
  position: "relative",
  minHeight: "100%",
  width: "100%",
  px: { xs: 2.75, md: 3.5 },
  py: { xs: 3, md: 3.5 },
  display: "flex",
  flexDirection: "column",
  gap: 3,
  background:
    "linear-gradient(180deg, rgba(18, 18, 18, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-10% auto auto -16%",
    width: 220,
    height: 220,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.13) 0%, rgba(124, 198, 255, 0) 72%)",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "auto -18% -14% auto",
    width: 260,
    height: 260,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 74%)",
    pointerEvents: "none",
  },
};

const createEventDrawerHeaderSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 1,
  pb: 2.25,
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
};

const createEventDrawerEyebrowSx = {
  color: "#7cc6ff",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const createEventDrawerTitleSx = {
  color: "#ffffff",
  fontWeight: 600,
  letterSpacing: "-0.03em",
  lineHeight: 1.08,
  fontSize: { xs: "2rem", md: "2.15rem" },
};

const createEventDrawerDescriptionSx = {
  maxWidth: "34ch",
  color: "rgba(255, 255, 255, 0.64)",
  fontSize: "0.98rem",
  lineHeight: 1.7,
};

const createEventDrawerContextRowSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
  pt: 0.4,
};

const createEventDrawerContextChipSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.55,
  minHeight: 32,
  px: 1,
  py: 0.45,
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(255, 255, 255, 0.03)",
  color: "rgba(255, 255, 255, 0.76)",
};

const createEventDrawerFormSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  width: "100%",
};

const createEventFieldControlSx = {
  width: "100%",
  display: "flex",
};

const createEventTextFieldSx = {
  width: "100%",
  "& .MuiInputBase-root": {
    borderRadius: 2.8,
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.026) 0%, rgba(255, 255, 255, 0.016) 100%)",
    color: "#ffffff",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.025)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(124, 198, 255, 0.34)",
  },
  "& .MuiInputBase-input": {
    py: 1.1,
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255, 255, 255, 0.34)",
    opacity: 1,
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.58)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#7cc6ff",
  },
  "& .MuiSvgIcon-root": {
    color: "rgba(255, 255, 255, 0.62)",
  },
};

const createEventAutocompleteSx = {
  width: "100%",
  "& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator": {
    color: "rgba(255, 255, 255, 0.62)",
  },
};

const createEventAutocompletePaperSx = {
  mt: 0.75,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 18px 42px rgba(0, 0, 0, 0.26)",
  overflow: "hidden",
};

const createEventSuggestionRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.25,
  py: 1.05,
  px: 1.25,
  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
  "&:first-of-type": {
    borderTop: 0,
  },
};

const createEventSuggestionTextSx = {
  color: "rgba(255, 255, 255, 0.84)",
  fontWeight: 600,
  lineHeight: 1.45,
};

const createEventSuggestionChipSx = {
  height: 22,
  borderRadius: 999,
  border: "1px solid rgba(124, 198, 255, 0.16)",
  background: "rgba(124, 198, 255, 0.1)",
  color: "#cfe7ff",
  fontWeight: 700,
};

const createEventPrimaryButtonSx = {
  minHeight: 48,
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

export {
  createEventAutocompletePaperSx,
  createEventAutocompleteSx,
  createEventDrawerContextChipSx,
  createEventDrawerContextRowSx,
  createEventDrawerDescriptionSx,
  createEventDrawerEyebrowSx,
  createEventDrawerFormSx,
  createEventDrawerHeaderSx,
  createEventDrawerPaperSx,
  createEventDrawerRootSx,
  createEventDrawerTitleSx,
  createEventFieldControlSx,
  createEventPrimaryButtonSx,
  createEventSuggestionChipSx,
  createEventSuggestionRowSx,
  createEventSuggestionTextSx,
  createEventTextFieldSx,
};
