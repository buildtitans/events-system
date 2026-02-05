"use client";
import { useGetCategories } from "./useGetCategories";
import { usePopulateEventsList } from "./usePopulateEventLIst";
import { usePopulateGroups } from "./usePopulateGroups";

export const useRecoverStore = () => {
    useGetCategories();
    usePopulateEventsList();
    usePopulateGroups();
    return;
}