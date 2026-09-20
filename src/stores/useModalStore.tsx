import { create } from "zustand";
import type { TimelineItem } from "../types/timelineItem";

interface ModalStore {
  modals: string[];
  generateItemRulesSelectContext?: {
    parentItem: TimelineItem;
  };

  setModals: (modals: string[]) => void;
  addModal: (modal: string) => void;
  clearModal: (modal: string) => void;
  setGenerateItemRulesSelectContext: (context:{
    parentItem: TimelineItem;
  }) => void
}

export const useModalStore = create<ModalStore>((set) => ({
  modals: [],

  setModals: (modals) => set(() => ({ modals })),
  addModal: (modal) => set((state) => ({ modals: [...state.modals, modal] })),
  clearModal: (modal: string) =>
    set((state) => ({ modals: state.modals.filter((x) => x !== modal) })),
  setGenerateItemRulesSelectContext: (context) => set(() => ({generateItemRulesSelectContext: context}))
}));
