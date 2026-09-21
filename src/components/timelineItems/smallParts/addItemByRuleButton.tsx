import type { TimelineItem } from "../../../types/timelineItem";
import styles from "./addItemByRuleButton.module.css";
type Props = {
  parentItem: TimelineItem;
};
import GeneratedItemRulesSelect from "../../modal/generatedItemRulesSelect";
export default function AddEventButton({ parentItem }: Props) {
  const itemId = `${parentItem.type}-${parentItem.data.id}`;
  return (
    <>
      <button
        popoverTarget={`selectTip-${itemId}`}
        className={styles.addItemButton}
        style={{
          anchorName: `--addItemButton-${itemId}`,
        }}
      >
        +Event
      </button>
      <div
        id={`selectTip-${itemId}`}
        popover="auto"
        className={styles.tooltip}
        style={{
          positionAnchor: `--addItemButton-${itemId}`,
        }}
      >
        <GeneratedItemRulesSelect parentItem={parentItem} />
      </div>
    </>
  );
}
