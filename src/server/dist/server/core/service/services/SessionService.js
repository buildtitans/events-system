"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const validateLoginCredentials_1 = require("../../lib/validation/validateLoginCredentials");
class SessionService {
    db;
    policy;
    constructor(db, policy) {
        this.db = db;
        this.policy = policy;
    }
    async login(emailInput, passwordInput) {
        const { email, password } = (0, validateLoginCredentials_1.validateLoginCredentials)(emailInput, passwordInput);
        return await this.db.auth.login(email, password);
    }
    async logout(token) {
        const cookie = this.policy.requireToken(token);
        return await this.db.auth.logOut(cookie);
    }
    async recoverSession(token) {
        const cookie = this.policy.requireToken(token);
        return this.db.auth.getSession(cookie);
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=SessionService.js.map