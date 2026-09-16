export type Event = {
  id: string;
  content: {
    name: string;
    description?: string;
    timeRange: {
      start: string;
      end?: string;
    };
  };
};
