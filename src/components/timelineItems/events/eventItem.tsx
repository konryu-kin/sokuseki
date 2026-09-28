import type { Event } from "../../../types/event";
import styles from "./eventItem.module.css";
import ContextTagsArea from "../smallParts/contextTagsArea";
import AddEventButton from "../smallParts/addItemByRuleButton";
import type { TimelineItem } from "../../../types/timelineItem";
import EditEventModal from "../../modal/editEventModal";
import { useState } from "react";
type Props = {
  event: Event;
};
export default function EventItem({ event }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.itemboard} onClick={() => setIsModalOpen(true)}>
      <ContextTagsArea contextTagId={event.content.contextTagId ?? null} />
      <p>{event.content.name}</p>
      <AddEventButton
        parentItem={{ type: "event", data: event } as TimelineItem}
      />
      {isModalOpen && (
        <EditEventModal
          event={event}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
