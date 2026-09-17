import type { ContextTag } from "../../../types/contextTag";
import { useContextTagsStore } from "../../../stores/useContextTagsStore";
import ContextTagTip from "./contextTagTip";

type Props = {
  contextTagId: ContextTag["id"] | null;
};

export default function ContextTagsArea({ contextTagId }: Props) {
  const getTagById = useContextTagsStore((state) => state.getTagById);
  const getParentTag = useContextTagsStore((state) => state.getParentTag);
  if(!contextTagId){
    return(<div></div>)
  }
  const contextTag = getTagById(contextTagId);
  const parentContextTag = contextTag ? getParentTag(contextTag) : null;
  return (
    <div>
      {parentContextTag ? (
        <ContextTagTip contextTag={parentContextTag} />
      ) : null}
      {contextTag ? <ContextTagTip contextTag={contextTag} /> : null}
    </div>
  );
}
