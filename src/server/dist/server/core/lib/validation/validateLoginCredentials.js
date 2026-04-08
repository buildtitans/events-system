"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginCredentials = validateLoginCredentials;
const schemaValidators_1 = require("./schemaValidators");
function validateLoginCredentials(emailInput, passwordInput) {
    const trimmedEmail = emailInput.trim().toLowerCase();
    return (0, schemaValidators_1.validateLoginInput)({ email: trimmedEmail, password: passwordInput });
}
//# sourceMappingURL=validateLoginCredentials.js.map