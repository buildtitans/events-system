"use client";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import type {
  NewGroupInputType,
  CreateNewGroupHook,
} from "@/src/lib/types/hooks/types";
import {
  isNewGroupSubmittable,
  normalizeNewGroupInput,
} from "@/src/lib/utils/newGroup/newGroupHelpers";
import { enqueueSnackbar } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { createGroup } from "@/src/lib/store/slices/groups/thunks";

const useCreateNewGroup = (): CreateNewGroupHook => {
  const dispatch = useDispatch<AppDispatch>();

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

  const submitNewGroup = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!isSubmittable) {
        return;
      }
      dispatch(enqueueSnackbar({ kind: "newGroup", status: "pending" }));

      const payload = normalizeNewGroupInput(newGroup);
      await dispatch(createGroup(payload));
    },
    [dispatch, isSubmittable, newGroup],
  );

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
