import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { JSX } from 'react';

type BadgeProps = {
    badgeContent: number
}

export default function NotificationBadge({
    badgeContent
}: BadgeProps): JSX.Element {

    return (
        <Badge badgeContent={badgeContent} color="primary">
            <MailIcon color="action" />
        </Badge>
    );
}