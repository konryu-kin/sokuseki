import type { Task } from "../../../types/task";
import styles from "./taskItem.module.css";
import ContextTagsArea from "../commonParts/contextTagsArea";
import { useTasksStore } from "../../../stores/useTasksStore";
import CheckMark from "./checkmark";
import EditTaskModal from "../../modal/editTaskModal";
import { useState } from "react";

type Props = {
  task: Task;
};
export default function HistoryTask({ task }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
      onClick={() => setIsEditModalOpen(true)}
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
      {isEditModalOpen && (
        <EditTaskModal
          task={task}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
