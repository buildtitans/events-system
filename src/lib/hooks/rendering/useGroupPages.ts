import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useMemo } from "react";
import { chunkGroupsIntoPages } from "../../utils/helpers/chunkGroupsIntoPages";

export type CategoryMap = Map<string, string>;

const useGroupPages = () => {
    const groups = useSelector((s: RootState) => s.groups.communities);
    const groupsPages = useMemo(() => {
        return chunkGroupsIntoPages(groups);
    }, [groups]);
    const categories = useSelector((s: RootState) => s.categories.categories);
    const currentPage = useSelector((s: RootState) => s.groups.currentPage);
    const columns = groupsPages[currentPage].length > 1 ? 2 : 1;
    const categoryMap: CategoryMap = useMemo(() => {
        let map: CategoryMap = new Map();
        categories.forEach((category) => {
            map.set(category.id, category.name)
        });
        return map;
    }, [categories]);


    return { currentPage, columns, categoryMap, groupsPages }

}

export { useGroupPages };