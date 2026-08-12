const filterGroupsDrawerRootSx = {
  position: "relative",
  minHeight: "100%",
  width: "100%",
  px: { xs: 2.75, md: 3.5 },
  py: { xs: 3, md: 3.5 },
  gap: 3,
  background:
    "linear-gradient(180deg, rgba(18, 18, 18, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)",
  "&::before": {
    content: '\"\"',
    position: "absolute",
    inset: "-12% auto auto -18%",
    width: 240,
    height: 240,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.13) 0%, rgba(124, 198, 255, 0) 72%)",
    pointerEvents: "none",
  },
};

const filterGroupsDrawerHeaderSx = {
  position: "relative",
  zIndex: 1,
  gap: 1,
  pb: 2.25,
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
};

const filterGroupsDrawerEyebrowSx = {
  color: "#7cc6ff",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const filterGroupsDrawerTitleRowSx = {
  alignItems: "center",
  gap: 1.25,
};

const filterGroupsDrawerIconSx = {
  color: "#7cc6ff",
  fontSize: "1.75rem",
};

const filterGroupsDrawerTitleSx = {
  color: "#ffffff",
  fontWeight: 600,
  letterSpacing: "-0.03em",
  lineHeight: 1.08,
  fontSize: { xs: "2rem", md: "2.15rem" },
};

const filterGroupsDrawerDescriptionSx = {
  maxWidth: "38ch",
  color: "rgba(255, 255, 255, 0.64)",
  fontSize: "0.98rem",
  lineHeight: 1.7,
};

const filterGroupsDrawerFieldSx = {
  position: "relative",
  zIndex: 1,
  gap: 2,
};

const filterGroupsDrawerSelectLabelSx = {
  color: "rgba(255, 255, 255, 0.58)",
  "&.Mui-focused": { color: "#7cc6ff" },
  "&.Mui-disabled": { color: "rgba(255, 255, 255, 0.3)" },
};

const filterGroupsDrawerSelectSx = {
  borderRadius: 2.8,
  color: "#ffffff",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.026) 0%, rgba(255, 255, 255, 0.016) 100%)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.025)",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(124, 198, 255, 0.34)",
  },
  "& .MuiSelect-icon": { color: "rgba(255, 255, 255, 0.62)" },
  "&.Mui-disabled": {
    color: "rgba(255, 255, 255, 0.3)",
    "& .MuiSelect-icon": { color: "rgba(255, 255, 255, 0.24)" },
  },
};

const filterGroupsDrawerMenuPaperSx = {
  mt: 0.75,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 18px 42px rgba(0, 0, 0, 0.26)",
  "& .MuiMenuItem-root": {
    color: "rgba(255, 255, 255, 0.82)",
    "&.Mui-selected": { backgroundColor: "rgba(124, 198, 255, 0.12)" },
    "&.Mui-selected:hover": {
      backgroundColor: "rgba(124, 198, 255, 0.16)",
    },
  },
};

export {
  filterGroupsDrawerDescriptionSx,
  filterGroupsDrawerEyebrowSx,
  filterGroupsDrawerFieldSx,
  filterGroupsDrawerHeaderSx,
  filterGroupsDrawerIconSx,
  filterGroupsDrawerMenuPaperSx,
  filterGroupsDrawerRootSx,
  filterGroupsDrawerSelectLabelSx,
  filterGroupsDrawerSelectSx,
  filterGroupsDrawerTitleRowSx,
  filterGroupsDrawerTitleSx,
};
