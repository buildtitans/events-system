"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginCredentials = validateLoginCredentials;
const loginCredentialsSchema_1 = require("@/src/schemas/auth/loginCredentialsSchema");
function validateLoginCredentials(emailInput, passwordInput) {
    const trimmedEmail = emailInput.trim().toLowerCase();
    return (0, loginCredentialsSchema_1.validateLoginInput)({ email: trimmedEmail, password: passwordInput });
}
//# sourceMappingURL=validateLoginCredentials.js.map