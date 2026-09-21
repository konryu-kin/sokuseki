import { useEventsStore } from "../../stores/useEventsStore";
import type { Event } from "../../types/event";
import { useState, useRef, useEffect } from "react";
import SelectContextTagModal from "./selectContextTagModal";
import type { ContextTag } from "../../types/contextTag";

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
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <button type="button" onClick={onClose}>
            close
          </button>
          <button type="button" onClick={sendUpdate}>
            save
          </button>
        </div>
        <input
          id="name"
          name="name"
          type="text"
          onChange={handleForm}
          value={form.content.name}
        />
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
