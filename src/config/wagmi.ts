import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { monadTestnet } from './contracts';

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}