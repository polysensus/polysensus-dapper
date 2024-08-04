import log from 'loglevel';

const disabled: { [key: string]: boolean } = {
  TransactionHorizon: true,
  // , StateRoster: true
};

const enabled: { [key: string]: boolean } | undefined = undefined;

const levels: { [key: string]: log.LogLevelDesc } = {
  StateRoster: 'INFO',
};

export function getLogger(name: string): log.Logger {
  const defaultLevel: log.LogLevelDesc = 'INFO';

  const enable: boolean = typeof enabled === 'undefined' || !!enabled?.[name];
  const disable: boolean =
    typeof disabled !== 'undefined' && typeof disabled[name] !== 'undefined';
  const level: log.LogLevelDesc = levels?.[name] ?? defaultLevel;

  const _log: log.Logger = log.getLogger(Symbol.for(name).toString());
  if (!enable || disable) {
    _log.setLevel('ERROR');
    return _log;
  }
  _log.setLevel(level);
  return _log;
}
