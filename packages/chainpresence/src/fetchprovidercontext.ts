import { apiPath as defaultAPIPath } from './api';

import { ProviderContext } from './providercontext';

export class FetchProviderContext extends ProviderContext {
  async prepareProvider(): Promise<void> {
    if (!this.cfg.fetch) {
      return super.prepareProvider();
    }

    const apiPath = this.cfg.apiPath ?? defaultAPIPath;

    try {
      const resp = await fetch(`${apiPath}${this.cfg.name}`);
      const remoteCfg = await resp.json();
      if (remoteCfg?.error) {
        const error = JSON.stringify(remoteCfg.error);
        throw new Error(error);
      }
      this.cfg = { ...this.cfg, ...remoteCfg };
    } catch (err) {
      throw new Error(`Error fetching remote configuration: ${err}`);
    }
  }
}
