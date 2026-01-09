import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env"), })

const envVars = {
    dbPassword: process.env.POSTGRES_PASSWORD,
    fastifyUrl: process.env.FASTIFY_SERVER_URL,
    port: process.env.FASTIFY_SERVER_PORT,
    events_endpoint: process.env.GET_EVENTS_ENDPOINT,
    groups_endpoint: process.env.GET_GROUPS_ENDPOINT
}


function getEnv(varName: keyof typeof envVars): string {

    if (typeof envVars[varName] === "undefined") {
        console.error(`${varName} is not available`);
        process.exit(1);
    } else {
        return envVars[varName] as string
    }
}

export { getEnv };