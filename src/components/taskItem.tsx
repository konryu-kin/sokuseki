import type { Task } from "../types/task";
import styles from "./taskItem.module.css";

type Props = {
  task: Task;
};

export default function TaskItem({ task }: Props) {
  const { description } = task.content;
  return (
    <div className={styles.itemBoard}>
      <p>{task.id}</p>
      {description && <p>{description}</p>}
    </div>
  );
}
