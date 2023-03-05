import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ganache";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";

import "hardhat-typechain";
import "solidity-coverage";
import "hardhat-deploy";
import "hardhat-tracer";
import "hardhat-log-remover";

import "hardhat-gas-reporter";
import dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/types";
const config = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    // ETH_MAINNET: {
    //   accounts: [`${process.env.PRIVATE_KEY}`],
    //   url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    // },
    // ETH_GOERLI: {
    //   accounts: [`${process.env.PRIVATE_KEY}`],
    //   url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    // },
    MUMBAI: {
      chainId: 80001,
      accounts: [`${process.env.PRIVATE_KEY}`],
      url: `${process.env.MUMBAI_RPC}`,
      tags: ["mumbai"],
      gasPrice: 3000000000,
    },
    scrollTestnet: {
      url: process.env.SCROLL_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    // for testnet
    baseTestnet: {
      url: 'https://goerli.base.org',
      accounts: [process.env.PRIVATE_KEY as string],
    }
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  mocha: {
    timeout: 20000000,
  },
  etherscan: {
    apiKey: `${process.env.POLYGONSCAN_API_KEY}`,
  },
  gasReporter: {
    gasPrice: 30,
    enabled: true,
    currency: "USD",
    coinmarketcap: "c40041ca-81fa-4564-8f95-175e388534c1",
    outputFile: "gasReport.md",
    noColors: true,
  },
};

export default config;
