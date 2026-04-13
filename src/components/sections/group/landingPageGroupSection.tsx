import SelectActiveGroupsFilter from "@/src/features/group/selectActiveGroupsFilter";
import { useFilterGroups } from "@/src/lib/hooks/filters/useFilterGroups";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import RenderLandingGroupsTab from "../../pipelines/groups/renderLandingGroupsTab";



export default function LandingPageGroupSection() {
    const { setFilter } = useFilterGroups();


    return (
        <Container
        disableGutters
        sx={{
            height: "auto"
        }}
        >
            <Stack
            gap={2}
            direction={"column"}
            alignItems={"start"}
            justifyContent={"start"}
            >
                <SelectActiveGroupsFilter setFilter={setFilter} />

                <RenderLandingGroupsTab />

            </Stack>

        </Container>
    )
}