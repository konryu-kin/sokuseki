import { create } from "zustand";
import type { Event } from "../types/event";

interface EventsStore {
  events: Event[];

  setEvents: (events: Event[]) => void;
}

export const useEventsStore = create<EventsStore>((set) => ({
  events: [],

  setEvents: (events) => set(() => ({ events }))
}));
