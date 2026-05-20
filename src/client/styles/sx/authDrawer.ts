const authDrawerPaperSx = {
  width: { xs: 350, md: 500 },
  borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(18, 18, 18, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)",
  boxShadow: "-24px 0 56px rgba(0, 0, 0, 0.34)",
  backdropFilter: "blur(12px)",
  overflow: "hidden",
};

const authDrawerRootSx = {
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

const authDrawerHeaderSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 1,
  pb: 2.25,
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
};

const authDrawerEyebrowSx = {
  color: "#7cc6ff",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const authDrawerTitleSx = {
  color: "#ffffff",
  fontWeight: 600,
  letterSpacing: "-0.03em",
  lineHeight: 1.08,
  fontSize: { xs: "2.05rem", md: "2.25rem" },
};

const authDrawerDescriptionSx = {
  maxWidth: "34ch",
  color: "rgba(255, 255, 255, 0.64)",
  fontSize: "0.98rem",
  lineHeight: 1.7,
};

const authDrawerFormSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  width: "100%",
};

const authFieldControlSx = {
  width: "100%",
  display: "flex",
  gap: 0.8,
};

const authFieldLabelSx = {
  color: "rgba(255, 255, 255, 0.78)",
  fontSize: "0.95rem",
  fontWeight: 600,
  lineHeight: 1.3,
};

const authTextFieldSx = {
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
  "& .MuiFormHelperText-root": {
    mx: 0.25,
    mt: 0.9,
    color: "rgba(255, 255, 255, 0.48)",
    lineHeight: 1.55,
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: "#ff9e9e",
  },
};

const authSecondaryRowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1.5,
  flexWrap: "wrap",
};

const authCheckboxLabelSx = {
  color: "rgba(255, 255, 255, 0.78)",
  fontWeight: 600,
  "& .MuiFormControlLabel-label": {
    fontSize: "0.98rem",
  },
};

const authCheckboxSx = {
  color: "rgba(255, 255, 255, 0.42)",
  "&.Mui-checked": {
    color: "#7cc6ff",
  },
};

const authLinkSx = {
  color: "#9bd4ff",
  fontWeight: 600,
  textDecorationColor: "rgba(155, 212, 255, 0.34)",
  transition: "color 180ms ease, text-decoration-color 180ms ease",
  "&:hover": {
    color: "#d9eeff",
    textDecorationColor: "rgba(217, 238, 255, 0.58)",
  },
};

const authPrimaryButtonSx = {
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

const authDialogPaperSx = {
  width: "min(100%, 420px)",
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 28px 60px rgba(0, 0, 0, 0.34)",
  color: "#ffffff",
};

const authDialogTitleSx = {
  color: "#ffffff",
  fontSize: "1.5rem",
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

const authDialogTextSx = {
  color: "rgba(255, 255, 255, 0.64)",
  fontSize: "0.95rem",
  lineHeight: 1.7,
};

const authDialogContentSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  width: "100%",
};

const authDialogInputSx = {
  borderRadius: 2.8,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.026) 0%, rgba(255, 255, 255, 0.016) 100%)",
  color: "#ffffff",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(124, 198, 255, 0.34)",
  },
  "& input::placeholder": {
    color: "rgba(255, 255, 255, 0.34)",
    opacity: 1,
  },
};

const authDialogActionsSx = {
  px: 3,
  pb: 3,
  gap: 1.25,
};

const authSecondaryButtonSx = {
  minHeight: 42,
  borderRadius: 999,
  border: "1px solid rgba(124, 198, 255, 0.2)",
  color: "#b6ddff",
  background: "rgba(255, 255, 255, 0.03)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontWeight: 700,
  "&:hover": {
    background: "rgba(124, 198, 255, 0.08)",
    borderColor: "rgba(124, 198, 255, 0.28)",
  },
};

export {
  authCheckboxLabelSx,
  authCheckboxSx,
  authDialogActionsSx,
  authDialogContentSx,
  authDialogInputSx,
  authDialogPaperSx,
  authDialogTextSx,
  authDialogTitleSx,
  authDrawerDescriptionSx,
  authDrawerEyebrowSx,
  authDrawerFormSx,
  authDrawerHeaderSx,
  authDrawerPaperSx,
  authDrawerRootSx,
  authDrawerTitleSx,
  authFieldControlSx,
  authFieldLabelSx,
  authLinkSx,
  authPrimaryButtonSx,
  authSecondaryButtonSx,
  authSecondaryRowSx,
  authTextFieldSx,
};
