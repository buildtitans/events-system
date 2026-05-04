import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import {
  getGroupCardCategorySx,
  getGroupCardDescriptionSx,
  getGroupCardMetaChipSx,
  getGroupCardMetaIconSx,
  getGroupCardMetaWrapSx,
  getGroupCardSurfaceSx,
  getGroupCardTitleSx,
} from "@/src/client/styles/sx/groupCard";

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const TitleTypography = styled(Typography)(({ theme }) => ({
  position: "relative",
  textDecoration: "none",
  "&:hover": { cursor: "pointer" },
  "& .arrow": {
    visibility: "hidden",
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
  },
  "&:hover .arrow": {
    visibility: "visible",
    opacity: 0.7,
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "3px",
    borderRadius: "8px",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    width: 0,
    height: "1px",
    bottom: 0,
    left: 0,
    backgroundColor: (theme.vars || theme).palette.text.primary,
    opacity: 0.3,
    transition: "width 0.3s ease, opacity 0.3s ease",
  },
  "&:hover::before": {
    width: "100%",
  },
}));

type GroupCardProps = {
  group: GroupSchemaType;
  index: number;
  handleFocus: (index: number) => void;
  handleBlur: () => void;
  focusedCardIndex: number | null;
  categoryName?: string | null;
  handleGroupClicked: (slug: GroupSchemaType["slug"]) => () => void;
  variant?: GroupCardVariant;
};

export type GroupCardVariant = "landing" | "dashboard";

function Group({
  index,
  group,
  handleFocus,
  handleBlur,
  focusedCardIndex,
  categoryName,
  handleGroupClicked,
  variant = "landing",
}: GroupCardProps): React.JSX.Element {
  const isFocused = focusedCardIndex === index;

  return (
    <Grid flexShrink={0} size={{ xs: 2, sm: 1, md: 1, lg: 1, xl: 1 }}>
      <Box
        onClick={handleGroupClicked(group.slug)}
        component={"div"}
        sx={getGroupCardSurfaceSx(variant, isFocused)}
      >
        <Typography
          gutterBottom
          variant="caption"
          component="div"
          sx={getGroupCardCategorySx(variant)}
        >
          {categoryName ?? "Community"}
        </Typography>
        <TitleTypography
          gutterBottom
          variant="h6"
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          tabIndex={0}
          className={isFocused ? "Mui-focused" : ""}
          sx={getGroupCardTitleSx(variant)}
        >
          {group.name}
          <NavigateNextRoundedIcon
            className="arrow"
            sx={{ fontSize: "1rem" }}
          />
        </TitleTypography>
        <StyledTypography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={getGroupCardDescriptionSx(variant)}
        >
          {group.description ?? "No description provided yet."}
        </StyledTypography>

        <GroupMetaRow location={group.location} variant={variant} />
      </Box>
    </Grid>
  );
}

export default React.memo(Group);

function GroupMetaRow({
  location,
  variant,
}: {
  location: GroupSchemaType["location"];
  variant: GroupCardVariant;
}): React.JSX.Element {
  return (
    <Box sx={getGroupCardMetaWrapSx(variant)}>
      <Box sx={getGroupCardMetaChipSx(variant, true)}>
        <GroupsRoundedIcon sx={getGroupCardMetaIconSx(true)} />
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          Community
        </Typography>
      </Box>

      {location && (
        <Box sx={getGroupCardMetaChipSx(variant)}>
          <LocationOnRoundedIcon sx={getGroupCardMetaIconSx()} />
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {location}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
