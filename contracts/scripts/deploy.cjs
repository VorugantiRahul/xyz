const hre = require("hardhat");

async function main() {
  console.log("==================================================");
  console.log("SkillPulse Monad Testnet Deployment");
  console.log("Network:", hre.network.name);
  console.log("==================================================");

  const [deployer] = await hre.ethers.getSigners();
  if (deployer) {
    console.log("Deployer Address:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Deployer Balance:", hre.ethers.formatEther(balance), "MON");
  }

  const SkillPulse = await hre.ethers.getContractFactory("SkillPulse");
  const skillPulse = await SkillPulse.deploy();
  await skillPulse.waitForDeployment();

  const contractAddress = await skillPulse.getAddress();
  const deploymentTx = skillPulse.deploymentTransaction();

  console.log("==================================================");
  console.log("DEPLOYMENT SUCCESSFUL");
  console.log("Contract Address:", contractAddress);
  console.log("Deployment Tx:", deploymentTx ? deploymentTx.hash : "N/A");
  console.log("Monad Testnet Chain ID: 10143");
  console.log("Explorer URL:", `https://testnet.monadexplorer.com/address/${contractAddress}`);
  console.log("==================================================");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});