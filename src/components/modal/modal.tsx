import { Fragment } from "react/jsx-runtime";
import { useModalStore } from "../../stores/useModalStore";
import GeneratedItemRulesSelect from "./generatedItemRulesSelect";

export default function Modal() {
  const modals = useModalStore((state) => state.modals);
  const generatedItemRulesSelectContext = useModalStore(
    (state) => state.generateItemRulesSelectContext,
  );
  const RulesSelectModal = generatedItemRulesSelectContext?.parentItem ? (
    <GeneratedItemRulesSelect
      parentItem={generatedItemRulesSelectContext?.parentItem}
    />
  ) : null;
  return (
    <div>
      {modals.map((modal, i) => (
        <Fragment key={`modal-${i}`}>
          <div className="modalOverlay"></div>
          {modal === "generatedItemRulesSelect" ? RulesSelectModal : null}
        </Fragment>
      ))}
    </div>
  );
}
