"use client"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { trpcClient } from "@/src/trpc/trpcClient"
import { getAllCategories } from "../store/slices/CategorySlice"


const useGetCategories = () => {
    const categories = useSelector((s: RootState) => s.categories.categories);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (Array.isArray(categories) && (categories.length > 0)) return;

        const executeGetCategories = async () => {
            const { items } = await trpcClient.categories.getAllCategories.mutate();

            dispatch(getAllCategories(items));
        };

        executeGetCategories();

    }, [categories]);
}

export { useGetCategories };