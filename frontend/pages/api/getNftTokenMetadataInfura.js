import { config as loadEnv } from 'dotenv';
import { SDK, Auth, TEMPLATES, Metadata } from '@infura/sdk';

console.log(process.env.INFURA_API_KEY)
console.log(process.env.INFURA_API_KEY_SECRET)
// const auth = new Auth({
//       projectId: process.env.INFURA_API_KEY,
//       secretId: process.env.INFURA_API_KEY_SECRET,
//       privateKey: process.env.WALLET_PRIVATE_KEY,
//       chainId: 5,
//     });
// const sdk = new SDK(auth);

// const myNFTs = await sdk.api.getNFTs({
//     publicAddress: process.env.WALLET_PUBLIC_ADDRESS,
//     includeMetadata: true
//   });
// console.log('My NFTs: \n', myNFTs);

// const tokenMetadata = await sdk.api.getTokenMetadata({
//     contractAddress: "0x2a652119ebb794fb502d61bfdf6e4f5b005dabbc",
//     tokenId: 34
//   });
// console.log('Token Metadata: \n', tokenMetadata);


