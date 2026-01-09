import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env"), })

const envVars = {
    dbPassword: process.env.POSTGRES_PASSWORD,
    fastifyUrl: process.env.FASTIFY_SERVER_UR,
    port: process.env.FASTIFY_SERVER_PORT
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