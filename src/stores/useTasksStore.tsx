import { create } from "zustand";
import type { Task } from "../types/task";

interface TasksStore {
  tasks: Task[];

  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTaskState: (id: string, newState: Task["content"]["state"]) => void;
}

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],

  setTasks: (tasks) => set(() => ({ tasks })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTaskState: (id, newState) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, content: { ...task.content, state: newState } }
          : task,
      ),
    })),
}));
