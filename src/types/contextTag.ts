export type ContextTag = {
  id: string;
  name: string;
  parentId: ContextTag["id"] | null;
};
