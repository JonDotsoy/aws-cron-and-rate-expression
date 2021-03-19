import { Wildcard } from "./Wildcard";

export class WildcardList<T extends string> {
  constructor(private list: Wildcard<T>[]) { }
  get = (name: T) => this.list.find(item => item.name === name);
}
