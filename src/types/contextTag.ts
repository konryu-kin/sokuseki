import type { TaskTemplate } from "./task";
import type { EventTemplate } from "./event";

export type ContextTag = {
  id: string;
  name: string;
  parentId: ContextTag["id"] | null;
  generatedItemOptions?: GeneratedItemOption[];
};
export type GeneratedItemOption = {
  optionName: string;
  rules: (
    | {
        itemType: "event";
        executionTiming: "auto" | "manual";
        ItemTemplate: EventTemplate;
      }
    | {
        itemType: "task";
        executionTiming: "auto" | "manual";
        ItemTemplate: TaskTemplate;
      }
  )[];
};
