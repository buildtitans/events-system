import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: 'rgb(55, 65, 81)',
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
                ...theme.applyStyles('dark', {
                    color: 'inherit',
                }),

            },

            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
                '&:hover': {
                    cursor: "pointer"
                }
            },
        },
        ...theme.applyStyles('dark', {
            color: theme.palette.grey[300],
        }),
    },
}));

export default function GroupActionsMenu({ openEventDrawer }: { openEventDrawer: () => void }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    console.log("Actions button")

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        openEventDrawer();
        setAnchorEl(null)
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={(e) => handleMenuOpen(e)}
                endIcon={<KeyboardArrowDownIcon />}
                size="small"
                sx={{
                    borderRadius: 999,
                    color: 'black',
                    backgroundColor: 'white',
                    ':hover': {
                        cursor: "pointer"
                    }
                }}
            >
                Actions
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                slotProps={{
                    list: {
                        'aria-labelledby': 'demo-customized-button',
                    },
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClick} disableRipple>
                    <EditIcon />
                    create event
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    <FileCopyIcon />
                    edit events
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleClose} disableRipple>
                    <ArchiveIcon />
                    archive
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    <MoreHorizIcon />
                    more
                </MenuItem>
            </StyledMenu>
        </div>
    );
}
