import { AuthenticationSchemaType } from "@/src/schemas/loginCredentialsSchema";
import { LoginBody, LoginResponse } from "../types/types";
import { FastifyApiClient } from "./createFastifyApiClient";

export class AuthClient {

    constructor(private readonly api: FastifyApiClient) { }

    async login(loginBody: LoginBody): Promise<AuthenticationSchemaType> {

        return await this.api.post<LoginBody, AuthenticationSchemaType>("/api/auth/login", loginBody);
    };

    async logout(): Promise<AuthenticationSchemaType> {
        return await this.api.post("/api/auth/logout", null);
    }
}