import { GetAllCategoriesResponseType } from "@/src/schemas/categoriesSchema";
import { FastifyApiClient } from "./createFastifyApiClient";

export class CategoriesClient {
    constructor(private readonly api: FastifyApiClient) { }

    async getAllCategories(): Promise<GetAllCategoriesResponseType> {

        return await this.api.get("/api/categories/getAllCategories");
    }
}