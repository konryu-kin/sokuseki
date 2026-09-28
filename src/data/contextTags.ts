import type { ContextTag } from "../types/contextTag";

function getTagPath(contextTag: ContextTag, tagsById: Map<string, ContextTag>) {
  const names: string[] = [];
  const visited = new Set<string>();
  let current: ContextTag | undefined = contextTag;

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    names.push(current.name);
    current = current.parentId ? tagsById.get(current.parentId) : undefined;
  }

  return names.reverse().join(" / ");
}

export function getContextTagsSorted(contextTags: ContextTag[]): ContextTag[] {
  const tagsById = new Map(
    contextTags.map((contextTag) => [contextTag.id, contextTag]),
  );

  return [...contextTags].sort((a, b) => {
    const pathOrder = getTagPath(a, tagsById).localeCompare(
      getTagPath(b, tagsById),
      "ja",
    );

    return pathOrder !== 0 ? pathOrder : a.id.localeCompare(b.id);
  });
}
