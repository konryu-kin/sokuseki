import { create } from "zustand";
import type { ContextTag } from "../types/contextTag";

interface ContextTagsStore {
  contextTags: ContextTag[];

  setContextTags: (contextTags: ContextTag[]) => void;
  getTagById: (tagId: ContextTag["id"]) => ContextTag | null;
  getParentTag: (
    contextTag: ContextTag | ContextTag["id"],
  ) => ContextTag | null;
}

function findTagById(contextTags: ContextTag[], tagId: ContextTag["id"]) {
  return contextTags.find((tag) => tag.id === tagId) ?? null;
}

export const useContextTagsStore = create<ContextTagsStore>((set, get) => ({
  contextTags: [],

  setContextTags: (contextTags) => set(() => ({ contextTags })),

  getTagById: (tagId) => {
    const { contextTags } = get();
    return findTagById(contextTags, tagId);
  },

  getParentTag: (contextTag) => {
    const { contextTags } = get();
    const targetTag =
      typeof contextTag === "string"
        ? findTagById(contextTags, contextTag)
        : contextTag;

    if (!targetTag || !targetTag.parentId) {
      return null;
    }

    return findTagById(contextTags, targetTag.parentId);
  },
}));
