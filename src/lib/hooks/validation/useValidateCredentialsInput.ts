"use client"
import {
    useEffect,
    useState
} from "react"
import type {
    ValidationState,
    LoginCredentials
} from "../../types/tokens/types";

import type { ValidateCredentialsHook } from "../../types/hooks/types";

export const useValidateCredentials = (): ValidateCredentialsHook => {
    const [emailError, setEmailError] = useState<ValidationState>({ hasError: false, message: '' })
    const [passwordError, setPasswordError] = useState<ValidationState>({ hasError: false, message: '' })
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: null,
        password: null
    });

    function validateInputs(
        email: string,
        password: string
    ): void {
        const invalidEmailFormat = !/\S+@\S+\.\S+/.test(email);
        const invalidPassword = !password || password.length < 6;

        setEmailError(() => ({
            hasError: invalidEmailFormat ? true : false,
            message: invalidEmailFormat ? 'Please provide a valid email' : ''
        }));
        setPasswordError(() => ({
            hasError: invalidPassword ? true : false,
            message: invalidPassword ? "Password needs to be at least 6 characters" : ""
        }));
    };

    const setField =
        (field: keyof LoginCredentials) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value = e.target.value;
                setCredentials(prev => ({
                    ...prev,
                    [field]: value,
                }));
            };

    const handleEmail = setField('email');
    const handlePassword = setField('password');


    useEffect(() => {

        const email = credentials.email;
        const password = credentials.password
        if ((!email) || (!password)) return;
        const executeValidateInputs = async () => {
            validateInputs(email, password)
        }

        void executeValidateInputs();

    }, [credentials.email, credentials.password]);


    return {
        isSubmittable: (!!credentials.email && !!credentials.password),
        emailErrorMessage: emailError.message,
        emailError: emailError.hasError,
        passwordError: passwordError.hasError,
        passwordErrorMessage: passwordError.message,
        credentials,
        handleEmail,
        handlePassword
    };
};