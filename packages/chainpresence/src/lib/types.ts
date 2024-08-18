/**
 * This type alias is to identify CSS classes within component props,
 * which enables Tailwind IntelliSense
 */
export type CssClasses = string;

export type SvelteEvent<E extends Event = Event, T extends EventTarget = Element> = E & {
	currentTarget: EventTarget & T;
};

export type * from './fetchfunction.js';
export type * from './chainconfig/alchemy.js';
export type * from './chainconfig/web3auth.js';
export type * from './chainconfig/chainconfig.js';
export type * from './chainconfig/infraconfig.js';
export type * from './chainconfig/chainaccessconfig.js';
export type * from './chainconfig/web3authsettings.js';
export type * from './chainconfig/web3authadapters/adapterconfig.js';
export type * from './chainconfig/web3authadapters/openlogin.js';
