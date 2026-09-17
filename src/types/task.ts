import type { ContextTag } from "./contextTag";

export type Task = {
  id: string;
  defaultOrder: number;
  content: {
    contextTagId?: ContextTag["id"];
    state: "todo" | "done";
    scheduledDate?: string;
    description?: string;
    dueDate?: string;
  };
};
