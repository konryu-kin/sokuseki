import type { Task } from "../types/task";
import type { Event } from "../types/event";
import { getDateEventMap } from "./events";
import { getDateTaskMap, getUndatedTasks } from "./tasks";
import type { TimelineItem } from "../types/timelineItem";
import { isFutureDate, isPastDate, isToday, isTomorrow } from "../utils/date";

function getTimelineItemFromTask(task: Task): TimelineItem {
  return {
    type: "task",
    data: task,
  };
}

function getTimelineItemFromEvent(event: Event): TimelineItem {
  return {
    type: "event",
    data: event,
  };
}

function getDefaultOrder(item: Task | Event) {
  return "defaultOrder" in item ? item.defaultOrder : 0;
}

export function getDateTimelineItemsMap({
  tasks,
  events,
}: {
  tasks: Task[];
  events: Event[];
}) {
  const dateTaskMap = getDateTaskMap(tasks);
  const dateEventMap = getDateEventMap(events);

  const dateKeys = [
    ...new Set([...Object.keys(dateTaskMap), ...Object.keys(dateEventMap)]),
  ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const dateTimelineMap = {} as Record<string, TimelineItem[]>;

  for (const dateKey of dateKeys) {
    const timelineItems: TimelineItem[] = [
      ...(dateTaskMap[dateKey] ?? []).map((task) =>
        getTimelineItemFromTask(task),
      ),
      ...(dateEventMap[dateKey] ?? []).map((event) =>
        getTimelineItemFromEvent(event),
      ),
    ];

    dateTimelineMap[dateKey] = timelineItems
      .sort((a, b) => getDefaultOrder(a.data) - getDefaultOrder(b.data))
      .map((item, index) => {
        item.data.defaultOrder = index + 1;
        return item;
      });
  }

  return dateTimelineMap;
}

type GroupedTimelineItems = {
  past: { date: string; items: TimelineItem[] }[];
  today: { date: string; items: TimelineItem[] }[];
  tomorrow: { date: string; items: TimelineItem[] }[];
  future: { date: string; items: TimelineItem[] }[];
  undated: { date: "undated"; items: TimelineItem[] }[];
};

export function getGroupedTimelineItems({
  tasks,
  events,
}: {
  tasks: Task[];
  events: Event[];
}) {
  const undatedTimelineItems: TimelineItem[] = getUndatedTasks(tasks).map((task) =>
    getTimelineItemFromTask(task),
  );

  const dateTimelineItemsMap = getDateTimelineItemsMap({ tasks, events });
  const groupedTimelineItems: GroupedTimelineItems = {
    past: [],
    today: [],
    tomorrow: [],
    future: [],
    undated: [],
  };
  for (const [dateKey, items] of Object.entries(dateTimelineItemsMap)) {
    const date = new Date(dateKey);
    if (isPastDate(date)) {
      groupedTimelineItems.past.push({ date: dateKey, items });
    } else if (isToday(date)) {
      groupedTimelineItems.today.push({ date: dateKey, items });
    } else if (isTomorrow(date)) {
      groupedTimelineItems.tomorrow.push({ date: dateKey, items });
    } else if (isFutureDate(date)) {
      groupedTimelineItems.future.push({ date: dateKey, items });
    }
  }
  groupedTimelineItems.undated.push({
    date: "undated",
    items: undatedTimelineItems,
  });

  return groupedTimelineItems;
}
