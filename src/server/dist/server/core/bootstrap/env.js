"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: path_1.default.resolve(process.cwd(), ".env") });
//# sourceMappingURL=env.js.map