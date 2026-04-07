"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = buildServer;
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_1 = __importDefault(require("fastify"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const registerSessionHook_1 = require("../hooks/registerSessionHook");
const context_1 = require("@/src/server/core/context/context");
const fastify_2 = require("@trpc/server/adapters/fastify");
const db_1 = require("@/src/server/core/db");
const router_1 = require("@/src/server/core/router/router");
const getEnv_1 = require("@/src/server/core/lib/init/getEnv");
function buildServer() {
    const client_url = (0, getEnv_1.getEnv)("client_url");
    const app = (0, fastify_1.default)({
        logger: {
            transport: {
                target: "pino-pretty",
            },
            serializers: {
                res(reply) {
                    return {
                        statusCode: reply.statusCode,
                    };
                },
                req(request) {
                    return {
                        method: request.method,
                        url: request.url,
                    };
                },
            },
        },
        routerOptions: {
            maxParamLength: 1000,
        },
    });
    app.register(cors_1.default, {
        origin: client_url,
        credentials: true,
    });
    const cookie_secret = (0, getEnv_1.getEnv)("cookies_secret");
    app.decorate("db", new db_1.DBClient(db_1.db));
    app.register(cookie_1.default, {
        secret: cookie_secret,
    });
    (0, registerSessionHook_1.registerContextHook)(app);
    app.register(fastify_2.fastifyTRPCPlugin, {
        prefix: "/trpc",
        trpcOptions: {
            router: router_1.appRouter,
            createContext: context_1.createContext,
            onError({ path, error }) {
                console.error(`Error in tRPC handler on path ${path} — ${error}`);
            },
        },
    });
    return app;
}
//# sourceMappingURL=app.js.map