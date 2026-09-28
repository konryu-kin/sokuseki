import type { ContextTag } from "../../../types/contextTag";
import styles from "./contextTagTip.module.css";

type Props = {
  contextTag: ContextTag;
};

export default function ContextTagTip({ contextTag }: Props) {
  return (
    <div className={styles.tip}>
      <span>{contextTag.name}</span>
    </div>
  );
}
