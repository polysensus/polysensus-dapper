import { ParsedLog } from "./parsedlog.js";
export type RequestorOptions<T> = {
  customErr?: (err: Error) => Error,
  logParser: <T>(receipt: T) => ParsedLog[],
  methodCaller: <T>(method: string, ...args:any) => Promise<T>
};