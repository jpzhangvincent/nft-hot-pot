import { ethers, run } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { NFTAIMixer, NFTAIMixer__factory } from "../typechain";

async function main() {
  let [admin]: SignerWithAddress[] = await ethers.getSigners();

  console.log("deploying...");
  let campBuidl: NFTAIMixer = await (
    await new NFTAIMixer__factory(admin).deploy()
  ).deployed();

  campBuidl.deployTransaction.wait(5);
  console.log("campBuidl Address", campBuidl.address);

  await run("verify:verify", {
    address: campBuidl.address,
    constructorArguments: [],
    contract: "contracts/CampBuidl.sol:CampBuidl",
  }).catch(console.log);
}

main();
