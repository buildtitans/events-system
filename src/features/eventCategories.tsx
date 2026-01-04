import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

type EventCategoriesProps = {
    handleClick: () => void
}

export function EventCategories({ handleClick }: EventCategoriesProps) {

    return (
        <Box
            sx={{
                display: 'inline-flex',
                flexDirection: 'row',
                gap: 3,
                overflow: 'auto',
            }}
        >
            <Chip onClick={handleClick} size="medium" label="Upcoming events" />
            <Chip
                onClick={handleClick}
                size="medium"
                label="Local events"
                sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
            <Chip
                onClick={handleClick}
                size="medium"
                label="Online events"
                sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
            <Chip
                onClick={handleClick}
                size="medium"
                label="Categories"
                sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
            <Chip
                onClick={handleClick}
                size="medium"
                label="Popular events"
                sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
        </Box>
    )
}
