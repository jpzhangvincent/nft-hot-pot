import { ethers, run } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { mumbai } from "./config.json";
async function main() {
  let [admin]: SignerWithAddress[] = await ethers.getSigners();

  await run("verify:verify", {
    address: mumbai.NFTAIMixer,
    constructorArguments: [],
    contract: "contracts/NFTAIMixer.sol:NFTAIMixer",
  }).catch(console.log);
  return "Done";
}

main().then(console.log).catch(console.log);
