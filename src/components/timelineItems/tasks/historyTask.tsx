import type { Task } from "../../../types/task";
import ContextTagsArea from "../commonParts/contextTagsArea";

type Props = {
  task: Task;
};
export default function HistoryTask({ task }: Props) {
  return (
    <div>
      {task.content.contextTagId ? (
        <ContextTagsArea contextTagId={task.content.contextTagId} />
      ) : null}
      <p>{task.content.description}</p>
      <div>
        <button>破棄する</button>
        <button>延期する</button>
      </div>
    </div>
  );
}
