"use client"
<<<<<<< HEAD
import { useCallback, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/src/lib/store";
=======
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/src/lib/store";
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
import { GroupSchemaType, NewGroupInputSchemaType } from "@/src/schemas/groupSchema";
import { validateNewGroupInput } from "../utils/helpers/validateNewGroupInput";
import { trpcClient } from "@/src/trpc/trpcClient";
import { addGroup } from "../store/slices/GroupsSlice";
import { parseNewGroupForSubmit } from "../utils/helpers/parseNewGroupForSubmit";
<<<<<<< HEAD
import { changeNewGroupStatus } from "../store/slices/RenderingSlice";
=======
import { enqueueSnackbar, showModal } from "../store/slices/RenderingSlice";
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)

export type CreateNewGroupHook = {
    newGroup: NewGroupInputType,
    handleGroupName: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    handleGroupDescription: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    handleGroupLocation: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    handleGroupCategory: (category_id: string | null) => void,
    submitNewGroup: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>,
    isSubmittable: boolean,
}

export type NewGroupInputType = {
    name: GroupSchemaType["name"] | null,
    description: GroupSchemaType["description"] | null,
    location: GroupSchemaType["location"] | null,
    category_id: GroupSchemaType["category_id"] | null
}

const useCreateNewGroup = (): CreateNewGroupHook => {
    const dispatch = useDispatch<AppDispatch>();
<<<<<<< HEAD
    const groupCreationStatus = useSelector((s: RootState) => s.rendering.newGroupStatus);
=======
    const timerRef = useRef<number | null>(null);
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
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

    const handleGroupCategory = useCallback((category_id: string | null) => {
        console.log(category_id)
        setNewGroup((prev: NewGroupInputType) => ({
            ...prev,
            category_id: category_id
        }));
    }, [])

    async function createGroup(group: NewGroupInputSchemaType): Promise<GroupSchemaType | null> {
        const result = await trpcClient.groups.createNewGroup.mutate(group);
        return result;
    }

    function handleNewGroupResult(created: GroupSchemaType | null): void {
        if (created) {
            dispatch(addGroup(created))
<<<<<<< HEAD
            dispatch(changeNewGroupStatus("success"))
        } else {
            dispatch(changeNewGroupStatus("failed"))
        }

=======
            dispatch(enqueueSnackbar({ kind: 'newGroup', status: 'success' }));

            timerRef.current = window.setTimeout(() => {
                dispatch(showModal(null));
                timerRef.current = null;
            }, 1500);

        } else {
            dispatch(enqueueSnackbar({ kind: 'newGroup', status: 'failed' }))
        }
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
    }


    const submitNewGroup = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
<<<<<<< HEAD
        dispatch(changeNewGroupStatus("pending"))
        const insertData = parseNewGroupForSubmit(newGroup);
        const createdGroup = await createGroup(insertData);
        console.log(createdGroup)
        handleNewGroupResult(createdGroup);
    }

=======
        dispatch(enqueueSnackbar({ kind: 'newGroup', status: 'pending' }))
        const insertData = parseNewGroupForSubmit(newGroup);
        const createdGroup = await createGroup(insertData);
        handleNewGroupResult(createdGroup);
    }


    useEffect(() => {

        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
        }
    }, []);


>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
    return {
        newGroup,
        handleGroupName,
        handleGroupCategory,
        handleGroupDescription,
        handleGroupLocation,
        submitNewGroup,
        isSubmittable,
    };
}

export { useCreateNewGroup };