"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import {
  GroupSchemaType,
  NewGroupInputSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { addGroup } from "../../store/slices/groups/GroupsSlice";
import {
  enqueueAlert,
  enqueueDrawer,
  enqueueSnackbar,
} from "../../store/slices/rendering/RenderingSlice";

export type CreateNewGroupHook = {
  newGroup: NewGroupInputType;
  handleGroupName: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleGroupDescription: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleGroupLocation: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleGroupCategory: (category_id: string | null) => void;
  submitNewGroup: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isSubmittable: boolean;
};

export type NewGroupInputType = {
  name: GroupSchemaType["name"];
  description: GroupSchemaType["description"];
  location: GroupSchemaType["location"];
  category_id: GroupSchemaType["category_id"];
};

function hasNonEmptyText(value: string | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeOptionalText(value: string | null): string | null {
  if (!hasNonEmptyText(value)) {
    return null;
  }

  return value.trim();
}

function isNewGroupSubmittable(newGroup: NewGroupInputType): boolean {
  return (
    hasNonEmptyText(newGroup.name) && hasNonEmptyText(newGroup.category_id)
  );
}

function normalizeNewGroupInput(
  newGroup: NewGroupInputType,
): NewGroupInputSchemaType {
  return {
    name: newGroup.name.trim(),
    description: normalizeOptionalText(newGroup.description),
    location: normalizeOptionalText(newGroup.location),
    category_id: hasNonEmptyText(newGroup.category_id)
      ? newGroup.category_id.trim()
      : null,
  };
}

const useCreateNewGroup = (): CreateNewGroupHook => {
  const dispatch = useDispatch<AppDispatch>();
  const timerRef = useRef<number | null>(null);

  const [newGroup, setNewGroup] = useState<NewGroupInputType>({
    name: "",
    description: "",
    location: "",
    category_id: "",
  });

  const isSubmittable = useMemo((): boolean => {
    return isNewGroupSubmittable(newGroup);
  }, [newGroup]);

  const handleGroupName = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const value = e.target.value;
    setNewGroup((prev: NewGroupInputType) => ({
      ...prev,
      name: value,
    }));
  };

  const handleGroupDescription = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const value = e.target.value;
    setNewGroup((prev: NewGroupInputType) => ({
      ...prev,
      description: value,
    }));
  };

  const handleGroupLocation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const value = e.target.value;
    setNewGroup((prev: NewGroupInputType) => ({
      ...prev,
      location: value,
    }));
  };

  const handleGroupCategory = useCallback((category_id: string | null) => {
    setNewGroup((prev: NewGroupInputType) => ({
      ...prev,
      category_id,
    }));
  }, []);

  async function createGroup(
    group: NewGroupInputSchemaType,
  ): Promise<GroupSchemaType | null> {
    const result = await trpcClient.groups.createNewGroup.mutate(group);
    return result;
  }

  function handleNewGroupResult(created: GroupSchemaType | null): void {
    if (created) {
      dispatch(addGroup(created));
      dispatch(enqueueSnackbar({ kind: null, status: "idle" }));
      dispatch(enqueueAlert({ kind: "success", action: "createGroup" }));

      timerRef.current = window.setTimeout(() => {
        dispatch(enqueueDrawer(null));
        timerRef.current = null;
      }, 400);
    } else {
      dispatch(enqueueSnackbar({ kind: "newGroup", status: "failed" }));
    }
  }

  const submitNewGroup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!isSubmittable) {
      return;
    }

    const payload = normalizeNewGroupInput(newGroup);

    dispatch(enqueueSnackbar({ kind: "newGroup", status: "pending" }));
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
    handleGroupName,
    handleGroupCategory,
    handleGroupDescription,
    handleGroupLocation,
    submitNewGroup,
    isSubmittable,
  };
};

export { useCreateNewGroup };
