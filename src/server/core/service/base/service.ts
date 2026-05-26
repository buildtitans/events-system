import { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";

export class Service {
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {}
}
