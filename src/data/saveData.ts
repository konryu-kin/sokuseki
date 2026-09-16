import type { Task } from "../types/task";
export function saveTasks(tasks: Task[]){
  type SavedData = {
    version: number;
    data: Task[];
  };
  const savedData:SavedData = {
    version:0,
    data:tasks
  }

  localStorage.setItem("tasksData",JSON.stringify(savedData))
}