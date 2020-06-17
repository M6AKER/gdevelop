// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdExternalLayout {
  constructor(): void;
  setName(name: string): void;
  getName(): string;
  setAssociatedLayout(name: string): void;
  getAssociatedLayout(): string;
  getInitialInstances(): gdInitialInstancesContainer;
  getAssociatedSettings(): gdLayoutEditorCanvasOptions;
  serializeTo(element: gdSerializerElement): void;
  unserializeFrom(element: gdSerializerElement): void;
  delete(): void;
  ptr: number;
};