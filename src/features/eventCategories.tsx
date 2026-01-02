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
            <Chip onClick={handleClick} size="medium" label="All categories" />
            <Chip
                onClick={handleClick}
                size="medium"
                label="Company"
                sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
            <Chip
                onClick={handleClick}
                size="medium"
                label="Product"
                sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
            <Chip
                onClick={handleClick}
                size="medium"
                label="Design"
                sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
            <Chip
                onClick={handleClick}
                size="medium"
                label="Engineering"
                sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
            />
        </Box>
    )
}
