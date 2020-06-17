// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdLayer {
  constructor(): void;
  setName(name: string): void;
  getName(): string;
  setVisibility(visible: boolean): void;
  getVisibility(): boolean;
  hasEffectNamed(name: string): boolean;
  getEffect(name: string): gdEffect;
  getEffectAt(index: number): gdEffect;
  getEffectPosition(name: string): number;
  getEffectsCount(): number;
  insertNewEffect(name: string, position: number): gdEffect;
  insertEffect(theEffect: gdEffect, position: number): void;
  removeEffect(name: string): void;
  swapEffects(firstEffectIndex: number, secondEffectIndex: number): void;
  delete(): void;
  ptr: number;
};