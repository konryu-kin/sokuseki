import { create } from "zustand";
import type { Event } from "../types/event";

interface EventsStore {
  events: Event[];

  setEvents: (events: Event[]) => void;
}

export const useTasksStore = create<EventsStore>((set) => ({
  events: [],

  setEvents: (events) => set(() => ({ events }))
}));
