import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import TaskIcon from '@mui/icons-material/Task';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { JSX } from 'react';


export default function NoPendingNotifications(): JSX.Element {

    return (
        <MenuItem
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'initial',
                "&hover": {
                    pointerEvents: 'none',
                    backgroundColor: 'black',
                }
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                flexDirection: 'column',
                gap: 2,
                paddingY: 4
            }}>


                <TaskIcon
                    sx={{
                        height: "100%"
                    }}
                    component={"svg"}
                    htmlColor="rgba(255, 255, 255, 0.6)"
                />
                <Typography
                    component={"h2"}
                    sx={{
                        fontSize: '20px',
                        fontWeight: 'light',
                        color: "rgba(255, 255, 255, 0.6)"
                    }}
                >
                    No new notifications
                </Typography>
            </Box>
        </MenuItem>

    )
}