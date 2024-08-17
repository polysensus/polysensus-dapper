# Web3Auth (`@web3auth/no-modal`) x Auth0 (Custom Authentication)

# gav demo notes

Following this guide https://web3auth.io/docs/guides/auth0

- the upstream git content is configured for sapphire_mainnet, this needs to be changed to dev
- when creating the verifier, use "email" to work with the upstream demo code. sub works, but the demo code needs to be changed.
- the auth0 user account is associated with the app it was registered on, but looks as though that is transferable
- if the verifier is deleted I believe the user wallets create with it are lost! web3authn support indicates this is recoverable with a support request.

## necessary changes to the upsream demo code

(grep for // XXX: )

1. set the global clientId to the web3auth app clientid
1. When constructing the Web3AuthNoModal instance set web3AuthNetwork to WEB3AUTH_NETWORK.SAPPHIRE_DEVNET in the
1. When constructing the OpenloginAddapter instance, in the addapterSettings for the openloginAdapter
   1. set the verifier to the web3auth verifier name
   1. set the clientId to the auth0 application clientId
1. When calling web3auth.connectTo
   1. set the domain to the domain from the auth0 app, explicitly adding the 'https://' prefix
   1. if the verifier was created wit a JWT Verifier ID of sub, change the verifierIdField to 'sub' (the default is 'email')

---

Web3Auth Content

[![Web3Auth](https://img.shields.io/badge/Web3Auth-SDK-blue)](https://web3auth.io/docs/sdk/pnp/web/no-modal)
[![Web3Auth](https://img.shields.io/badge/Web3Auth-Community-cyan)](https://community.web3auth.io)

[Join our Community Portal](https://community.web3auth.io/) to get support and stay up to date with the latest news and updates.

This example demonstrates how to use Web3Auth with Auth0 (Custom Authentication).

## How to Use

### One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fcustom-authentication%2Fsingle-verifier-examples%2Fauth0-no-modal-example&project-name=w3a-auth0-no-modal&repository-name=w3a-auth0-no-modal)

### Download Manually

```bash
npx degit Web3Auth/web3auth-pnp-examples/web-no-modal-sdk/custom-authentication/single-verifier-examples/auth0-no-modal-example w3a-example
```

Install & Run:

```bash
cd w3a-example
npm install
npm run start
# or
cd w3a-example
yarn
yarn start
```

## Important Links

- [Website](https://web3auth.io)
- [Docs](https://web3auth.io/docs)
- [Guides](https://web3auth.io/docs/guides)
- [SDK / API References](https://web3auth.io/docs/sdk)
- [Pricing](https://web3auth.io/pricing.html)
- [Community Portal](https://community.web3auth.io)
