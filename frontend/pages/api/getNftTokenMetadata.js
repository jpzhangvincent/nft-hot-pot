import { Network, Alchemy, NftFilters } from "alchemy-sdk";

export default async function handler(
req,res
) {
  const { contractaddress, tokenid, chain } = JSON.parse(req.body);
  
  console.log(contractaddress);
  console.log(tokenid);

  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }


  console.log("TokeMetadata chain:", chain);
  const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network[chain],
  };
  const alchemy = new Alchemy(settings);

  try {
    const nftMetadata = await alchemy.nft.getNftMetadata(contractaddress, tokenid);
    if (nftMetadata && nftMetadata.openSea) {
      res.status(200).json({
        name: nftMetadata.metadata.name,
        tags: nftMetadata.metadata.attributes,
        description: nftMetadata.metadata.description,
        id: nftMetadata.metadata.id,
      });
    } else {
      res.status(400).json({
        message: "Contract not found",
      });
    }
  } catch (e) {
    console.warn(e);
    res.status(500).send({
      message: "something went wrong, check the log in your terminal",
    });
  }
}