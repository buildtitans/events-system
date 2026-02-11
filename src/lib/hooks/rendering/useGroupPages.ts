"use client"
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useMemo } from "react";
import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import type { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";

export type CategoryMap = Map<string, string>;

function seedCategoryMap(categories: CategoriesSchemaType): CategoryMap {
    const map: CategoryMap = new Map();
    categories.forEach((category) => {
        map.set(category.id, category.name)
    });
    return map;
}

function getNumColumns(pagelength: number): number {
    if (pagelength > 1) {
        return 2
    } else {
        return 1;
    }
};

const useGroupPages = (groupsPages: GroupsSchemaType[]) => {
    const categories = useSelector((s: RootState) => s.categories.categories);
    const currentPage = useSelector((s: RootState) => s.groups.currentPage);
    const page = groupsPages[currentPage] ?? [];
    const columns = getNumColumns(page.length);
    const categoryMap: CategoryMap = useMemo(() => {
        const map = seedCategoryMap(categories);
        return map;
    }, [categories]);


    return { currentPage, columns, categoryMap, groupsPages }

}

export { useGroupPages };