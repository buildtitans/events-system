import {
  RecoveredSessionSchema,
  RecoveredSessionSchemaType,
} from "../../../../../../schemas/auth/recoveredSessionSchema";
import { validateOrThrow } from "../../../../../../schemas/validateOrThrow";

export class AuthValidator {
  recoveredSession(data: unknown): RecoveredSessionSchemaType {
    return validateOrThrow(RecoveredSessionSchema, data);
  }
}
