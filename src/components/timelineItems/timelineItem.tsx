import type { TimelineItem } from "../../types/timelineItem";
import TaskItem from "./tasks/taskItem";
import EventItem from "./events/eventItem";

type Props = {
  timelineItem: TimelineItem;
};

export default function TimelineItem({ timelineItem }: Props) {
  const { type, data } = timelineItem;
  const item =
    type === "task" ? (
      <TaskItem task={data} />
    ) : type === "event" ? (
      <EventItem event={data} />
    ) : null;
  return item;
}
