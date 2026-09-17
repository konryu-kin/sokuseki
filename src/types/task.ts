export type Task = {
  id: string;
  defaultOrder: number;
  content: {
    state: "todo" | "done";
    scheduledDate?: string;
    description?: string;
    dueDate?: string;
  };
};
