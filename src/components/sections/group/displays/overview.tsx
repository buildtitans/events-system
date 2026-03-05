import { RenderEventsForGroup } from "@/src/components/pipelines/groups/renderEventsForGroup";
import GroupDescription from "../groupDescription";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";


export default function Overview({group}: {group: GroupSchemaType}) {


    return (
        <Container
        >
            <Stack
            gap={6}
            >
            <GroupDescription 
            group={group} 
            />

            <RenderEventsForGroup />
            </Stack>
            
        </Container>
    )
}