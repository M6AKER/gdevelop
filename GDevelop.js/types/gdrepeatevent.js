// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdRepeatEvent {
  constructor(): void;
  getConditions(): gdInstructionsList;
  getActions(): gdInstructionsList;
  setRepeatExpression(expr: string): void;
  getRepeatExpression(): string;
  clone(): gdRepeatEvent;
  getType(): string;
  setType(type: string): void;
  isExecutable(): boolean;
  canHaveSubEvents(): boolean;
  hasSubEvents(): boolean;
  getSubEvents(): gdEventsList;
  isDisabled(): boolean;
  setDisabled(disable: boolean): void;
  isFolded(): boolean;
  setFolded(folded: boolean): void;
  serializeTo(element: gdSerializerElement): void;
  unserializeFrom(project: gdProject, element: gdSerializerElement): void;
  delete(): void;
  ptr: number;
};