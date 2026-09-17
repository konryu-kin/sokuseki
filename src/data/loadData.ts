import type { Task } from "../types/task";
import type { Event } from "../types/event";

export function loadTasks(): Task[] {
  const savedData = localStorage.tasksData;
  if (savedData) {
    return JSON.parse(savedData).data;
  }

  return [
    {
      id: "1",
      defaultOrder: 2,
      content: {
        state: "todo",
        scheduledDate: "2026-09-17",
        description: "Reactの学習を進める",
        dueDate: "2026-09-20",
      },
    },
    {
      id: "2",
      defaultOrder: 1,
      content: {
        state: "done",
        scheduledDate: "2026-09-16",
        description: "買い物リストを確認する",
        dueDate: "2026-09-16",
      },
    },
    {
      id: "3",
      defaultOrder: 3,
      content: {
        state: "todo",
        scheduledDate: "2026-09-18",
        description: "チームミーティングの準備をする",
      },
    },
    {
      id: "4",
      defaultOrder: 1,
      content: {
        state: "done",
        description: "メールの返信を完了する",
        dueDate: "2026-09-15",
      },
    },
    {
      id: "5",
      defaultOrder: 2,
      content: {
        state: "todo",
        scheduledDate: "2026-09-19",
        description: "新しいデザイン案を考える",
        dueDate: "2026-09-22",
      },
    },
  ];
}
export function loadEvents(): Event[] {
  const savedData = localStorage.eventsData;
  if (savedData) {
    return JSON.parse(savedData).data;
  }

  return [
    {
      id: "1",
      defaultOrder: 2,
      content: {
        name: "React学習",
        description: "Reactの基本を学ぶ時間",
        timeRange: {
          start: "2026-09-17T09:00:00",
          end: "2026-09-17T10:30:00",
        },
      },
    },
    {
      id: "2",
      defaultOrder: 1,
      content: {
        name: "買い物",
        description: "スーパーで必要なものを買う",
        timeRange: {
          start: "2026-09-16T18:00:00",
          end: "2026-09-16T19:00:00",
        },
      },
    },
    {
      id: "3",
      defaultOrder: 3,
      content: {
        name: "チームミーティング",
        description: "今週の進捗確認",
        timeRange: {
          start: "2026-09-18T15:00:00",
          end: "2026-09-18T16:00:00",
        },
      },
    },
    {
      id: "4",
      defaultOrder: 1,
      content: {
        name: "面談",
        description: "採用面談の予定",
        timeRange: {
          start: "2026-09-15T13:30:00",
          end: "2026-09-15T14:00:00",
        },
      },
    },
    {
      id: "5",
      defaultOrder: 2,
      content: {
        name: "デザインレビュー",
        description: "新しい案の確認会",
        timeRange: {
          start: "2026-09-19T11:00:00",
          end: "2026-09-19T12:00:00",
        },
      },
    },
  ];
}
