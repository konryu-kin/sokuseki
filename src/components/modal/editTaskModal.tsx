import { useEffect, useRef, useState } from "react";
import { useTasksStore } from "../../stores/useTasksStore";
import { useContextTagsStore } from "../../stores/useContextTagsStore";
import type { Task } from "../../types/task";
import type { ContextTag } from "../../types/contextTag";
import SelectContextTagModal from "./selectContextTagModal";
import { formatLocalDate, formatLocalDateTime } from "../../utils/date";

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
      <h2>タスクを編集する</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendUpdate();
        }}
      >
        <div>
          <button type="button" onClick={onClose}>
            close
          </button>
          <button type="submit">save</button>
        </div>
        <label htmlFor="task-description">タスク</label>
        <textarea
          id="task-description"
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
            <label htmlFor="scheduled-time">予定時刻</label>
            <input
              required
              type="time"
              id="scheduled-time"
              step={60}
              value={form.content.scheduledDate.slice(11, 16) || "00:00"}
              onChange={(e) => updateScheduledDate("time", e.target.value)}
            />
            <button type="button" onClick={removeScheduledDate}>
              予定日時を削除
            </button>
          </div>
        ) : (
          <button type="button" onClick={addScheduledDate}>
            予定日時を設定する
          </button>
        )}
        {form.content.dueDate ? (
          <div>
            <label htmlFor="task-due-date">期限</label>
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
              期限を削除
            </button>
          </div>
        ) : (
          <button type="button" onClick={addDueDate}>
            期限を設定する
          </button>
        )}
        <div>
          <span>{selectedContextTag?.name ?? "文脈タグ未設定"}</span>
          <button type="button" onClick={() => setIsContextModalOpen(true)}>
            文脈タグを選択
          </button>
          {form.content.contextTagId && (
            <button type="button" onClick={removeContextTag}>
              文脈タグを解除
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
