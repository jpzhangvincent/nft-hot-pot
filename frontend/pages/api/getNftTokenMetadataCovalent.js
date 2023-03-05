import axios from 'axios';
import { config as loadEnv } from 'dotenv';

const COVALENT_API_KET = process.env.NEXT_COVALENT_API_KEY

export default async function handler(req, res) {
  console.log("Here is the request")
  console.log("API Key ", process.env.NEXT_COVALENT_API_KEY)
  const { contractaddress, tokenid, chain } = JSON.parse(
    req.body
  );
  
  console.log("Chain: ", chain)
  let covalentnetwork = "";
  switch(chain){
    case "ETH_MAINNET":
      covalentnetwork = "eth-mainnet";
      break; 
    case "MATIC_MAINNET":
      covalentnetwork = 'matic-mainnet';
      break;
    case "ETH_GOERLI":
      covalentnetwork = 'eth-goerli'
      break;
    case "MATIC_MUMBAI":
      covalentnetwork ='matic-mumbai';
      break; 
  }

  'https://api.covalenthq.com/v1/eth-mainnet/nft/0x05c0a4ad31ccbdcbc61c53f09f4cc428066fd80a/metadata/44/?key=ckey_258582ab5e11435d8a0a4bcf714'
  console.log('Covalent API KEY: ', COVALENT_API_KET)
  console.log('Covalent network: ', covalentnetwork)
  try {
    // Make a Covalent API call using Axios
    const nftMetadata = await axios.get(`https://api.covalenthq.com/v1/${covalentnetwork}/nft/${contractaddress}/metadata/${tokenid}/?key=${COVALENT_API_KET}`);
    // Return the response data as JSON
    // console.log(response.data)
    res.status(200).json({
        name: nftMetadata.items[0].nft_data.external_data.name,
        tags: nftMetadata.items[0].nft_data.external_data.attributes,
        description: nftMetadata.items[0].nft_data.external_data.description,
        id: nftMetadata.items[0].nft_data.external_data.token_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}