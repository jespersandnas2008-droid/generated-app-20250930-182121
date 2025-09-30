import { IndexedEntity } from "./core-utils";
import type { User, Habit } from "@shared/types";
// USER ENTITY: one DO instance per user
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", email: "" };
  static override keyOf(state: User): string {
    return state.id;
  }
}
// HABIT ENTITY
export class HabitEntity extends IndexedEntity<Habit> {
  static readonly entityName = "habit";
  static readonly indexName = "habits";
  static readonly initialState: Habit = {
    id: "",
    userId: "",
    name: "",
    color: "#000000",
    frequency: { type: 'daily' },
    logs: [],
    createdAt: 0,
  };
  static override keyOf(state: Habit): string {
    return state.id;
  }
}