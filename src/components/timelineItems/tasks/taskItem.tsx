import type { Task } from "../../../types/task";
import ActiveTask from "./activeTask";
import HistoryTask from "./historyTask";

type Props = {
  task: Task;
};

export default function TaskItem({ task }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const scheduledDate = task.content.scheduledDate
    ? new Date(task.content.scheduledDate)
    : null;
  return (
    <>
      {!scheduledDate || today <= scheduledDate ? (
        <ActiveTask task={task} />
      ) : (
        <HistoryTask task={task} />
      )}
    </>
  );
}
