// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdEventsList {
  constructor(): void;
  insertEvent(event: gdBaseEvent, pos: number): gdBaseEvent;
  insertNewEvent(project: gdProject, type: string, pos: number): gdBaseEvent;
  insertEvents(list: gdEventsList, begin: number, end: number, pos: number): void;
  getEventAt(pos: number): gdBaseEvent;
  removeEventAt(pos: number): void;
  removeEvent(event: gdBaseEvent): void;
  getEventsCount(): number;
  contains(event: gdBaseEvent, recursive: boolean): boolean;
  moveEventToAnotherEventsList(eventToMove: gdBaseEvent, newEventsList: gdEventsList, newPosition: number): boolean;
  isEmpty(): boolean;
  clear(): void;
  serializeTo(element: gdSerializerElement): void;
  unserializeFrom(project: gdProject, element: gdSerializerElement): void;
  delete(): void;
  ptr: number;
};