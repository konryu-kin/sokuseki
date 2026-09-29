import { useEffect, useRef, useState } from "react";
import { useTasksStore } from "../../stores/useTasksStore";
import { useContextTagsStore } from "../../stores/useContextTagsStore";
import type { Task } from "../../types/task";
import type { ContextTag } from "../../types/contextTag";
import SelectContextTagModal from "./selectContextTagModal";
import { formatLocalDate, formatLocalDateTime } from "../../utils/date";
import styles from "./editTaskModal.module.css";

type Props = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
};

export default function EditTaskModal({ task, isOpen, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const editTask = useTasksStore((state) => state.editTask);
  const contextTags = useContextTagsStore((state) => state.contextTags);
  const [form, setForm] = useState<Task>(task);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    e.stopPropagation();
    if (e.target === dialogRef.current) onClose();
  };

  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onClose();
  };

  const sendUpdate = () => {
    editTask(task.id, form);
    onClose();
  };

  const updateScheduledDate = (part: "date" | "time", value: string) => {
    setForm((currentForm) => {
      const currentValue = currentForm.content.scheduledDate;
      if (!currentValue || !value) return currentForm;

      const date = part === "date" ? value : currentValue.slice(0, 10);
      const time =
        part === "time" ? value : currentValue.slice(11, 16) || "00:00";
      return {
        ...currentForm,
        content: {
          ...currentForm.content,
          scheduledDate: `${date}T${time}:00`,
        },
      };
    });
  };

  const addScheduledDate = () => {
    setForm((currentForm) => ({
      ...currentForm,
      content: {
        ...currentForm.content,
        scheduledDate: formatLocalDateTime(new Date()),
      },
    }));
  };

  const removeScheduledDate = () => {
    setForm((currentForm) => {
      const content = { ...currentForm.content };
      delete content.scheduledDate;
      return { ...currentForm, content };
    });
  };

  const addDueDate = () => {
    setForm((currentForm) => ({
      ...currentForm,
      content: {
        ...currentForm.content,
        dueDate:
          currentForm.content.scheduledDate?.slice(0, 10) ??
          formatLocalDate(new Date()),
      },
    }));
  };

  const removeDueDate = () => {
    setForm((currentForm) => {
      const content = { ...currentForm.content };
      delete content.dueDate;
      return { ...currentForm, content };
    });
  };

  const onSelectContextTag = (contextTag: ContextTag) => {
    setForm((currentForm) => ({
      ...currentForm,
      content: { ...currentForm.content, contextTagId: contextTag.id },
    }));
  };

  const removeContextTag = () => {
    setForm((currentForm) => {
      const content = { ...currentForm.content };
      delete content.contextTagId;
      return { ...currentForm, content };
    });
  };

  const selectedContextTag = contextTags.find(
    (contextTag) => contextTag.id === form.content.contextTagId,
  );

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={handleCancel}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendUpdate();
        }}
      >
        <div>
          <button
            type="button"
            className={styles.completeButton}
            onClick={onClose}
          >
            x
          </button>
          <button type="submit" className={styles.closeButton}>
            v
          </button>
        </div>
        <textarea
          id="task-description"
          className={styles.description}
          value={form.content.description ?? ""}
          onChange={(e) =>
            setForm((currentForm) => ({
              ...currentForm,
              content: { ...currentForm.content, description: e.target.value },
            }))
          }
        />
        {form.content.scheduledDate ? (
          <div>
            <label htmlFor="scheduled-date">予定日</label>
            <input
              required
              type="date"
              id="scheduled-date"
              value={form.content.scheduledDate.slice(0, 10)}
              onChange={(e) => updateScheduledDate("date", e.target.value)}
            />
            <input
              required
              type="time"
              id="scheduled-time"
              step={60}
              value={form.content.scheduledDate.slice(11, 16) || "00:00"}
              onChange={(e) => updateScheduledDate("time", e.target.value)}
            />
            <button type="button" onClick={removeScheduledDate}>
              x
            </button>
          </div>
        ) : (
          <button type="button" onClick={addScheduledDate}>
            +
          </button>
        )}
        {form.content.dueDate ? (
          <div>
            <input
              required
              type="date"
              id="task-due-date"
              value={form.content.dueDate.slice(0, 10)}
              onChange={(e) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  content: { ...currentForm.content, dueDate: e.target.value },
                }))
              }
            />
            <button type="button" onClick={removeDueDate}>
              x
            </button>
          </div>
        ) : (
          <button type="button" onClick={addDueDate}>
            +
          </button>
        )}
        <div>
          <span>{selectedContextTag?.name ?? "文脈タグ未設定"}</span>
          <button type="button" onClick={() => setIsContextModalOpen(true)}>
            +
          </button>
          {form.content.contextTagId && (
            <button type="button" onClick={removeContextTag}>
              x
            </button>
          )}
        </div>
      </form>
      <SelectContextTagModal
        isOpen={isContextModalOpen}
        onClose={() => setIsContextModalOpen(false)}
        onSelect={onSelectContextTag}
      />
    </dialog>
  );
}
