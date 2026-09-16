import type { Task } from "../types/task";

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

function isToday(date: Date) {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function isTomorrow(date: Date) {
  const today = new Date();
  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);

  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  );
}

function addTaskToDateMap(dateMap: DateTaskMap, dateKey: string, task: Task) {
  if (!dateMap[dateKey]) {
    dateMap[dateKey] = [];
  }

  dateMap[dateKey].push(task);
}

export function getTasks(): Task[] {
  return [
    {
      id: "1",
      content: {
        state: "todo",
        scheduledDate: "2026-09-17",
        description: "Reactの学習を進める",
        dueDate: "2026-09-20",
      },
    },
    {
      id: "2",
      content: {
        state: "done",
        scheduledDate: "2026-09-16",
        description: "買い物リストを確認する",
        dueDate: "2026-09-16",
      },
    },
    {
      id: "3",
      content: {
        state: "todo",
        scheduledDate: "2026-09-18",
        description: "チームミーティングの準備をする",
      },
    },
    {
      id: "4",
      content: {
        state: "done",
        description: "メールの返信を完了する",
        dueDate: "2026-09-15",
      },
    },
    {
      id: "5",
      content: {
        state: "todo",
        scheduledDate: "2026-09-19",
        description: "新しいデザイン案を考える",
        dueDate: "2026-09-22",
      },
    },
  ];
}

export function getGroupedTasks(): GroupedTasks {
  const tasks = getTasks();
  const groupedTasks: GroupedTasks = {
    past: {},
    today: {},
    tomorrow: {},
    future: {},
    undated: [],
  };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  for (const task of tasks) {
    const scheduledDate = task.content.scheduledDate;

    if (!scheduledDate) {
      groupedTasks.undated.push(task);
      continue;
    }

    const date = new Date(scheduledDate);

    if (Number.isNaN(date.getTime())) {
      groupedTasks.undated.push(task);
      continue;
    }

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    const dateKey = scheduledDate.slice(0, 10);

    if (isToday(taskDate)) {
      addTaskToDateMap(groupedTasks.today, dateKey, task);
    } else if (isTomorrow(taskDate)) {
      addTaskToDateMap(groupedTasks.tomorrow, dateKey, task);
    } else if (taskDate < todayStart) {
      addTaskToDateMap(groupedTasks.past, dateKey, task);
    } else {
      addTaskToDateMap(groupedTasks.future, dateKey, task);
    }
  }

  return groupedTasks;
}

export function getDisplayGroupedTasks(): DisplayGroupedTasks {
  const groupedTasks = getGroupedTasks();

  const sortDateEntries = (dateMap: DateTaskMap) =>
    Object.entries(dateMap)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, tasks]) => ({ date, tasks }));

  return {
    past: sortDateEntries(groupedTasks.past),
    today: sortDateEntries(groupedTasks.today),
    tomorrow: sortDateEntries(groupedTasks.tomorrow),
    future: sortDateEntries(groupedTasks.future),
    undated: groupedTasks.undated,
  };
}
