import type { JSX } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StyledMenu from '@/src/styles/styledComponents/styledMenu';


export default function MemberActionsMenu(): JSX.Element {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    //   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    //       setAnchorEl(null)
    //   };
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

                <MenuItem onClick={handleClose} disableRipple>
                    <FileCopyIcon />
                    Leave group
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />

                <MenuItem onClick={handleClose} disableRipple>
                    <MoreHorizIcon />
                    more
                </MenuItem>
            </StyledMenu>
        </div>

    )
}