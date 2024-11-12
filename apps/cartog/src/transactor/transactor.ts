import { RequestorOptions } from "./options.js";
import { TransactRequest } from "./request.js";

export class Transactor<T> {

  options: RequestorOptions<T>
  sequence: TransactRequest<T>[] = [];

  constructor(options: RequestorOptions<T>) {
    this.options = options;
  }

  _head() {
    return this.sequence[this.sequence.length - 1];
  }

  method(method: string, ...args: any) {
    const request = new TransactRequest<T>(this.options);
    this.sequence.push(request.method(method, ...args));
    return this;
  }

  acceptLogs(...signatures: string[]) {
    this._head().acceptLogs(...signatures);
    return this;
  }

  requireLogs(...signatures: string[]) {
    this._head().requireLogs(...signatures);
    return this; // chainable
  }

  requireLogNames(...names: string[]) {
    this._head().requireLogNames(...names);
    return this; // chainable
  }

  excludeLogs(...signatures: string[]) {
    this._head().excludeLogs(...signatures);
    return this; // chainable
  }

  async *transact() {
    for (const request of this.sequence) {
      yield request.transact();
    }
  }
}