// See https://hardhat.org/hardhat-runner/docs/config
// Hardhat's config file will always run before any task,
// so you can use it to integrate with other tools, like importing @babel/register.
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { resolve } from "path";
// import type { NetworkUserConfig } from 'hardhat/types';

//Import our customised tasks
import "./fevm/hardhat/tasks";

if (!process.env.WALLET_PRIVATE_KEY) {
  dotenvConfig({ path: resolve(__dirname, ".env"), override: true });
}

// Ensure that we have all the environment variables we need.
const walletPrivateKey: string | undefined = process.env.WALLET_PRIVATE_KEY;
// if (!walletPrivateKey) {
//   throw new Error("Please set your Wallet private key in a .env file");
// }

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  mocha:{ timeout: 600000 },
  defaultNetwork: "filecoinHyperspace",
  networks: {
    hardhat: {},
    filecoinMainnet: {
      url: "https://api.node.glif.io",
      chainId: 314,
      accounts: walletPrivateKey ?[walletPrivateKey]: [process.env.TEST_ACCOUNT1 ?? "undefined"],
    },
    filecoinWallaby: {
      url: "https://wallaby.node.glif.io/rpc/v0",
      chainId: 31415,
      accounts: walletPrivateKey ?[walletPrivateKey]: [process.env.TEST_ACCOUNT1 ?? "undefined"],
      //explorer: https://wallaby.filscan.io/ and starboard
    },
    filecoinHyperspace: {
      url: "https://api.hyperspace.node.glif.io/rpc/v1", //https://beryx.zondax.ch/ //chainstack
      chainId: 3141,
      accounts: walletPrivateKey ?[walletPrivateKey]: [process.env.TEST_ACCOUNT1 ?? "undefined", process.env.TEST_ACCOUNT2 ?? "undefined"],
      gasMultiplier:3    
    },
    ethGoerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/S4Rrp2eHb-xk5dxnNQygNcv-QfPmzTXX",
      chainId: 5,
      accounts: walletPrivateKey ?[walletPrivateKey]: [process.env.TEST_ACCOUNT1 ?? "undefined"],
    },
  },
  paths: {
    root: "./fevm/hardhat",
    tests: "./fevm/hardhat/tests", //who names a directory in the singular?!!!
    cache: "./fevm/hardhat/cache",
  },
};

export default config;

/*
Networks
    params: {
      url: 'https://wallaby.node.glif.io/rpc/v0',
      chainId: 31415,
      from: '',
      gas: 30000,
      gasPrice: 0,
      gasMultiplier: 1,
      // accounts: [
      //   // WALLET_PRIVATE_KEY,
      //   'acc89e46ec147b3b34c0fd94b1cbce080d04b810385c6f2187e3407060ef7f24',
      // ],
      // for HD wallets
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
        passphrase: '',
      },
      httpHeaders: {
        /*use this field to set extra HTTP Headers to be used when
        making JSON-RPC requests. It accepts a JavaScript object which
        maps header names to their values. Default value: undefined */
//       },
//       timeout: 10000,
//     },
// */
