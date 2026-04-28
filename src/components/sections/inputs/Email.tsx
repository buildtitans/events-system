import { JSX } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import {
    authFieldControlSx,
    authFieldLabelSx,
    authTextFieldSx,
} from "@/src/styles/sx/authDrawer";

type EmailInputProps = {
    emailErrorMessage: string,
    handleEmail: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    emailError: boolean
}

function Email({
    emailErrorMessage,
    handleEmail,
    emailError
}: EmailInputProps): JSX.Element {

    return (
        <FormControl fullWidth sx={authFieldControlSx}>
            <FormLabel htmlFor="email" sx={authFieldLabelSx}>Email</FormLabel>
            <TextField
                onChange={(e) => handleEmail(e)}
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                sx={authTextFieldSx}
                color={emailError ? 'error' : 'primary'}
            />
        </FormControl>
    )
}

export default Email;
