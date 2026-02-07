import { createSlice } from "@reduxjs/toolkit";

export type UserKind = 'authenticated' | 'anonymous'

type AuthInitialState = {
    userKind: UserKind
}


const initialState: AuthInitialState = {
    userKind: 'anonymous'
}


const AuthSlice = createSlice({
    name: "AuthSlice",
    initialState: initialState,
    reducers: {
        loginSuccess: (state: AuthInitialState) => {
            state.userKind = 'authenticated';
        },
        logout: (state: AuthInitialState) => {
            state.userKind = 'anonymous';
        }
    }
});


export const { loginSuccess, logout } = AuthSlice.actions;

export default AuthSlice.reducer;

export type AuthSliceType = ReturnType<typeof AuthSlice.reducer>;