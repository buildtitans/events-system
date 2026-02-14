import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { JSX } from 'react';

type BadgeProps = {
    badgeContent: number,
    handleClick: (event: React.MouseEvent<HTMLElement>) => Promise<void>
}

export default function NotificationBadge({
    badgeContent,
    handleClick
}: BadgeProps): JSX.Element {

    return (
        <Badge
            sx={{ cursor: "pointer" }}
            onClick={(event) => handleClick(event)}
            component={"div"}
            badgeContent={badgeContent} color="primary">
            <MailIcon color="action" />
        </Badge>
    );
}