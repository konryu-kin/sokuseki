import type { Task } from "../types/task";

export type TaskGroupName = "past" | "today" | "tomorrow" | "future" | "undated";

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

export function getGroupedTasks(): Record<TaskGroupName, Task[]> {
  const tasks = getTasks();
  const groupedTasks: Record<TaskGroupName, Task[]> = {
    past: [],
    today: [],
    tomorrow: [],
    future: [],
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

    if (isToday(taskDate)) {
      groupedTasks.today.push(task);
    } else if (isTomorrow(taskDate)) {
      groupedTasks.tomorrow.push(task);
    } else if (taskDate < todayStart) {
      groupedTasks.past.push(task);
    } else {
      groupedTasks.future.push(task);
    }
  }

  return groupedTasks;
}