import type { ContextTag } from "./contextTag";

export type Event = {
  id: string;
  defaultOrder: number;
  content: {
    contextTag: ContextTag;
    name: string;
    description?: string;
    timeRange: {
      start: string;
      end?: string;
    };
  };
};
