export type Task = {
  id: string;
  content: {
    state: "todo" | "done";
    scheduledDate?: string;
    description?: string;
    dueDate?: string;
  };
};
