// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdJsPlatform extends gdPlatform {
  static get(): gdJsPlatform;
  addNewExtension(extension: gdPlatformExtension): void;
  getName(): string;
  getFullName(): string;
  getSubtitle(): string;
  getDescription(): string;
  isExtensionLoaded(name: string): boolean;
  removeExtension(name: string): void;
  reloadBuiltinExtensions(): void;
  getBehavior(type: string): gdBehavior;
  getBehaviorSharedDatas(type: string): gdBehaviorsSharedData;
  getAllPlatformExtensions(): gdVectorPlatformExtension;
  delete(): void;
  ptr: number;
};