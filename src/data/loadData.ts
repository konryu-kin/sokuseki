import type { Task } from "../types/task";
import type { Event } from "../types/event";
import type { ContextTag } from "../types/contextTag";

export function loadTasks(): Task[] {
  // const savedData = localStorage.tasksData;
  // if (savedData) {
  //   return JSON.parse(savedData).data;
  // }

  return [
    {
      id: "1",
      defaultOrder: 2,
      content: {
        contextTagId: "5",
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
        contextTagId: "5",
        state: "todo",
        scheduledDate: "2026-09-19",
        description: "新しいデザイン案を考える",
        dueDate: "2026-09-22",
      },
    },
  ];
}
export function loadEvents(): Event[] {
  // const savedData = localStorage.eventsData;
  // if (savedData) {
  //   return JSON.parse(savedData).data;
  // }

  return [
    {
      id: "1",
      defaultOrder: 2,
      content: {
        contextTagId: "5",
        name: "React学習",
        description: "Reactの基本を学ぶ時間",
        timeRange: {
          start: "2026-09-19T09:00:00",
          end: "2026-09-19T10:30:00",
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
          start: "2026-09-20T18:00:00",
          end: "2026-09-20T19:00:00",
        },
      },
    },
    {
      id: "3",
      defaultOrder: 3,
      content: {
        contextTagId: "3",
        name: "チームミーティング",
        description: "今週の進捗確認",
        timeRange: {
          start: "2026-09-21T15:00:00",
          end: "2026-09-21T16:00:00",
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
          start: "2026-09-22T13:30:00",
          end: "2026-09-22T14:00:00",
        },
      },
    },
    {
      id: "5",
      defaultOrder: 2,
      content: {
        contextTagId: "5",
        name: "デザインレビュー",
        description: "新しい案の確認会",
        timeRange: {
          start: "2026-09-23T11:00:00",
          end: "2026-09-23T12:00:00",
        },
      },
    },
  ];
}

export function loadContextTags(): ContextTag[] {
  return [
    {
      id: "0",
      name: "大学",
      parentId: null,
    },
    {
      id: "1",
      name: "サークル",
      parentId: "0",
    },
    {
      id: "2",
      name: "traP",
      parentId: "1",
    },
    {
      id: "3",
      name: "knoQ",
      parentId: "2",
    },
    {
      id: "4",
      name: "JIZI",
      parentId: "1",
    },
    {
      id: "5",
      name: "ね局",
      parentId: "4",
      generatedItemOptions: [
        {
          optionName: "活動の準備を作成",
          rules: [
            {
              itemType: "task",
              executionTiming: "manual",
              ItemTemplate: {
                content: {
                  contextTagId: "5",
                  state: "todo",
                  scheduledDate: {
                    date: {
                      type: "relative",
                      specifier: {
                        base: "day",
                        expression: { offset: { day: -1 } },
                      },
                    },
                    time: {
                      type: "absolute",
                      specifier: { hour: 18, minute: 0 },
                    },
                  },
                  description: "ね局の活動に向けて準備する",
                },
              },
            },
          ],
        },
        {
          optionName: "活動後の振り返りを作成",
          rules: [
            {
              itemType: "task",
              executionTiming: "manual",
              ItemTemplate: {
                content: {
                  contextTagId: "5",
                  state: "todo",
                  scheduledDate: {
                    date: {
                      type: "relative",
                      specifier: {
                        base: "day",
                        expression: { offset: { day: 0 } },
                      },
                    },
                    time: {
                      type: "absolute",
                      specifier: { hour: 20, minute: 0 },
                    },
                  },
                  description: "活動内容を振り返って記録する",
                },
              },
            },
          ],
        },
        {
          optionName: "活動後の共有会を作成",
          rules: [
            {
              itemType: "event",
              executionTiming: "manual",
              ItemTemplate: {
                content: {
                  contextTagId: "5",
                  name: "ね局 活動後の共有会",
                  description: "活動の成果や気づきを共有する",
                  timeRange: {
                    start: {
                      date: {
                        type: "relative",
                        specifier: {
                          base: "day",
                          expression: { offset: { day: 0 } },
                        },
                      },
                      time: {
                        type: "absolute",
                        specifier: { hour: 21, minute: 0 },
                      },
                    },
                    end: {
                      date: {
                        type: "relative",
                        specifier: {
                          base: "day",
                          expression: { offset: { day: 0 } },
                        },
                      },
                      time: {
                        type: "absolute",
                        specifier: { hour: 22, minute: 0 },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "6",
      name: "謎解き企画",
      parentId: "4",
    },
    {
      id: "7",
      name: "学業",
      parentId: "0",
    },
    {
      id: "8",
      name: "英語",
      parentId: "7",
    },
    {
      id: "9",
      name: "趣味",
      parentId: null,
    },
  ];
}
