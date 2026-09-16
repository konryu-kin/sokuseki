import type { Task } from "../types/task";
import styles from "./taskItem.module.css";

type Props = {
  task: Task;
  onToggle: () => void;
};

export default function TaskItem({ task, onToggle }: Props) {
  const { description, dueDate, state } = task.content;

  return (
    <div className={[
      styles.itemBoard,
      state === "done" ? styles.done : ""
    ].filter(Boolean).join(" ")}>
      <p>{task.id}</p>
      {description && <p>{description}</p>}
      {dueDate && <p>{dueDate}まで</p>}
      <button type="button" onClick={onToggle}>
        {state === "todo" ? "完了にする" : "未完了にする"}
      </button>
    </div>
  );
}
