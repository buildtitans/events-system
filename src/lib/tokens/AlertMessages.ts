import type { AlertMessages } from "../types/types";

const alertMessages: AlertMessages = {
    createGroup: {
        success: "Group created successfully!",
        error: "Group creation failed",
    },
    signup: {
        success: "Account created successfully!",
        error: "Failed to create account"
    }
};

export { alertMessages }