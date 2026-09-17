export type ContextTag = {
  id: string;
  name: string;
  parentId: ContextTag["id"] | null;
  generateEventRule?: {
    eventTemplate: Event
    options:{
      // ミリ秒で指定
      scheduledDateOffset?:number
      dueDateOffset?:number
    }
  }
};
