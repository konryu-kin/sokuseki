export type Event = {
  id: string;
  defaultOrder: number;
  content: {
    name: string;
    description?: string;
    timeRange: {
      start: string;
      end?: string;
    };
  };
};
