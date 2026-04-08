"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: path_1.default.resolve(process.cwd(), ".env") });
const app_1 = require("@/src/server/core/main/app");
const getEnv_1 = require("@/src/server/core/lib/init/getEnv");
const server = (0, app_1.buildServer)();
exports.server = server;
const devHost = (0, getEnv_1.getEnv)("dev_host");
const devPort = Number((0, getEnv_1.getEnv)("dev_fastify_port"));
server.listen({
    port: devPort,
    host: devHost,
}, (err) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
});
//# sourceMappingURL=index.js.map