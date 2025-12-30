import Box from '@mui/material/Box';


function BasicBox() {

    return (
        <Box
            component={"section"}
            sx={{
                p: 2,
                border: '1px solid grey',
                bgcolor: "blue",
                '&:hover': {
                    bgcolor: 'royalblue',
                    cursor: 'pointer',
                    boxShadow: 'unset',
                    transition: 'ease-in-out',
                }

            }}
        >
            This is a basic box
        </Box>
    )
};

export default BasicBox;