import { IAuthorization } from "../auth/authorization";
import { IUserService, UserServiceDb } from "./types";
import {
  IUserSelectHandler,
  UserSelectHandler,
} from "../handlers/user/userSelectHandler";
import {
  IUserWriteHandler,
  UserWriteHandler,
} from "../handlers/user/userWriteHandler";

export class UserService implements IUserService {
  public readonly select: IUserSelectHandler;
  public readonly write: IUserWriteHandler;
  constructor(
    private readonly db: UserServiceDb,
    private readonly policy: IAuthorization,
  ) {
    this.select = new UserSelectHandler(this.db, this.policy);
    this.write = new UserWriteHandler(this.db, this.policy);
  }
}
