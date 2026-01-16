import type { SnackbarMessages } from "../types/types";


const snackbarMessages: SnackbarMessages = {
    logout: {
        idle: "",
        pending: "Logging out...",
        success: "Logged out successfully",
        failed: "Failed to log out",
    },
    login: {
        idle: "",
        pending: "Logging in...",
        success: "Logged in successfully",
        failed: "Invalid credentials",
    },
};

export { snackbarMessages }
