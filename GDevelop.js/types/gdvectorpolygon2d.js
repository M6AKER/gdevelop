// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdVectorPolygon2d {
  constructor(): void;
  push_back(polygon: gdPolygon2d): void;
  size(): number;
  at(index: number): gdPolygon2d;
  set(index: number, polygon: gdPolygon2d): void;
  removeFromVectorPolygon2d(index: number): void;
  clear(): void;
  delete(): void;
  ptr: number;
};