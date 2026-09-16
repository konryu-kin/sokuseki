import type { Task } from "../types/task";
import type { Event } from "../types/event";
import { getDateEventMap } from "./events";
import { getDateTaskMap } from "./tasks";
import type { TimelineItem } from "../types/timelineItem";

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

export function getGroupedTimelineItems({
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
