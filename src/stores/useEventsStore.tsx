import { create } from "zustand";
import type { Event } from "../types/event";

interface EventsStore {
  events: Event[];

  setEvents: (events: Event[]) => void;
  editEvent: (eventId: string, updatedEvent:Event) => void;
  addEvent: (event: Event) => void;
}

export const useEventsStore = create<EventsStore>((set) => ({
  events: [],

  setEvents: (events) => set(() => ({ events })),
  editEvent:(eventId, updatedEvent) => set((state) => ({
    events: state.events.map((x) => x.id === eventId ? updatedEvent : x)
  })),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
}));
