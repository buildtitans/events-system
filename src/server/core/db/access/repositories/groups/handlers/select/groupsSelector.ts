import type { IGroupsReader } from "../read/groupsReader";
import type { IGroupsValidator } from "../validate/groupsValidator";
import {
  GroupsViewSelector,
  type IGroupsViewSelector,
} from "./groupsViewSelector";
import {
  GroupsQuerySelector,
  IGroupsQuerySelector,
} from "./groupsQuerySelector";

export interface IGroupsSelector {
  readonly view: IGroupsViewSelector;
  readonly query: IGroupsQuerySelector;
}
export class GroupsSelector implements IGroupsSelector {
  public readonly view: IGroupsViewSelector;
  public readonly query: IGroupsQuerySelector;
  constructor(read: IGroupsReader, validator: IGroupsValidator) {
    this.view = new GroupsViewSelector(read.hydrate, validator);
    this.query = new GroupsQuerySelector(read.query, validator);
  }
}
