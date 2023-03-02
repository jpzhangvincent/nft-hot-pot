import { Network, Alchemy, NftFilters } from "alchemy-sdk";

export default async function handler(
req,res
) {
  const { address, pageKey, pageSize, chain } = JSON.parse(req.body);
  console.log(address);
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  console.log(chain);
  const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network[chain],
  };
  const alchemy = new Alchemy(settings);

  try {
    const contractMetadata = await alchemy.nft.getContractMetadata(address);
    if (contractMetadata && contractMetadata.openSea) {
      res.status(200).json({
        name: contractMetadata.openSea.collectionName,
        symbol: contractMetadata.symbol,
        floorPrice: contractMetadata.openSea.floorPrice,
        descritpion: contractMetadata.openSea.description,
        twitter_username: contractMetadata.openSea.twitterUsername,
        discord_url: contractMetadata.openSea.discordUrl,
        imageUrl: contractMetadata.openSea.imageUrl,
        totalSupply: contractMetadata.totalSupply,
        verified: contractMetadata.openSea.safelistRequestStatus,
        deployer: contractMetadata.contractDeployer,
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