// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdExternalEvents {
  constructor(): void;
  setName(name: string): void;
  getName(): string;
  getAssociatedLayout(): string;
  setAssociatedLayout(name: string): void;
  getEvents(): gdEventsList;
  serializeTo(element: gdSerializerElement): void;
  unserializeFrom(project: gdProject, element: gdSerializerElement): void;
  delete(): void;
  ptr: number;
};