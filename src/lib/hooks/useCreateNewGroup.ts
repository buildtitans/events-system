"use client"
import { useCallback, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/src/lib/store";
import { GroupSchemaType, NewGroupInputSchemaType } from "@/src/schemas/groupSchema";
import { RequestStatus } from "../types/types";
import { validateNewGroupInput } from "../utils/helpers/validateNewGroupInput";
import { trpcClient } from "@/src/trpc/trpcClient";
import { addGroup } from "../store/slices/GroupsSlice";
import { parseNewGroupForSubmit } from "../utils/helpers/parseNewGroupForSubmit";

export type CreateNewGroupHook = {
    newGroup: NewGroupInputType,
    handleGroupName: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    handleGroupDescription: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    handleGroupLocation: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    handleGroupCategory: (category_id: string) => () => void,
    submitNewGroup: (e: React.FormEvent<HTMLFormControlsCollection | HTMLFormElement>) => Promise<void>,
    isSubmittable: boolean,
    groupCreationStatus: RequestStatus
}

export type NewGroupInputType = {
    name: GroupSchemaType["name"] | null,
    description: GroupSchemaType["description"] | null,
    location: GroupSchemaType["location"] | null,
    category_id: GroupSchemaType["category_id"] | null
}

const useCreateNewGroup = (): CreateNewGroupHook => {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const dispatch = useDispatch<AppDispatch>();
    const [groupCreationStatus, setNewGroupCreationStatus] = useState<RequestStatus>('idle');
    const [newGroup, setNewGroup] = useState<NewGroupInputType>({
        name: null,
        description: null,
        location: null,
        category_id: null
    });
    const isSubmittable = useMemo((): boolean => {
        return validateNewGroupInput(newGroup)

    }, [newGroup]);


    const handleGroupName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const value = e.target.value;
        setNewGroup((prev: NewGroupInputType) => ({
            ...prev,
            name: value
        }));
    };


    const handleGroupDescription = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const value = e.target.value;
        setNewGroup((prev: NewGroupInputType) => ({
            ...prev,
            description: value
        }));
    };


    const handleGroupLocation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const value = e.target.value;
        setNewGroup((prev: NewGroupInputType) => ({
            ...prev,
            location: value
        }));
    };

    const handleGroupCategory = useCallback((category_id: string) => {
        return () => {
            setNewGroup((prev: NewGroupInputType) => ({
                ...prev,
                category_id: category_id
            }));
        }
    }, [])

    async function createGroup(group: NewGroupInputSchemaType): Promise<GroupSchemaType | null> {
        const result = await trpcClient.groups.createNewGroup.mutate(group);

        const { items } = result;

        return items;
    }

    function handleNewGroupResult(created: GroupSchemaType | null): void {
        if (created) {
            dispatch(addGroup(created))
            setNewGroupCreationStatus("success")
        } else {
            setNewGroupCreationStatus("failed")
        }

    }


    const submitNewGroup = async (e: React.FormEvent<HTMLFormControlsCollection | HTMLFormElement>) => {
        e.preventDefault();
        setNewGroupCreationStatus('pending');
        const insertData = parseNewGroupForSubmit(newGroup);
        const createdGroup = await createGroup(insertData);
        handleNewGroupResult(createdGroup);
    }


    return {
        newGroup,
        handleGroupName,
        handleGroupCategory,
        handleGroupDescription,
        handleGroupLocation,
        submitNewGroup,
        isSubmittable,
        groupCreationStatus
    };
}

export { useCreateNewGroup };