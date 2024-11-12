import { TransactResult } from "./result.js";
import { RequestorOptions } from "./options.js";
import { ParsedLog } from "./parsedlog.js";

type TransactExpectations = {
  requiredNames: Record<string, boolean>;
  required: Record<string, boolean>;
  anticipated: Record<string, boolean>;
  excluded: Record<string, boolean>;
};

/**
 * TransactRequest is a class that is used to collect the results of a transaction.
 * And ensuring that the expected logs are emitted by that transaction
 */
export class TransactRequest<T> {

  customErr?: (err: Error) => Error

  methodCaller: <T>(method: string, ...args:any) => Promise<T>

  logParser: <T>(receipt: T) => ParsedLog[]

  args: any[]
  methodName: string
  anticipated: string[]
  required: string[]
  requiredNames: string[]
  excluded: string[]

  constructor({
    customErr, logParser, methodCaller}: RequestorOptions<T>) {

    this.customErr = customErr;
    this.logParser = logParser;
    this.methodCaller = methodCaller;

    this.methodName = "";
    this.args = [];
    this.anticipated = [];
    this.required = [];
    this.requiredNames = [];
    this.excluded = [];
  }

  method(method: string, ...args:any) {
    this.methodName = method;
    this.args = args;

    return this; // for chaining
  }

  acceptLogs(...signatures: string[]) {
    this.anticipated.push(...signatures);
    return this; // chainable
  }

  requireLogs(...signatures: string[]) {
    this.required.push(...signatures);
    return this; // chainable
  }

  requireLogNames(...names: string[]) {
    this.requiredNames.push(...names);
    return this; // chainable
  }

  excludeLogs(...signatures: string[]) {
    this.excluded.push(...signatures);
    return this; // chainable
  }

  expectations(): TransactExpectations {
    const requiredNames = Object.fromEntries(
      this.requiredNames.map((k) => [k, true])
    );
    const required = Object.fromEntries(
      this.required.map((k) => [k, true])
    );
    const anticipated = Object.fromEntries(
      this.anticipated.map((v) => [v, true])
    );
    for (const k of this.required) anticipated[k] = true;
    const excluded = Object.fromEntries(
      this.excluded.map((k) => [k, true])
    );
    return {
      requiredNames,
      required,
      anticipated,
      excluded,
    };
  }

  collect<T>(receipt: T): TransactResult<T> {
    const { requiredNames, required, anticipated, excluded } =
      this.expectations();

    const r: TransactResult<T> = new TransactResult<T>(receipt);

    for (const log of this.logParser(receipt)) {
      const sig = log.signature;
      const name = log.eventName;

      // note: the deletes are safe as expectations(), above, returns a copy

      // Note: we check r.events so we can collect > 1 requiredName
      if (!(sig in anticipated || name in anticipated || name in requiredNames || name in r.events))
        throw new Error(`unexpected log signature ${sig}`);

      if (sig in excluded || name in excluded)
        throw new Error(`excluded log name ${name} or signature ${sig}`);

      delete required[sig];

      if (name in requiredNames)
        delete requiredNames[name];

      r.add(log);
    }

    return r;
  }

  /**
   * Executes a transaction by calling a specified method with provided arguments.
   * If the method call fails, it throws a custom error if defined, otherwise rethrows the original error.
   * 
   * @template T - The type of the receipt expected from the method call.
   * @returns {Promise<TransactResult>} - A promise that resolves to a TransactResult.
   * @throws {Error} - Throws a custom error if defined, otherwise rethrows the original error.
   */
  async transact<T>(): Promise<TransactResult<T>> {
    let receipt: T;
    try {
      receipt = await this.methodCaller(this.methodName, ...this.args);
    } catch (err) {
      if (this.customErr !== undefined)
        throw this.customErr(err as Error)
      throw err
    }
    return this.collect<T>(receipt); 
  }
}