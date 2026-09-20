import type { ContextTag } from "./contextTag";
import type { DateTimeSpecifier } from "./dateTimeSpecifier";

export type Task = {
  id: string;
  defaultOrder: number; // (new Date(scheduledDate)).getTime()をデフォルトにしたい
  content: {
    contextTagId?: ContextTag["id"];
    state: "todo" | "done";
    scheduledDate?: string;
    description?: string;
    dueDate?: string;
  };
};

export type TaskTemplate = {
  content: {
    contextTagId?: ContextTag["id"];
    state: Task["content"]["state"];
    scheduledDate?: DateTimeSpecifier;
    description?: string;
    dueDate?: DateTimeSpecifier;
  };
};
