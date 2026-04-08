"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextApi = void 0;
const db_1 = require("@/src/server/core/db");
const roleBasedAccessHandler_1 = require("@/src/server/core/service/auth/roleBasedAccessHandler");
const authorization_1 = require("@/src/server/core/service/auth/authorization");
const index_1 = require("@/src/server/core/service/domains/index");
class ContextApi {
    db;
    auth;
    policy;
    domains;
    constructor() {
        this.db = new db_1.DBClient(db_1.db);
        this.auth = new roleBasedAccessHandler_1.RoleBasedAccessHandler(this.db);
        this.policy = new authorization_1.Authorization(this.auth);
        this.domains = new index_1.Domains(this.db, this.policy);
    }
}
exports.ContextApi = ContextApi;
//# sourceMappingURL=contextApi.js.map