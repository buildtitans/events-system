import { RenderEventsForGroup } from "@/src/components/pipelines/groups/renderEventsForGroup";
import GroupDescription from "../groupDescription";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import Container from "@mui/material/Container";


export default function Overview({group}: {group: GroupSchemaType}) {


    return (
        <Container>
            <GroupDescription 
            group={group} 
            />

            <RenderEventsForGroup />
        </Container>
    )
}