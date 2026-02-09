"use client"
import { useState } from "react"

export type LoginCredentials = {
    email: string | null,
    password: string | null
};

export type ValidateCredentialsHook = {
    isSubmittable: boolean,
    emailErrorMessage: string,
    emailError: boolean,
    passwordError: boolean,
    passwordErrorMessage: string,
    handleEmail: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    handlePassword: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    credentials: LoginCredentials
}

const useValidateCredentials = (): ValidateCredentialsHook => {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: null,
        password: null
    });
    const validate = () => {
        const email = credentials.email;
        const password = credentials.password;
        if (!email || !password) return false;
        const isValid = validateInputs(email, password);
        return isValid;
    }
    const isSubmittable = validate();

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

    function validateInputs(email: string, password: string) {

        let isValid = true;
        const validEmailFormat = !/\S+@\S+\.\S+/.test(email);

        if (validEmailFormat) {
            isValid = false;
        } else {
        }

        if (!password || password.length < 6) {
            isValid = false;
        } else {
        }

        return isValid;
    };

    return {
        isSubmittable: isSubmittable,
        emailErrorMessage,
        emailError,
        passwordError,
        credentials,
        passwordErrorMessage,
        handleEmail,
        handlePassword
    };
};

export { useValidateCredentials }