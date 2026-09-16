import type { Task } from "./task";
import type { Event } from "./event";
export type TimelineItem =
  | {
      type: "task";
      data: Task;
    }
  | {
      type: "event";
      data: Event;
    };
