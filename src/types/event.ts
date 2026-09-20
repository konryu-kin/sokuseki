import type { ContextTag } from "./contextTag";

export type Event = {
  id: string;
  defaultOrder: number;
  content: {
    contextTagId?: ContextTag["id"];
    name: string;
    description?: string;
    timeRange: {
      start: string;
      end?: string;
    };
  };
};

export type EventTemplate = {
  content: {
    contextTagId?: ContextTag["id"];
    name: string;
    description?: string;
    timeRange: {
      start: string;
      end?: string;
    };
  };
}