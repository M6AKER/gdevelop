// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdObjectGroupsContainer {
  constructor(): void;
  has(name: string): boolean;
  insert(objectGroup: gdObjectGroup, position: number): gdObjectGroup;
  insertNew(name: string, position: number): gdObjectGroup;
  count(): number;
  get(name: string): gdObjectGroup;
  getAt(index: number): gdObjectGroup;
  clear(): void;
  remove(name: string): void;
  getPosition(name: string): number;
  rename(oldName: string, newName: string): boolean;
  move(oldIndex: number, newIndex: number): void;
  serializeTo(element: gdSerializerElement): void;
  unserializeFrom(element: gdSerializerElement): void;
  delete(): void;
  ptr: number;
};