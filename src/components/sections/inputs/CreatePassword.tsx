import type { JSX } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";

type PasswordInputProps = {
    handleClickOpen?: () => void,
    handlePassword: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    passwordError: boolean,
    passwordErrorMessage: string
}

function CreatePassword({
    handlePassword,
    passwordError,
    passwordErrorMessage
}: PasswordInputProps): JSX.Element {

    return (
        <FormControl>
            <FormLabel htmlFor="password">Create Password</FormLabel>
            <TextField
                onChange={(e) => handlePassword(e)}
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
            />
        </FormControl>
    )
};

export default CreatePassword;