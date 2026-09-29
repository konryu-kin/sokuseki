import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent, SyntheticEvent } from "react";
import { useContextTagsStore } from "../stores/useContextTagsStore";
import { useEventsStore } from "../stores/useEventsStore";
import { useTasksStore } from "../stores/useTasksStore";
import { formatLocalDate } from "../utils/date";
import styles from "./addItemButton.module.css";

type ItemType = "task" | "event";

export default function AddItemButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const addTask = useTasksStore((state) => state.addTask);
  const addEvent = useEventsStore((state) => state.addEvent);
  const contextTags = useContextTagsStore((state) => state.contextTags);

  const [isOpen, setIsOpen] = useState(false);
  const [itemType, setItemType] = useState<ItemType>("task");
  const [contextTagId, setContextTagId] = useState<string>();
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [taskDate, setTaskDate] = useState(formatLocalDate(new Date()));
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState(formatLocalDate(new Date()));
  const [hasStartTime, setHasStartTime] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDate, setEndDate] = useState(formatLocalDate(new Date()));
  const [hasEndTime, setHasEndTime] = useState(false);
  const [endTime, setEndTime] = useState("10:00");
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const closeDialog = () => setIsOpen(false);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) closeDialog();
  };

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    closeDialog();
  };

  const resetForm = () => {
    const today = formatLocalDate(new Date());
    setItemType("task");
    setContextTagId(undefined);
    setDescription("");
    setName("");
    setTaskDate(today);
    setDueDate("");
    setStartDate(today);
    setHasStartTime(false);
    setStartTime("09:00");
    setHasEndDate(false);
    setEndDate(today);
    setHasEndTime(false);
    setEndTime("10:00");
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = itemType === "task" ? description.trim() : name.trim();
    if (!contextTagId && !text) {
      setError("文脈タグか内容のどちらかを入力してください。");
      return;
    }

    const id = crypto.randomUUID();

    if (itemType === "task") {
      const scheduledDate = `${taskDate}T00:00:00`;
      addTask({
        id,
        defaultOrder: new Date(scheduledDate).getTime(),
        content: {
          state: "todo",
          scheduledDate,
          ...(contextTagId ? { contextTagId } : {}),
          ...(description.trim() ? { description: description.trim() } : {}),
          ...(dueDate ? { dueDate } : {}),
        },
      });
    } else {
      const start = `${startDate}T${hasStartTime ? startTime : "00:00"}:00`;
      const end = hasEndDate
        ? `${endDate}T${hasEndTime ? endTime : "00:00"}:00`
        : undefined;

      if (end && new Date(end).getTime() < new Date(start).getTime()) {
        setError("終了日時は開始日時以降にしてください。");
        return;
      }

      addEvent({
        id,
        defaultOrder: new Date(start).getTime(),
        content: {
          name: name.trim(),
          timeRange: { start, ...(end ? { end } : {}) },
          ...(contextTagId ? { contextTagId } : {}),
        },
      });
    }

    resetForm();
    closeDialog();
  };

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        aria-label="アイテムを追加"
        onClick={() => setIsOpen(true)}
      >
        +
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClick={handleBackdropClick}
        onCancel={handleCancel}
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.title}>
            <label>
              <select
                value={itemType}
                onChange={(event) => {
                  setItemType(event.target.value as ItemType);
                  setError("");
                }}
              >
                <option value="task">タスク</option>
                <option value="event">イベント</option>
              </select>
              を追加する
            </label>
          </h2>

          <fieldset className={styles.fieldset}>
            <legend>文脈タグ（任意）</legend>
            <div className={styles.tagList}>
              {contextTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className={styles.tagButton}
                  aria-pressed={contextTagId === tag.id}
                  onClick={() =>
                    setContextTagId((current) =>
                      current === tag.id ? undefined : tag.id,
                    )
                  }
                >
                  {tag.name}
                </button>
              ))}
              {contextTags.length === 0 && (
                <span className={styles.emptyTags}>文脈タグがありません</span>
              )}
            </div>
          </fieldset>

          {itemType === "task" ? (
            <>
              <label className={styles.field}>
                内容（任意）
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                />
              </label>

              <label className={styles.field}>
                期限（任意）
                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </label>

              <label className={styles.field}>
                いつやるか
                <input
                  required
                  type="date"
                  value={taskDate}
                  onChange={(event) => setTaskDate(event.target.value)}
                />
              </label>
            </>
          ) : (
            <>
              <label className={styles.field}>
                名前（任意）
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>

              <fieldset className={styles.fieldset}>
                <legend>いつ始まるか</legend>
                <label className={styles.field}>
                  日付
                  <input
                    required
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </label>
                <label className={styles.checkboxField}>
                  <input
                    type="checkbox"
                    checked={hasStartTime}
                    onChange={(event) => setHasStartTime(event.target.checked)}
                  />
                  時刻も指定する
                </label>
                {hasStartTime && (
                  <input
                    aria-label="開始時刻"
                    type="time"
                    step={60}
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                  />
                )}
              </fieldset>

              <fieldset className={styles.fieldset}>
                <legend>いつ終わるか（任意）</legend>
                {!hasEndDate ? (
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      setEndDate(startDate);
                      setHasEndDate(true);
                    }}
                  >
                    終了日時を追加
                  </button>
                ) : (
                  <>
                    <label className={styles.field}>
                      日付
                      <input
                        required
                        type="date"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                      />
                    </label>
                    <label className={styles.checkboxField}>
                      <input
                        type="checkbox"
                        checked={hasEndTime}
                        onChange={(event) =>
                          setHasEndTime(event.target.checked)
                        }
                      />
                      時刻も指定する
                    </label>
                    {hasEndTime && (
                      <input
                        aria-label="終了時刻"
                        type="time"
                        step={60}
                        value={endTime}
                        onChange={(event) => setEndTime(event.target.value)}
                      />
                    )}
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => setHasEndDate(false)}
                    >
                      終了日時を削除
                    </button>
                  </>
                )}
              </fieldset>
            </>
          )}

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={closeDialog}
            >
              キャンセル
            </button>
            <button type="submit" className={styles.submitButton}>
              追加する
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
