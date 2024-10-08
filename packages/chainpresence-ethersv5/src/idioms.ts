import { ethers } from 'ethers';

/**
 * isUndefined performs ths safe and idiomatic check for an object or scalar being undefined
 * @param {object} value any object or scalar
 * @returns {boolean}
 */
export function isUndefined(value: any) {
  return typeof value === 'undefined';
}

export const alwaysNumber = (n: string | number): number =>
  ethers.utils.isHexString(n) ? parseInt(n as string, 16) : (n as number);

interface SeparatorOptions {
  sep?: string;
  targetSep?: string;
}

export function toUpperCaseWords(
  s: string,
  { sep, targetSep }: SeparatorOptions,
): string {
  if (!sep) sep = '-';
  if (!targetSep) targetSep = '_';
  return s
    .split(sep)
    .map((word) => word.toUpperCase())
    .join(targetSep);
}

/** isAsync checks if the value is an async function */
export function isAsync(value: any) {
  return value?.constructor?.name === 'AsyncFunction';
}

/** isPromise checks if the value is a promise */
export function isPromise(value: any) {
  if (typeof value === 'object' && typeof value.then === 'function') {
    return true;
  }
  return false;
}

/**
 * return true if the value is a callable that can be an 'await' subject
 * @param {*} value
 * @returns
 */
export function awaitable(value: any) {
  return isAsync(value) || isPromise(value);
}

export function isFunction(value: any) {
  return value?.constructor?.name === 'Function';
}

/**
 * A variant of instanceof that also considers if o.constructor.name ===
 * class_.name Works where objects are passed across package boundaries, where
 * bundling causes the instanceof check to fail
 *
 * @param {*} o is any object
 * @param {*} class_ should be a class, but can be anything with a defined name property
 */
export function constructedLikeClass(o: any, class_: any) {
  return (
    o instanceof class_ || (class_.name && o.constructor.name == class_.name)
  );
}

export function etherrmsg(err: any) {
  if (!err.body) return `${err}`;
  try {
    const jerr = JSON.parse(err.body);
    return jerr.error?.message ?? `${err}`;
  } catch (err2) {
    return `${err}`;
  }
}
