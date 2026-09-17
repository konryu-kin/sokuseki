import type { Event } from "../types/event";
export type DateTaskMap = Record<string, Event[]>;

function addEventToDateMap(
  dateMap: DateTaskMap,
  dateKey: string,
  event: Event,
) {
  if (!dateMap[dateKey]) {
    dateMap[dateKey] = [];
  }

  dateMap[dateKey].push(event);
}

export function getDateEventMap(events: Event[]): DateTaskMap {
  const dateEventMap = {};
  for (const event of events) {
    const scheduledDate = event.content.timeRange.start;
    const date = new Date(scheduledDate);
    if (Number.isNaN(date.getTime())) continue;

    const dateKey = scheduledDate.slice(0, 10);
    addEventToDateMap(dateEventMap, dateKey, event);
  }
  return dateEventMap;
}
