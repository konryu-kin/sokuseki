import type { TimelineItem } from "../../../types/timelineItem";
import { useModalStore } from "../../../stores/useModalStore";
type Props = {
  parentItem: TimelineItem;
};
export default function AddEventButton({ parentItem }: Props) {
  const addModal = useModalStore((state) => state.addModal);
  const setGenerateItemRulesSelectContext = useModalStore(
    (state) => state.setGenerateItemRulesSelectContext,
  );
  const displaySelectModal = () => {
    addModal("generatedItemRulesSelect");
    setGenerateItemRulesSelectContext({ parentItem });
  };
  return <button onClick={displaySelectModal}>+Event</button>;
}
