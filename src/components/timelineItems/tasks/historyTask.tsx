import type { Task } from "../../../types/task";
import styles from "./taskItem.module.css";
import ContextTagsArea from "../commonParts/contextTagsArea";
import { useTasksStore } from "../../../stores/useTasksStore";
import CheckMark from "./checkmark";
import EditTaskModal from "../../modal/editTaskModal";
import { useState } from "react";
import PostponeTaskModal from "../../modal/postponeTaskModal";

type Props = {
  task: Task;
};
export default function HistoryTask({ task }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPostponeModalOpen, setIsPostponeModalOpen] = useState(false);
  const { state } = task.content;
  const updateTaskState = useTasksStore((state) => state.updateTaskState);
  const onToggle =
    state === "todo"
      ? () => updateTaskState(task.id, "done")
      : () => updateTaskState(task.id, "todo");
  return (
    <div
      className={[styles.itemBoard, state !== "todo" ? styles.done : ""]
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
          <button
            onClick={(event) => {
              event.stopPropagation();
              updateTaskState(task.id, "canceled");
            }}
          >
            破棄する
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              setIsPostponeModalOpen(true);
            }}
          >
            延期する
          </button>
        </div>
      )}
      {isEditModalOpen && (
        <EditTaskModal
          task={task}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {isPostponeModalOpen && (
        <PostponeTaskModal
          task={task}
          isOpen={isPostponeModalOpen}
          onClose={() => setIsPostponeModalOpen(false)}
        />
      )}
    </div>
  );
}
