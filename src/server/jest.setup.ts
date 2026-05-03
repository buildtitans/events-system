import path from "node:path";
import { config } from "dotenv";

process.env.TZ = "UTC";

const envPath = path.resolve(__dirname, ".env.test");

const result = config({ path: envPath });

if (result.error) {
  throw result.error;
}
