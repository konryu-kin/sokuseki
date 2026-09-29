import type { Task } from "../types/task";

type TaskRow = {
  id: Task["id"];
  default_order: Task["defaultOrder"];
  context_tag_id: Task["content"]["contextTagId"];
  state: Task["content"]["state"];
  scheduled_date: Task["content"]["scheduledDate"];
  description: Task["content"]["description"];
  due_date: Task["content"]["dueDate"];
};

export function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    defaultOrder: row.default_order,
    content: {
      contextTagId: row.context_tag_id ?? undefined,
      state: row.state,
      scheduledDate: row.scheduled_date ?? undefined,
      description: row.description ?? undefined,
      dueDate: row.due_date ?? undefined,
    },
  };
}
