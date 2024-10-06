/** Checks if obj has property. Optional predicate to check value of property */
export const hasProperty = (
  obj: unknown,
  property: string,
  pred: (value: unknown) => boolean = () => true
) =>
  Object.prototype.hasOwnProperty.call(obj, property) &&
  pred((obj as { [key: string]: unknown })[property]);