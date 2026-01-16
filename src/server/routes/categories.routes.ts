import { FastifyPluginAsync, FastifyRequest } from "fastify";


export const categoriesRoutes: FastifyPluginAsync = async (app) => {

    const dbClient = app.db;

    app.get('/getAllCategories', async (req: FastifyRequest) => {

        const categories = await dbClient.categories.getAllCategories()

        return {
            items: categories,
            meta: {
                total: categories.length,
                error: null,
                message: 'All categories successfully'
            }
        }
    })
}