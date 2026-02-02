import type { AlertMessages } from "@/src/lib/types/tokens/types";

const alertMessages: AlertMessages = {
    createGroup: {
        success: "Group created successfully!",
        error: "Group creation failed",
    },
    signup: {
        success: "Account created successfully!",
        error: "Failed to create account"
    },
    createEvent: {
        success: "Event created successfully!",
        error: "Failed to create new event"
    },
    updateAttendance: {
        success: "Attendance updated!",
        error: "Failed to update attendance"
    }
};

export { alertMessages }