"use client";
import React, { useState } from "react";
import { EventAttendantStatusSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import type { SelectChangeEvent } from "@mui/material/Select";
import { UpdateAttendanceStatusHook } from "@/src/lib/types/hooks/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { updateRSVP } from "@/src/lib/store/slices/events/thunks";

export type NewAttendanceStatus = EventAttendantStatusSchemaType | null;

export const useUpdateAttendance = (
  currentStatus: EventAttendantStatusSchemaType,
  event_id: EventSchemaType["id"],
): UpdateAttendanceStatusHook => {
  const [newStatus, setNewStatus] =
    useState<EventAttendantStatusSchemaType>(currentStatus);
  const dispatch = useDispatch<AppDispatch>();

  const handleStatusChange = (e: SelectChangeEvent) => {
    const value = e.target.value as EventAttendantStatusSchemaType;
    setNewStatus(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(updateRSVP({ event_id, newStatus }));
  };

  return {
    newStatus,
    handleStatusChange,
    handleSubmit,
  };
};
