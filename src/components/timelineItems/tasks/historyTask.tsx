import type { Task } from "../../../types/task";
import styles from "./taskItem.module.css";
import ContextTagsArea from "../commonParts/contextTagsArea";

type Props = {
  task: Task;
};
export default function HistoryTask({ task }: Props) {
  const {state} = task.content
  return (
    <div
      className={[styles.itemBoard, state === "done" ? styles.done : ""]
          .filter(Boolean)
          .join(" ")}>
      {task.content.contextTagId ? (
        <ContextTagsArea contextTagId={task.content.contextTagId} />
      ) : null}
      <p>{task.content.description}</p>
      <div>
        <button>破棄する</button>
        <button>延期する</button>
      </div>
    </div>
  );
}
