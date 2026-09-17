import type { Event } from "../../../types/event";
import styles from "./eventItem.module.css";
import ContextTagsArea from "../smallParts/contextTagsArea";

type Props = {
  event: Event;
};
export default function EventItem({ event }: Props) {
  return (
    <div className={styles.itemboard}>
      <ContextTagsArea contextTagId={event.content.contextTagId ?? null} />
      <p>{event.content.name}</p>
    </div>
  );
}
