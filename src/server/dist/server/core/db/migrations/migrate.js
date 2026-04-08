"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs_1 = require("fs");
const kysely_1 = require("kysely");
const db_1 = require("@/src/server/core/db");
async function migrateToLatest() {
    console.log("************** migrate.ts starting… *****************");
    const migrator = new kysely_1.Migrator({
        db: db_1.db,
        provider: new kysely_1.FileMigrationProvider({
            fs: fs_1.promises,
            path,
            migrationFolder: __dirname,
        }),
    });
    const { error, results } = await migrator.migrateToLatest();
    results?.forEach((it) => {
        if (it.status === "Success") {
            console.log(`migration "${it.migrationName}" was executed successfully`);
        }
        else if (it.status === "Error") {
            console.error(`failed to execute migration "${it.migrationName}"`);
        }
    });
    if (error) {
        throw error;
    }
}
async function migrateWithRetry(attempts = 10, delayMs = 2000) {
    for (let i = 0; i < attempts; i++) {
        try {
            await migrateToLatest();
            return;
        }
        catch (err) {
            const attempt = i + 1;
            console.log(`DB not ready (attempt ${attempt}/${attempts}), retrying in ${delayMs}ms...`);
            if (attempt === attempts) {
                throw err;
            }
            await new Promise((res) => setTimeout(res, delayMs));
        }
    }
}
if (require.main === module) {
    migrateWithRetry()
        .then(async () => {
        await db_1.db.destroy();
        process.exit(0);
    })
        .catch(async (err) => {
        console.error("failed to migrate after retries");
        console.error(err);
        await db_1.db.destroy();
        process.exit(1);
    });
}
//# sourceMappingURL=migrate.js.map