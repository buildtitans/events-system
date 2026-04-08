"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = seedUsers;
const db_1 = require("@/src/server/core/db/db");
const users_placeholder_json_1 = __importDefault(require("../data/users-placeholder.json"));
const argon2_1 = __importDefault(require("argon2"));
async function seedUsers() {
    if (process.env.NODE_ENV === "production") {
        throw new Error("Seeding disabled in production");
    }
    const usersByEmail = {};
    for (const user of users_placeholder_json_1.default) {
        const hashed_pw = await argon2_1.default.hash(user.password);
        const row = {
            email: user.email,
            password_hash: hashed_pw,
        };
        const inserted = await db_1.db
            .insertInto("users")
            .values(row)
            .onConflict((col) => col.column("email").doNothing())
            .returning(["id", "email"])
            .executeTakeFirst();
        if (!inserted) {
            const existing = await db_1.db
                .selectFrom("users")
                .select(["id", "email"])
                .where("email", "=", user.email)
                .executeTakeFirstOrThrow();
            usersByEmail[existing.email] = existing.id;
        }
        else {
            usersByEmail[inserted.email] = inserted.id;
        }
    }
    return usersByEmail;
}
//# sourceMappingURL=seedUsers.js.map