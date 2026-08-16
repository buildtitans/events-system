import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { CurrentDisplay } from "@/src/lib/store/slices/groups/types";
import { RenderGroupDisplay } from "@/src/client/components/pipelines/groups/switchers/renderGroupDisplay";
import {
  openedGroupHeroPanelSx,
  openedGroupHeroRootSx,
} from "@/src/client/styles/sx/openedGroupHero";
import OpenedGroupHero from "@/src/client/components/sections/group/openedGroup/head/openedGroupHero";
import ActiveDisplayHeader from "../head/activeDisplayHeader";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";

type OpenedGroupContentProps = {
  group: GroupSchemaType;
  displayed: CurrentDisplay;
  isMobile: boolean;
  category: CategorySchemaType["name"];
};

export default function OpenedGroupPanel({
  group,
  displayed,
  isMobile,
  category,
}: OpenedGroupContentProps) {
  return (
    <Container component="section">
      <Box minHeight={"100svh"} paddingY={4} sx={openedGroupHeroRootSx}>
        <Box sx={openedGroupHeroPanelSx}>
          <OpenedGroupHero group={group} category={category} />
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
              <Box minHeight={"50dvh"}>
                <RenderGroupDisplay isMobile={isMobile} view={displayed} />
              </Box>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Container>
  );
}
