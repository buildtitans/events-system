import type { JSX } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

type PasswordInputProps = {
    handleClickOpen: () => void,
    handlePassword: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    passwordError: boolean,
    passwordErrorMessage: string
}

function Password({
    handleClickOpen,
    handlePassword,
    passwordError,
    passwordErrorMessage
}: PasswordInputProps): JSX.Element {

    return (
        <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
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
            <Box sx={{ display: 'flex', justifyContent: 'end', paddingTop: 1 }}>

                <Link
                    component="button"
                    type="button"
                    onClick={handleClickOpen}
                    variant="body2"
                    sx={{ alignSelf: 'baseline' }}
                >
                    Forgot your password?
                </Link>
            </Box>
        </FormControl>
    )
};

export default Password;