import type { SnackbarMessages } from "@/src/lib/types/tokens/types";

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
    newGroup: {
        idle: "",
        pending: "Creating new group",
        success: "Group created successfully",
        failed: "Failed to create new group"
    },
    newEvent: {
        idle: "",
        pending: "Scheduling Event...",
        success: "Event Scheduled!",
        failed: "Failed to schedule event"
    },
    joiningGroup: {
        idle: "",
        pending: "Joining group...",
        success: "Joined group!",
        failed: "Failed to join this group"
    },
    updatingAttendance: {
        idle: "",
        pending: "Updating attendance...",
        success: "Updated Attendance!",
        failed: "Failed to update attendance"
    }
};

export { snackbarMessages }
