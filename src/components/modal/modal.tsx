import { Fragment } from "react/jsx-runtime";
import { useModalStore } from "../../stores/useModalStore";
import GeneratedItemRulesSelect from "./generatedItemRulesSelect";
import styles from "./modal.module.css";

export default function Modal() {
  //TODO:dialogを使ったものに書き換える
  const modals = useModalStore((state) => state.modals);
  const generatedItemRulesSelectContext = useModalStore(
    (state) => state.generateItemRulesSelectContext,
  );
  const clearModal = useModalStore((state) => state.clearModal);
  const RulesSelectModal = generatedItemRulesSelectContext?.parentItem ? (
    <GeneratedItemRulesSelect
      parentItem={generatedItemRulesSelectContext?.parentItem}
    />
  ) : null;
  return (
    <div>
      {modals.map((modal, i) => (
        <Fragment key={`modal-${i}`}>
          <div
            className={`modalOverlay ${styles.modalOverlay}`}
            onClick={() => clearModal(modals.at(-1) ?? "")}
          >
            {modal === "generatedItemRulesSelect" ? RulesSelectModal : null}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
