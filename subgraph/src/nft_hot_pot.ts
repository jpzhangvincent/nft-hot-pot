import { BigInt } from "@graphprotocol/graph-ts";
import { Transfer, ERC721 as NFTContract } from "../generated/NFTAIMIX/ERC721";
import { NFTInfo } from "../generated/schema";

export function handleMintEvent(event: Transfer): void {
  let tokenId = event.params.tokenId.toHexString();
  let contractAddr = event.address;
  let toAddr = event.params.to;

  let nftInfo = new NFTInfo(contractAddr.toHexString() + "#" + tokenId);
  if (!nftInfo) {
    nftInfo = new NFTInfo(tokenId);
  }

  let nftContract = NFTContract.bind(contractAddr);

  nftInfo.owner = toAddr.toHexString();
  nftInfo.tokenId = tokenId;
  let uriResult = nftContract.try_tokenURI(event.params.tokenId);
  if (!uriResult.reverted) {
    nftInfo.tokenUri = uriResult.value;
  }
  nftInfo.save();
}
