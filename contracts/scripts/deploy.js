const hre = require("hardhat");

async function main() {
  // Example: USDC address (mainnet/mock)
  // For Zircuit testnet, you may need to use a mock token or deployed token address
  const asset = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; 
  
  // Get the deployer account (will be the initial owner)
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying GalacticVault...");
  console.log("👤 Deployer address:", deployer.address);
  console.log("📦 Asset token address:", asset);
  
  const Vault = await hre.ethers.getContractFactory("GalacticVault");
  const vault = await Vault.deploy(asset, deployer.address);
  
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  
  console.log("🌌 GalacticVault deployed to:", vaultAddress);
  console.log("✨ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

