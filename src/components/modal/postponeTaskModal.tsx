import { useEffect, useRef, useState } from "react";
import postponedTask from "../../data/tasks";
import { useTasksStore } from "../../stores/useTasksStore";
import type { Task } from "../../types/task";

type Props = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
};

function formatLocalDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${String(date.getFullYear()).padStart(4, "0")}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function PostponeTaskModal({ task, isOpen, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const addTask = useTasksStore((state) => state.addTask);
  const updateTaskState = useTasksStore((state) => state.updateTaskState);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    event.stopPropagation();
    if (event.target === dialogRef.current) onClose();
  };

  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  const postponeTo = (date: string) => {
    const time = task.content.scheduledDate?.match(
      /T(\d{2}:\d{2}(?::\d{2})?)/,
    )?.[1];
    const scheduledDate = time ? `${date}T${time}` : date;

    addTask(postponedTask(task, scheduledDate));
    updateTaskState(task.id, "postponed");
    onClose();
  };

  const postponeToToday = () => postponeTo(formatLocalDate(new Date()));

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={handleCancel}
    >
      <h2>タスクを延期する</h2>
      <ul>
        <li>
          <button type="button" onClick={postponeToToday}>
            今日に移す
          </button>
        </li>
        <li>
          <label htmlFor="postpone-date">任意の日付に移す</label>
          <div>
            <input
              required
              type="date"
              id="postpone-date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
            <button
              type="button"
              disabled={!selectedDate}
              onClick={() => postponeTo(selectedDate)}
            >
              に移動
            </button>
          </div>
        </li>
      </ul>
      <button type="button" onClick={onClose}>
        キャンセル
      </button>
    </dialog>
  );
}
