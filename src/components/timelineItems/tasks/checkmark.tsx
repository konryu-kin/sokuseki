import type { Task } from "../../../types/task";

type Props = {
  state: Task["content"]["state"];
  onClickHandler: () => void;
};

export default function CheckMark({ state, onClickHandler }: Props) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClickHandler();
      }}
    >
      {state === "todo" ? "完了にする" : "未完了にする"}
    </button>
  );
}
