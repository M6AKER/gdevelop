// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdResourcesManager {
  constructor(): void;
  getAllResourceNames(): gdVectorString;
  hasResource(name: string): boolean;
  getResource(name: string): gdResource;
  addResource(res: gdResource): boolean;
  removeResource(name: string): void;
  renameResource(oldName: string, name: string): void;
  getResourcePosition(name: string): number;
  moveResourceUpInList(oldName: string): boolean;
  moveResourceDownInList(oldName: string): boolean;
  moveResource(oldIndex: number, newIndex: number): void;
  delete(): void;
  ptr: number;
};