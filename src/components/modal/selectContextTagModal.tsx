import { useEffect, useRef } from "react";
import { getContextTagsSorted } from "../../data/contextTags";
import { useContextTagsStore } from "../../stores/useContextTagsStore";
import type { ContextTag } from "../../types/contextTag";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (contextTag: ContextTag) => void;
};

export default function SelectContextTagModal({
  isOpen,
  onClose,
  onSelect,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contextTags = useContextTagsStore((state) => state.contextTags);
  const sortedContextTags = getContextTagsSorted(contextTags);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleSelect = (contextTag: ContextTag) => {
    onSelect(contextTag);
    onClose();
  };

  return (
    <dialog ref={dialogRef}>
      <h2>タグを選択</h2>
      <ul>
        {sortedContextTags.map((contextTag) => (
          <li key={contextTag.id}>
            <button type="button" onClick={() => handleSelect(contextTag)}>
              {contextTag.name}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onClose}>
        閉じる
      </button>
    </dialog>
  );
}
