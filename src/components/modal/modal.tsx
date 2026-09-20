import { useModalStore } from "../../stores/useModalStore";
import GeneratedItemRulesSelect from "./generatedItemRulesSelect";

export default function Modal() {
  const modals = useModalStore((state) => state.modals);
  const generatedItemRulesSelectContext = useModalStore(
    (state) => state.generateItemRulesSelectContext,
  );
  const RulesSelectModal =
    modals.some((x) => x === "generatedItemRulesSelect") &&
    generatedItemRulesSelectContext?.parentItem ? (
      <GeneratedItemRulesSelect
        parentItem={generatedItemRulesSelectContext?.parentItem}
      />
    ) : null;
  return (
    <div>
      {modals.map((modal) => (
        <>
          <div className="modalOverlay"></div>
          {modal === "generatedItemRulesSelect" ? RulesSelectModal : null}
        </>
      ))}
    </div>
  );
}
