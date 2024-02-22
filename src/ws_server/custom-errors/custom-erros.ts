export class JsonTransformError extends Error {
  constructor() {
    super('Invalid JSON format');
  }
}
