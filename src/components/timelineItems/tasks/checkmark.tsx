import type { Task } from "../../../types/task";

type Props = {
  state: Task["content"]["state"];
  onClickHandler: () => void;
};

export default function CheckMark({ state, onClickHandler }: Props) {
  return (
    <button type="button" onClick={onClickHandler}>
      {state === "todo" ? "完了にする" : "未完了にする"}
    </button>
  );
}
