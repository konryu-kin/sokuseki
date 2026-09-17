import { create } from "zustand";
import type { ContextTag } from "../types/contextTag";

interface ContextTagsStore {
  contextTags: ContextTag[];

  setContextTags: (contextTags: ContextTag[]) => void;
}

export const useContextTagsStore = create<ContextTagsStore>((set) => ({
  contextTags:[],

  setContextTags: (contextTags) => set(() => ({ contextTags }))
}));
