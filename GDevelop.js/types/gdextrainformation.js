// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdExtraInformation {
  setFunctionName(functionName_: string): gdExtraInformation;
  setManipulatedType(type_: string): gdExtraInformation;
  setGetter(getter: string): gdExtraInformation;
  setMutators(mutators: gdMapStringString): gdExtraInformation;
  setIncludeFile(includeFile: string): gdExtraInformation;
  addIncludeFile(includeFile: string): gdExtraInformation;
  getIncludeFiles(): gdVectorString;
  delete(): void;
  ptr: number;
};