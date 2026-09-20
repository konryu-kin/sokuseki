import type { TimelineItem } from "../../types/timelineItem";
import type { GeneratedItemOption } from "../../types/contextTag";
import { useEventsStore } from "../../stores/useEventsStore";
import { useTasksStore } from "../../stores/useTasksStore";
import { useContextTagsStore } from "../../stores/useContextTagsStore";
import { resolveDateTimeSpecifier } from "../../utils/date";
import type { Event } from "../../types/event";
import type { Task } from "../../types/task";

type Props = {
  parentItem: TimelineItem;
};

export default function GeneratedItemRulesSelect({ parentItem }: Props) {
  const addEvent = useEventsStore((state) => state.addEvent);
  const addTask = useTasksStore((state) => state.addTask);
  const getTagById = useContextTagsStore((state) => state.getTagById);
  const contextTag = parentItem.data.content.contextTagId
    ? getTagById(parentItem.data.content.contextTagId)
    : null;
  const generatedItemOptions = contextTag?.generatedItemOptions;
  return (
    <div>
      <p>追加するイベントを選択</p>
      {generatedItemOptions?.map((option) => (
        <button
          key={option.optionName}
          onClick={() =>
            addItemsByRule(parentItem, option.rules, addEvent, addTask)
          }
        >
          {option.optionName}
        </button>
      ))}
    </div>
  );
}

function addItemsByRule(
  parentItem: TimelineItem,
  rules: GeneratedItemOption["rules"],
  addEvent: (event: Event) => void,
  addTask: (task: Task) => void,
) {
  for (const rule of rules) {
    if (rule.itemType === "event") {
      if (parentItem.type != "event") return;
      // イベントからイベントを生成する場合
      const id = crypto.randomUUID();
      const startTimeReference = new Date(
        parentItem.data.content.timeRange.start,
      );
      const startTime = resolveDateTimeSpecifier(
        rule.ItemTemplate.content.timeRange.start,
        startTimeReference,
      );
      let endTime;
      if (parentItem.data.content.timeRange.end) {
        const endTimeReference = new Date(
          parentItem.data.content.timeRange.end,
        );
        endTime = resolveDateTimeSpecifier(
          rule.ItemTemplate.content.timeRange.end ??
            rule.ItemTemplate.content.timeRange.start,
          endTimeReference,
        );
      }
      const defaultOrder = new Date(startTime).getTime();
      const addedEvent = {
        id,
        defaultOrder,
        content: {
          ...parentItem.data.content,
          ...rule.ItemTemplate.content,
          timeRange: {
            start: startTime,
            end: endTime,
          },
        },
      } as Event;
      addEvent(addedEvent);
    } else if (rule.itemType === "task") {
      const reference = getItemReference(parentItem);
      if (!reference) return;

      const scheduledDate = rule.ItemTemplate.content.scheduledDate
        ? resolveDateTimeSpecifier(
            rule.ItemTemplate.content.scheduledDate,
            reference,
          ).slice(0, 10)
        : undefined;
      const dueDate = rule.ItemTemplate.content.dueDate
        ? resolveDateTimeSpecifier(
            rule.ItemTemplate.content.dueDate,
            reference,
          ).slice(0, 10)
        : undefined;
      const addedTask: Task = {
        id: crypto.randomUUID(),
        defaultOrder: scheduledDate
          ? new Date(`${scheduledDate}T00:00:00`).getTime()
          : Date.now(),
        content: {
          ...rule.ItemTemplate.content,
          scheduledDate,
          dueDate,
        },
      };
      addTask(addedTask);
    }
  }
}

function getItemReference(item: TimelineItem): Date | null {
  if (item.type === "event") {
    return new Date(item.data.content.timeRange.start);
  }

  if (item.data.content.scheduledDate) {
    return new Date(`${item.data.content.scheduledDate}T00:00:00`);
  }

  return null;
}
