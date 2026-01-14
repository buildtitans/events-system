"use client"
import { useState, useEffect } from "react"

export type LoginCredentials = {
    email: string | null,
    password: string | null
};

type ValidateCredentialsHook = {
    isSubmittable: boolean,
    emailErrorMessage: string,
    emailError: boolean,
    passwordError: boolean,
    passwordErrorMessage: string,
    handleEmail: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    handlePassword: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

const useValidateCredentials = (): ValidateCredentialsHook => {
    const [isSubmittable, setIsSubmittable] = useState<boolean>(false)
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: null,
        password: null
    });

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        e.preventDefault();
        const value = e.target.value;

        setCredentials((prev: LoginCredentials) => ({
            ...prev,
            email: value
        }));
    };


    const handlePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        const value = e.target.value;

        setCredentials((prev: LoginCredentials) => ({
            ...prev,
            password: value
        }));
    };

    const validateInputs = (email: string, password: string) => {

        let isValid = true;
        let validEmailFormat = !/\S+@\S+\.\S+/.test(email);

        if (validEmailFormat) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };


    useEffect(() => {
        const password = credentials.password;
        const email = credentials.email;
        if ((!password) || (!email)) return;

        const isValid = validateInputs(email, password);
        setIsSubmittable(isValid);


    }, [credentials.password, credentials.email])

    return {
        isSubmittable,
        emailErrorMessage,
        emailError,
        passwordError,
        passwordErrorMessage,
        handleEmail,
        handlePassword
    };
};

export { useValidateCredentials }