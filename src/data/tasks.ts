import type { Task } from "../types/task";
import { isToday, isTomorrow } from "../utils/date";

export type TaskGroupName = "past" | "today" | "tomorrow" | "future";
export type DateTaskMap = Record<string, Task[]>;

export type GroupedTasks = {
  past: DateTaskMap;
  today: DateTaskMap;
  tomorrow: DateTaskMap;
  future: DateTaskMap;
  undated: Task[];
};

export type SortedGroup = {
  date: string;
  tasks: Task[];
};

export type DisplayGroupedTasks = {
  past: SortedGroup[];
  today: SortedGroup[];
  tomorrow: SortedGroup[];
  future: SortedGroup[];
  undated: Task[];
};

function addTaskToDateMap(dateMap: DateTaskMap, dateKey: string, task: Task) {
  if (!dateMap[dateKey]) {
    dateMap[dateKey] = [];
  }

  dateMap[dateKey].push(task);
}

export function getDateTaskMap(tasks: Task[]): DateTaskMap {
  const dateTaskMap: DateTaskMap = {};

  for (const task of tasks) {
    const scheduledDate = task.content.scheduledDate;
    if (!scheduledDate) continue;

    const date = new Date(scheduledDate);
    if (Number.isNaN(date.getTime())) continue;

    const dateKey = scheduledDate.slice(0, 10);
    addTaskToDateMap(dateTaskMap, dateKey, task);
  }

  return dateTaskMap;
}

function getGroupedTasks(tasks: Task[]): GroupedTasks {
  const groupedTasks: GroupedTasks = {
    past: {},
    today: {},
    tomorrow: {},
    future: {},
    undated: [],
  };

  const dateTaskMap = getDateTaskMap(tasks);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  for (const [dateKey, tasksForDate] of Object.entries(dateTaskMap)) {
    const taskDate = new Date(dateKey);
    taskDate.setHours(0, 0, 0, 0);

    if (isToday(taskDate)) {
      groupedTasks.today[dateKey] = tasksForDate;
    } else if (isTomorrow(taskDate)) {
      groupedTasks.tomorrow[dateKey] = tasksForDate;
    } else if (taskDate < todayStart) {
      groupedTasks.past[dateKey] = tasksForDate;
    } else {
      groupedTasks.future[dateKey] = tasksForDate;
    }
  }

  for (const task of tasks) {
    if (!task.content.scheduledDate) {
      groupedTasks.undated.push(task);
    }
  }

  return groupedTasks;
}

// 表示用にデータをまとめたもの
export function getDisplayGroupedTasks(tasks: Task[]): DisplayGroupedTasks {
  const groupedTasks = getGroupedTasks(tasks);

  const sortDateEntries = (dateMap: DateTaskMap) =>
    Object.entries(dateMap)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, tasks]) => ({
        date,
        tasks: [...tasks].sort((a, b) => a.defaultOrder - b.defaultOrder),
      }));

  return {
    past: sortDateEntries(groupedTasks.past),
    today: sortDateEntries(groupedTasks.today),
    tomorrow: sortDateEntries(groupedTasks.tomorrow),
    future: sortDateEntries(groupedTasks.future),
    undated: [...groupedTasks.undated].sort(
      (a, b) => a.defaultOrder - b.defaultOrder,
    ),
  };
}
