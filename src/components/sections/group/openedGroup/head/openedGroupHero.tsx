import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { Divider, Stack } from "@mui/material";
import GroupHeadSecton from "./groupHeadSection";
import GroupDescription from "./groupDescription";

type OpenedGroupHeroProps = {
    group: GroupSchemaType;
}

export default function OpenedGroupHero({ group }: OpenedGroupHeroProps) {

    return (
        <Stack
        sx={{paddingTop: 2}}
        gap={2}
        >
            <GroupHeadSecton 
            groupName={group.name}
            />
            <GroupDescription 
            group={group}
            />
            <Divider sx={{paddingY: 2}}/>
        </Stack>
    )
}