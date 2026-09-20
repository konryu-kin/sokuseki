import type { Task } from "./task";
import type { Event } from "./event";

export type ContextTag = {
  id: string;
  name: string;
  parentId: ContextTag["id"] | null;
  generatedItemRules?: {
    optionName: string;
    rules: (
      | {
          type: "event";
          ItemTemplate: Event;
          options: {
            // ミリ秒で指定
            scheduledDateOffset?: number;
            dueDateOffset?: number;
          };
        }
      | {
          type: "task";
          ItemTemplate: Task;
          options: {
            // ミリ秒で指定
            scheduledDateOffset?: number;
            dueDateOffset?: number;
          };
        }
    )[];
  }[];
};
