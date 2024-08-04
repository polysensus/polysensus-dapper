import { toUpperCaseWords } from '$lib/idioms.js';
import { requireSecret } from '$lib/server/request.js';

export function requireZeroDevApiKey(chainCfg) {
  if (!chainCfg.zeroDevProjectId)
    throw error(404, {message: `chain configuration does not support session keys`});

  const prefix = toUpperCaseWords(chainCfg.name);
  return requireSecret(`${prefix}_ZERODEV_API_KEY`);
}
