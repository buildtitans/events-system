"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContextInner = createContextInner;
exports.createContext = createContext;
const appServices_1 = require("../service/appServices");
const SessionHandler_1 = require("../service/handlers/SessionHandler");
function createContextInner() {
    return { services: new appServices_1.AppServices() };
}
function createContext({ req, res }) {
    const innerContext = createContextInner();
    return {
        req,
        res,
        session: new SessionHandler_1.SessionHandler(req, res),
        ...innerContext,
    };
}
//# sourceMappingURL=context.js.map