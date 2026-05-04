const confirmModalBackdropSx = {
  backgroundColor: "rgba(3, 5, 9, 0.6)",
  backdropFilter: "blur(10px)",
};

const confirmModalPaperSx = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "calc(100% - 32px)", sm: 440 },
  maxWidth: "100%",
  p: 3.5,
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 28px 60px rgba(0, 0, 0, 0.34)",
  color: "#ffffff",
};

const confirmModalEyebrowSx = {
  color: "#7cc6ff",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  textAlign: "center",
};

const confirmModalTitleSx = {
  color: "#ffffff",
  fontSize: { xs: "1.9rem", sm: "2rem" },
  fontWeight: 600,
  letterSpacing: "-0.03em",
  lineHeight: 1.08,
  textAlign: "center",
};

const confirmModalBodySx = {
  color: "rgba(255, 255, 255, 0.64)",
  fontSize: "0.98rem",
  lineHeight: 1.7,
  textAlign: "center",
};

const confirmModalActionsSx = {
  pt: 1,
  display: "flex",
  justifyContent: "center",
  gap: 1.25,
  flexWrap: "wrap",
};

const confirmModalPrimaryButtonSx = {
  minHeight: 44,
  minWidth: 140,
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
};

const confirmModalSecondaryButtonSx = {
  minHeight: 44,
  minWidth: 140,
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.12)",
  color: "#d7ecff",
  background: "rgba(255, 255, 255, 0.03)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontWeight: 700,
  "&:hover": {
    background: "rgba(255, 255, 255, 0.07)",
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
};

export {
  confirmModalActionsSx,
  confirmModalBackdropSx,
  confirmModalBodySx,
  confirmModalEyebrowSx,
  confirmModalPaperSx,
  confirmModalPrimaryButtonSx,
  confirmModalSecondaryButtonSx,
  confirmModalTitleSx,
};
