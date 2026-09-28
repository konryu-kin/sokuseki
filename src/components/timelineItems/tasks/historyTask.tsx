import type { Task } from "../../../types/task";
import styles from "./taskItem.module.css";
import ContextTagsArea from "../commonParts/contextTagsArea";
import { useTasksStore } from "../../../stores/useTasksStore";
import CheckMark from "./checkmark";

type Props = {
  task: Task;
};
export default function HistoryTask({ task }: Props) {
  const { state } = task.content;
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
      {task.content.contextTagId ? (
        <ContextTagsArea contextTagId={task.content.contextTagId} />
      ) : null}
      <p>{task.content.description}</p>
      <CheckMark state={state} onClickHandler={onToggle} />
      {state === "todo" && (
        <div>
          <button>破棄する</button>
          <button>延期する</button>
        </div>
      )}
    </div>
  );
}
