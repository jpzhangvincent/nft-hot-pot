import { ethers, run } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { NFTAIMixer, NFTAIMixer__factory } from "../typechain";

async function main() {
  let [admin]: SignerWithAddress[] = await ethers.getSigners();

  console.log("deploying...");
  let nftaimixer: NFTAIMixer = await (
    await new NFTAIMixer__factory(admin).deploy()
  ).deployed();

  nftaimixer.deployTransaction.wait(5);
  console.log("NFTAIMixer Contract Address", nftaimixer.address);

  await run("verify:verify", {
    address: nftaimixer.address,
    constructorArguments: [],
    contract: "contracts/NFTAIMixer.sol:NFTAIMixer",
  }).catch(console.log);
}

main();
