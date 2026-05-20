const getGroupCardSurfaceSx = (
  variant: "landing" | "dashboard",
  focused: boolean,
) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: variant === "dashboard" ? 2 : 1.5,
  width: "100%",
  minHeight: variant === "dashboard" ? 280 : 244,
  px: variant === "dashboard" ? 2.5 : 2,
  py: variant === "dashboard" ? 2.25 : 2,
  borderRadius: variant === "dashboard" ? 4 : 3,
  border: "1px solid",
  borderColor: focused
    ? "rgba(124, 198, 255, 0.28)"
    : variant === "dashboard"
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(255, 255, 255, 0.06)",
  background:
    variant === "dashboard"
      ? "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)"
      : "linear-gradient(180deg, rgba(24, 24, 24, 0.94) 0%, rgba(16, 16, 16, 0.92) 100%)",
  boxShadow:
    variant === "dashboard"
      ? "0 18px 42px rgba(0, 0, 0, 0.2)"
      : "0 12px 28px rgba(0, 0, 0, 0.14)",
  cursor: "pointer",
  transition: "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease",
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor:
      variant === "dashboard"
        ? "rgba(124, 198, 255, 0.22)"
        : "rgba(255, 255, 255, 0.12)",
    boxShadow:
      variant === "dashboard"
        ? "0 22px 48px rgba(0, 0, 0, 0.24)"
        : "0 16px 36px rgba(0, 0, 0, 0.18)",
  },
});

const getGroupCardCategorySx = (variant: "landing" | "dashboard") => ({
  display: "block",
  mb: 0.25,
  color:
    variant === "dashboard"
      ? "rgba(124, 198, 255, 0.84)"
      : "rgba(255, 255, 255, 0.62)",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
});

const getGroupCardTitleSx = (variant: "landing" | "dashboard") => ({
  mb: 0.75,
  color: "#ffffff",
  fontWeight: 700,
  lineHeight: 1.15,
  letterSpacing: variant === "dashboard" ? "-0.02em" : "-0.01em",
  "&::before": {
    backgroundColor:
      variant === "dashboard" ? "rgba(124, 198, 255, 0.75)" : undefined,
    opacity: variant === "dashboard" ? 0.5 : 0.3,
  },
});

const getGroupCardDescriptionSx = (variant: "landing" | "dashboard") => ({
  color:
    variant === "dashboard"
      ? "rgba(255, 255, 255, 0.68)"
      : "rgba(255, 255, 255, 0.62)",
  lineHeight: 1.65,
  WebkitLineClamp: variant === "dashboard" ? 3 : 2,
});

const getGroupCardMetaWrapSx = (variant: "landing" | "dashboard") => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 0.75,
  mt: "auto",
  pt: variant === "dashboard" ? 1.5 : 1.25,
  borderTop:
    variant === "dashboard"
      ? "1px solid rgba(255, 255, 255, 0.08)"
      : "1px solid rgba(255, 255, 255, 0.06)",
});

const getGroupCardMetaChipSx = (
  variant: "landing" | "dashboard",
  accent?: boolean,
) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  minHeight: 28,
  px: 1,
  py: 0.45,
  borderRadius: 999,
  border: "1px solid",
  borderColor: accent
    ? "rgba(124, 198, 255, 0.24)"
    : "rgba(255, 255, 255, 0.08)",
  backgroundColor: accent
    ? variant === "dashboard"
      ? "rgba(124, 198, 255, 0.12)"
      : "rgba(124, 198, 255, 0.08)"
    : "rgba(255, 255, 255, 0.03)",
  color: accent ? "#cde6ff" : "rgba(255, 255, 255, 0.74)",
});

const getGroupCardMetaIconSx = (accent?: boolean) => ({
  fontSize: "0.95rem",
  color: accent ? "#7cc6ff" : "rgba(255, 255, 255, 0.58)",
});

export {
  getGroupCardCategorySx,
  getGroupCardDescriptionSx,
  getGroupCardMetaChipSx,
  getGroupCardMetaIconSx,
  getGroupCardMetaWrapSx,
  getGroupCardSurfaceSx,
  getGroupCardTitleSx,
};
