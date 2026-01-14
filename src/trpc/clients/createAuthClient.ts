import { LoginBody, LoginResponse } from "../types/types";
import { FastifyApiClient } from "./createFastifyApiClient";

export class AuthClient {

    constructor(private readonly api: FastifyApiClient) { }

    async login(loginBody: LoginBody): Promise<LoginResponse> {

        return await this.api.post<LoginBody, LoginResponse>("/api/auth/login", loginBody);
    };
}