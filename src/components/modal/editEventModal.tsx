import { useEventsStore } from "../../stores/useEventsStore";
import type { Event } from "../../types/event";
import { useState, useRef, useEffect } from "react";
import SelectContextTagModal from "./selectContextTagModal";
import type { ContextTag } from "../../types/contextTag";

function formatLocalDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  const year = String(date.getFullYear()).padStart(4, "0");
  return `${year}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

type Props = {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
};
export default function EditEventModal({ event, isOpen, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // 親の isOpen の状態に合わせて dialog要素を直接操作する
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      // すでに開いている場合は二重で呼ばないようにチェック
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  // 背景（backdrop）クリックで閉じる処理
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    e.stopPropagation();
    if (e.target === dialogRef.current) {
      onClose(); // 親に「閉じてね」と通知する
    }
  };

  // Escキーで閉じられたとき、親の State (isOpen) も false に同期させる
  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault(); // デフォルト挙動を上書き
    onClose();
  };

  const editEvent = useEventsStore((state) => state.editEvent);
  const [form, setForm] = useState<Event>(event);

  const handleForm = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setForm({
      ...form,
      content: {
        ...form.content,
        [e.target.name]: e.target.value,
      },
    });
  };
  const sendUpdate = () => {
    editEvent(event.id, form);
    onClose();
  };

  const updateTimeRange = (
    field: "start" | "end",
    part: "date" | "time",
    value: string,
  ) => {
    setForm((currentForm) => {
      const { start, end } = currentForm.content.timeRange;
      const currentValue = field === "start" ? start : end;
      if (!currentValue || !value) return currentForm;

      const date = part === "date" ? value : currentValue.slice(0, 10);
      const time = part === "time" ? value : currentValue.slice(11, 16);
      const updatedValue = `${date}T${time}:00`;
      const updatedDate = new Date(updatedValue);
      if (Number.isNaN(updatedDate.getTime())) return currentForm;

      let updatedStart = field === "start" ? updatedValue : start;
      let updatedEnd = field === "end" ? updatedValue : end;

      if (end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const duration = endDate.getTime() - startDate.getTime();

        if (duration > 0 && field === "start" && updatedDate > endDate) {
          updatedEnd = formatLocalDateTime(
            new Date(updatedDate.getTime() + duration),
          );
        } else if (duration > 0 && field === "end" && updatedDate < startDate) {
          updatedStart = formatLocalDateTime(
            new Date(updatedDate.getTime() - duration),
          );
        }
      }

      return {
        ...currentForm,
        content: {
          ...currentForm.content,
          timeRange: {
            ...currentForm.content.timeRange,
            start: updatedStart,
            ...(updatedEnd ? { end: updatedEnd } : {}),
          },
        },
      };
    });
  };

  const addEndTime = () => {
    const end = new Date(form.content.timeRange.start);
    end.setHours(end.getHours() + 1);
    setForm((currentForm) => ({
      ...currentForm,
      content: {
        ...currentForm.content,
        timeRange: {
          ...currentForm.content.timeRange,
          end: formatLocalDateTime(end),
        },
      },
    }));
  };

  const removeEndTime = () => {
    setForm((currentForm) => ({
      ...currentForm,
      content: {
        ...currentForm.content,
        timeRange: { start: currentForm.content.timeRange.start },
      },
    }));
  };

  // 文脈タグの選択
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const onSelectContextTag = (contextTag: ContextTag) => {
    setForm({
      ...form,
      content: {
        ...form.content,
        contextTagId: contextTag.id,
      },
    });
  };
  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={handleCancel}
    >
      <h2>イベントを編集する</h2>
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
        <input
          id="name"
          name="name"
          type="text"
          onChange={handleForm}
          value={form.content.name}
        />
        <div>
          <label htmlFor="start-date">開始日</label>
          <input
            required
            type="date"
            id="start-date"
            value={form.content.timeRange.start.slice(0, 10)}
            onChange={(e) => updateTimeRange("start", "date", e.target.value)}
          />
          <label htmlFor="start-time">開始時刻</label>
          <input
            required
            type="time"
            id="start-time"
            step={60}
            value={form.content.timeRange.start.slice(11, 16)}
            onChange={(e) => updateTimeRange("start", "time", e.target.value)}
          />
        </div>
        {form.content.timeRange.end ? (
          <div>
            <label htmlFor="end-date">終了日</label>
            <input
              required
              type="date"
              id="end-date"
              value={form.content.timeRange.end.slice(0, 10)}
              onChange={(e) => updateTimeRange("end", "date", e.target.value)}
            />
            <label htmlFor="end-time">終了時刻</label>
            <input
              required
              type="time"
              id="end-time"
              step={60}
              value={form.content.timeRange.end.slice(11, 16)}
              onChange={(e) => updateTimeRange("end", "time", e.target.value)}
            />
            <button type="button" onClick={removeEndTime}>
              終了時刻を削除
            </button>
          </div>
        ) : (
          <button type="button" onClick={addEndTime}>
            終了時刻を設定する
          </button>
        )}
        <input
          id="description"
          name="description"
          type="text"
          onChange={handleForm}
          value={form.content.description}
        />
        <button type="button" onClick={() => setIsContextModalOpen(true)}>
          文脈タグを選択
        </button>
      </form>
      <SelectContextTagModal
        isOpen={isContextModalOpen}
        onClose={() => setIsContextModalOpen(false)}
        onSelect={onSelectContextTag}
      />
    </dialog>
  );
}
