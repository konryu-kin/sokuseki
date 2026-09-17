import type { Event } from "../types/event";
import type { Task } from "../types/task";

export function saveTasks(tasks: Task[]) {
  type SavedData = {
    version: number;
    data: Task[];
  };

  const savedData: SavedData = {
    version: 0,
    data: tasks,
  };

  localStorage.setItem("tasksData", JSON.stringify(savedData));
}

export function saveEvents(events: Event[]) {
  type SavedData = {
    version: number;
    data: Event[];
  };

  const savedData: SavedData = {
    version: 0,
    data: events,
  };

  localStorage.setItem("eventsData", JSON.stringify(savedData));
}