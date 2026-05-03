import { AppDispatch, RootState } from "@/src/lib/store";
import { goToEventsPage } from "@/src/lib/store/slices/events/EventsSlice";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";
import { useMemo, type ChangeEvent, type JSX } from "react";

function PaginateEvents(): JSX.Element {
    const layoutSlots = useSelector((s: RootState) => s.events.eventPages);
    const currentPage = useSelector((s: RootState) => s.events.currentPage);
    const dispatch = useDispatch<AppDispatch>();
    const count = useMemo(() => {
        if (layoutSlots.status === "ready") {
            return layoutSlots.data.length
        };

        return 1;
    }, [layoutSlots])
    const handleClick = (_event: ChangeEvent<unknown>, page: number) => {
        const pageClicked = page - 1;
        dispatch(goToEventsPage(pageClicked));
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'fit-content',
        }}>
            <Pagination
                onChange={handleClick}
                count={count}
                page={currentPage + 1}
                shape="rounded"
                siblingCount={0}
                boundaryCount={1}
                sx={{
                    "& .MuiPagination-ul": {
                        gap: 1,
                    },
                    "& .MuiPaginationItem-root": {
                        color: "rgba(255, 255, 255, 0.8)",
                        borderRadius: 999,
                        minWidth: 38,
                        height: 38,
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        transition: "all 180ms ease",
                    },
                    "& .MuiPaginationItem-root:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        borderColor: "rgba(255, 255, 255, 0.14)",
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                        color: "#ffffff",
                        background:
                            "linear-gradient(135deg, rgba(126, 204, 255, 0.24) 0%, rgba(96, 162, 255, 0.32) 100%)",
                        borderColor: "rgba(124, 198, 255, 0.35)",
                        boxShadow: "0 10px 30px rgba(92, 167, 255, 0.16)",
                    },
                    "& .MuiPaginationItem-root.Mui-selected:hover": {
                        background:
                            "linear-gradient(135deg, rgba(126, 204, 255, 0.24) 0%, rgba(96, 162, 255, 0.32) 100%)",
                    },
                }}
            />

        </Box>
    )

}


export { PaginateEvents };
