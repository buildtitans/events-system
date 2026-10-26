import type { Kysely } from "kysely";
import type { DB } from "@/src/server/core/db/types/db";
import type { IGroupsParser } from "../parse/groupsParser";
import {
  GroupsHydrateReader,
  IGroupsHydrateReader,
} from "./groupsHydrateReader";
import { GroupsQueryReader, IGroupsQueryReader } from "./groupsQueryReader";

export interface IGroupsReader {
  readonly hydrate: IGroupsHydrateReader;
  readonly query: IGroupsQueryReader;
}

export class GroupsReader implements IGroupsReader {
  public readonly hydrate: IGroupsHydrateReader;
  public readonly query: IGroupsQueryReader;
  constructor(
    private readonly db: Kysely<DB>,
    private readonly parser: IGroupsParser,
  ) {
    this.hydrate = new GroupsHydrateReader(this.db, this.parser);
    this.query = new GroupsQueryReader(this.db, this.parser);
  }
}
