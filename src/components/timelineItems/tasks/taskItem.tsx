import type { Task } from "../../../types/task";
import styles from "./taskItem.module.css";
import { useTasksStore } from "../../../stores/useTasksStore";
import ContextTagsArea from "../smallParts/contextTagsArea";

type Props = {
  task: Task;
};

export default function TaskItem({ task }: Props) {
  const { description, dueDate, state } = task.content;
  const updateTaskState = useTasksStore((state) => state.updateTaskState);
  const onToggle =
    state === "todo"
      ? () => updateTaskState(task.id, "done")
      : () => updateTaskState(task.id, "todo");
  return (
    <div
      className={[styles.itemBoard, state === "done" ? styles.done : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <ContextTagsArea contextTagId={task.content.contextTagId ?? null} />
      {description && <p>{description}</p>}
      {dueDate && <p>{dueDate}まで</p>}
      <button type="button" onClick={onToggle}>
        {state === "todo" ? "完了にする" : "未完了にする"}
      </button>
    </div>
  );
}
