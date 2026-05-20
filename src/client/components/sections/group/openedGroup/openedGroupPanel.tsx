import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { Box, Container, Stack } from "@mui/material";
import {
  openedGroupHeroPanelSx,
  openedGroupHeroRootSx,
} from "@/src/client/styles/sx/openedGroupHero";
import OpenedGroupHero from "./head/openedGroupHero";
import { CurrentDisplay } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import RenderCurrentView from "@/src/client/components/pipelines/groups/renderCurrentView";
import ActiveDisplayHeader from "./head/activeDisplayHeader";

type OpenedGroupContentProps = {
  group: GroupSchemaType;
  displayed: CurrentDisplay;
  isMobile: boolean;
};

export default function OpenedGroupPanel({
  group,
  displayed,
  isMobile,
}: OpenedGroupContentProps) {
  return (
    <Container component="section">
      <Box minHeight={"100svh"} paddingY={4} sx={openedGroupHeroRootSx}>
        <Box sx={openedGroupHeroPanelSx}>
          <OpenedGroupHero group={group} />
          <Container
            sx={{
              padding: 2,
              width: "100%",
            }}
            disableGutters
            maxWidth={false}
          >
            <Stack
              gap={4}
              width={"100%"}
              alignContent={"start"}
              justifyContent={"start"}
            >
              <ActiveDisplayHeader />
              <RenderCurrentView isMobile={isMobile} view={displayed} />
            </Stack>
          </Container>
        </Box>
      </Box>
    </Container>
  );
}
