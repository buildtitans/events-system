import { AppDispatch } from "@/src/lib/store";
import { paginateGroups } from "@/src/lib/store/slices/GroupsSlice";
import Pagination from "@mui/material/Pagination";
import type { JSX } from "react";
import { useDispatch } from "react-redux";

export default function GroupsPaginaton({ numButtons }: { numButtons: number }): JSX.Element {
    const dispatch = useDispatch<AppDispatch>()

    const handleClick = (e: React.ChangeEvent<unknown>, page: number) => {
        const pageClicked = page - 1;
        dispatch(paginateGroups(pageClicked));
    }

    return (
        <Pagination onChange={handleClick} count={numButtons} />
    )
}