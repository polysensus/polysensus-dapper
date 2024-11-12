
import { ParsedLog } from './parsedlog.js';
import { ResultLog } from './resultlog.js';

export class TransactResult<T> {

  receipt: T;
  events: Record<string, ResultLog[]>;
  ordered: ResultLog[];

  constructor(receipt: T) {
    this.receipt = receipt;
    this.ordered = [];
    this.events = {};
  }

  add(log: ParsedLog) {
    this._addkeyed(log, log.eventName);
    this._addkeyed(log, log.signature);
    this.ordered.push(log);
  }
  _addkeyed(log: ParsedLog, key: string) {
    if (!this.events[key]) {
      this.events[key] = [];
    }
    this.events[key].push(log);
  }

  *logs() {
    for (let log of this.ordered) {
      yield log;
    }
  }
}