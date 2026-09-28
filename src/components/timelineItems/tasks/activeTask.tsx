import type { Task } from "../../../types/task";
import styles from "./taskItem.module.css";
import { useTasksStore } from "../../../stores/useTasksStore";
import ContextTagsArea from "../commonParts/contextTagsArea";
import CheckMark from "./checkmark";
import { useState } from "react";
import EditTaskModal from "../../modal/editTaskModal";

type Props = {
  task: Task;
};

export default function ActiveTask({ task }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
      onClick={() => setIsEditModalOpen(true)}
    >
      <ContextTagsArea contextTagId={task.content.contextTagId ?? null} />
      {description && <p>{description}</p>}
      {dueDate && <p>{dueDate}まで</p>}
      <CheckMark state={state} onClickHandler={onToggle} />
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
