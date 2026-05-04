const openedGroupHeroRootSx = {
  width: "100%",
  pt: { xs: 2, md: 2.5 },
};

const openedGroupHeroPanelSx = {
  position: "relative",
  width: "100%",
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.22)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-28% auto auto -8%",
    width: 220,
    height: 220,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.16) 0%, rgba(124, 198, 255, 0) 72%)",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "auto -10% -78% auto",
    width: 280,
    height: 280,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 74%)",
    pointerEvents: "none",
  },
};

const openedGroupHeroInnerSx = {
  position: "relative",
  zIndex: 1,
  px: { xs: 2.5, md: 4 },
  py: { xs: 2.5, md: 3.25 },
};

const openedGroupHeroHeaderWrapSx = {
  maxWidth: { xs: "100%", lg: "70ch" },
};

const openedGroupHeroEyebrowSx = {
  display: "block",
  mb: 1,
  color: "rgba(124, 198, 255, 0.82)",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const openedGroupHeroTitleSx = {
  mb: 1,
  color: "#ffffff",
  fontWeight: 700,
  letterSpacing: "-0.03em",
  lineHeight: 1.04,
  fontSize: { xs: "2rem", md: "2.4rem" },
};

const openedGroupHeroHeaderDescriptionSx = {
  maxWidth: { xs: "100%", lg: "58ch" },
  color: "rgba(255, 255, 255, 0.68)",
  fontSize: { xs: "0.98rem", md: "1.02rem" },
  lineHeight: 1.7,
};

const openedGroupHeroDescriptionGridSx = {
  display: "grid",
  gap: { xs: 2, lg: 2.5 },
  gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.35fr) minmax(0, 0.95fr)" },
  alignItems: "start",
};

const openedGroupHeroLeadSx = {
  minWidth: 0,
};

const openedGroupHeroLeadLabelSx = {
  mb: 1,
  color: "rgba(255, 255, 255, 0.4)",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const openedGroupHeroLeadTextSx = {
  maxWidth: { xs: "100%", xl: "60ch" },
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: { xs: "1rem", md: "1.05rem" },
  lineHeight: 1.8,
};

const openedGroupHeroMetaGridSx = {
  display: "grid",
  gap: 1.25,
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
};

const openedGroupHeroMetaCardSx = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1,
  width: "100%",
  p: 1.2,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
};

const openedGroupHeroWideMetaCardSx = {
  gridColumn: { xs: "auto", sm: "1 / -1" },
};

const openedGroupHeroMetaIconWrapSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 34,
  height: 34,
  flexShrink: 0,
  borderRadius: "50%",
  border: "1px solid rgba(124, 198, 255, 0.18)",
  backgroundColor: "rgba(124, 198, 255, 0.1)",
  color: "#7cc6ff",
};

const openedGroupHeroMetaContentSx = {
  minWidth: 0,
};

const openedGroupHeroMetaLabelSx = {
  mb: 0.35,
  color: "rgba(255, 255, 255, 0.4)",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const openedGroupHeroMetaValueSx = {
  color: "#ffffff",
  fontWeight: 600,
  lineHeight: 1.45,
  overflowWrap: "anywhere",
};

const openedGroupHeroDividerSx = {
  borderColor: "rgba(255, 255, 255, 0.08)",
};

export {
  openedGroupHeroDescriptionGridSx,
  openedGroupHeroDividerSx,
  openedGroupHeroEyebrowSx,
  openedGroupHeroHeaderDescriptionSx,
  openedGroupHeroHeaderWrapSx,
  openedGroupHeroInnerSx,
  openedGroupHeroLeadLabelSx,
  openedGroupHeroLeadSx,
  openedGroupHeroLeadTextSx,
  openedGroupHeroMetaCardSx,
  openedGroupHeroMetaContentSx,
  openedGroupHeroMetaGridSx,
  openedGroupHeroMetaIconWrapSx,
  openedGroupHeroMetaLabelSx,
  openedGroupHeroMetaValueSx,
  openedGroupHeroPanelSx,
  openedGroupHeroRootSx,
  openedGroupHeroTitleSx,
  openedGroupHeroWideMetaCardSx,
};
