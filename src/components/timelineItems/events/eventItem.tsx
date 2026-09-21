import type { Event } from "../../../types/event";
import styles from "./eventItem.module.css";
import ContextTagsArea from "../smallParts/contextTagsArea";
import AddEventButton from "../smallParts/addItemByRuleButton";
import type { TimelineItem } from "../../../types/timelineItem";
type Props = {
  event: Event;
};
export default function EventItem({ event }: Props) {
  return (
    <div className={styles.itemboard}>
      <ContextTagsArea contextTagId={event.content.contextTagId ?? null} />
      <p>{event.content.name}</p>
      <AddEventButton parentItem={{type:"event", data:event} as TimelineItem}/>
    </div>
  );
}
