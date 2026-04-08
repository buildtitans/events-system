"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthClient = void 0;
const crypto_1 = __importDefault(require("crypto"));
const argon2_1 = __importDefault(require("argon2"));
class AuthClient {
    db;
    constructor(db) {
        this.db = db;
    }
    async authenticate(token) {
        if (!token)
            return null;
        const session = await this.getSession(token);
        if (!session)
            return null;
        const user = await this.db
            .selectFrom("users")
            .select(["id", "email"])
            .where("id", "=", session.user_id)
            .executeTakeFirstOrThrow();
        return user;
    }
    async signUp(email, password) {
        const hashedPw = await this.hashNewPassword(password);
        const newUser = await this.db
            .insertInto("users")
            .values({
            email,
            password_hash: hashedPw,
        })
            .returning(["id", "email"])
            .executeTakeFirstOrThrow();
        return newUser;
    }
    async login(input_email, input_password) {
        try {
            const user = await this.verifyCredentials(input_email, input_password);
            const session = await this.createSession(user.id);
            return {
                status: "ok",
                user,
                session,
            };
        }
        catch {
            return {
                status: "failed",
            };
        }
    }
    async logOut(token) {
        const result = await this.db
            .deleteFrom("sessions")
            .where("id", "=", token)
            .execute();
        return Number(result[0].numDeletedRows ?? 0) > 0;
    }
    async getEmailByUserId(user_id) {
        return await this.db
            .selectFrom("users")
            .select("email")
            .where("id", "=", user_id)
            .executeTakeFirstOrThrow();
    }
    async verifyCredentials(input_email, input_password) {
        const user = await this.db
            .selectFrom("users")
            .select(["id", "email", "password_hash"])
            .where("email", "=", input_email)
            .executeTakeFirst();
        if (!user) {
            throw new Error(`That email doesn't match any of our records`);
        }
        const ok = await argon2_1.default.verify(user?.password_hash, input_password);
        if (!ok) {
            throw new Error(`Invalid email or password`);
        }
        return user;
    }
    async hashNewPassword(password) {
        return argon2_1.default.hash(password);
    }
    async createSession(user_id) {
        const token = crypto_1.default.randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
        const session = await this.db
            .insertInto("sessions")
            .values({
            id: token,
            user_id: user_id,
            expires_at: expiresAt,
        })
            .returning(["id", "user_id", "expires_at"])
            .executeTakeFirstOrThrow();
        return session;
    }
    async getSession(token) {
        if (!token)
            return undefined;
        const session = await this.db
            .selectFrom("sessions")
            .select(["id", "user_id", "expires_at"])
            .where("id", "=", token)
            .where("expires_at", ">", new Date())
            .executeTakeFirst();
        return session;
    }
}
exports.AuthClient = AuthClient;
//# sourceMappingURL=authClient.js.map