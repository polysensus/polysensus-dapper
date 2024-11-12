// ParsedLog defines the narrowest interface for a *parsed* log event required by the transactor
// and which must be returned by the logParser function
export type ParsedLog = {
  eventName:string;
  signature:string;
}