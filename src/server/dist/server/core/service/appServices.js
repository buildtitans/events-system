"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppServices = void 0;
const layoutFormatter_1 = require("./services/layoutFormatter");
const contextApi_1 = require("@/src/server/core/service/api/contextApi");
class AppServices {
    api;
    layout;
    constructor() {
        this.api = new contextApi_1.ContextApi();
        this.layout = new layoutFormatter_1.LayoutFormatter();
    }
}
exports.AppServices = AppServices;
//# sourceMappingURL=appServices.js.map