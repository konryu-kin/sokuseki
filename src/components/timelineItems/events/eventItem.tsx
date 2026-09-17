import type { Event } from "../../../types/event";
import styles from "./eventItem.module.css";

type Props = {
  event: Event;
};
export default function EventItem({ event }: Props) {
  return (
    <div className={styles.itemboard}>
      <p>{event.content.name}</p>
    </div>
  );
}
