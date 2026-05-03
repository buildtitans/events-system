"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import type {
  NewGroupInputType,
  CreateNewGroupHook,
} from "@/src/lib/types/hooks/types";
import {
  GroupSchemaType,
  NewGroupInputSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { addGroup } from "@/src/lib/store/slices/groups/GroupsSlice";
import {
  isNewGroupSubmittable,
  normalizeNewGroupInput,
} from "@/src/lib/utils/newGroup/newGroupHelpers";
import {
  enqueueAlert,
  enqueueDrawer,
  enqueueSnackbar,
} from "@/src/lib/store/slices/rendering/RenderingSlice";

const useCreateNewGroup = (): CreateNewGroupHook => {
  const dispatch = useDispatch<AppDispatch>();
  const timerRef = useRef<number | null>(null);

  const [newGroup, setNewGroup] = useState<NewGroupInputType>({
    name: "",
    description: "",
    location: "",
    category_id: "",
  });

  const setFieldValue = (
    value: string | null,
    field: keyof NewGroupInputType,
  ) => {
    setNewGroup((prev: NewGroupInputType) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isSubmittable = useMemo((): boolean => {
    return isNewGroupSubmittable(newGroup);
  }, [newGroup]);

  const getInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof NewGroupInputType,
  ) => {
    setFieldValue(e.target.value, field);
  };

  const handleLocation = (input: string) => {
    setFieldValue(input, "location");
  };

  const handleGroupCategory = useCallback((category_id: string | null) => {
    setFieldValue(category_id, "category_id");
  }, []);

  async function createGroup(
    group: NewGroupInputSchemaType,
  ): Promise<GroupSchemaType | null> {
    const result = await trpcClient.groups.createNewGroup.mutate(group);
    return result;
  }

  function dispatchGroupResults(created: GroupSchemaType) {
    dispatch(addGroup(created));
    dispatch(enqueueSnackbar({ kind: null, status: "idle" }));
    dispatch(enqueueAlert({ kind: "success", action: "createGroup" }));

    timerRef.current = window.setTimeout(() => {
      dispatch(enqueueDrawer(null));
      timerRef.current = null;
    }, 400);
  }

  function handleNewGroupResult(created: GroupSchemaType | null): void {
    if (created) {
      dispatchGroupResults(created);
    } else {
      dispatch(enqueueSnackbar({ kind: "newGroup", status: "failed" }));
    }
  }

  const submitNewGroup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isSubmittable) {
      return;
    }
    dispatch(enqueueSnackbar({ kind: "newGroup", status: "pending" }));

    const payload = normalizeNewGroupInput(newGroup);
    const createdGroup = await createGroup(payload);
    handleNewGroupResult(createdGroup);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    newGroup,
    getInput,
    handleGroupCategory,
    submitNewGroup,
    handleLocation,
    isSubmittable,
  };
};

export { useCreateNewGroup };
