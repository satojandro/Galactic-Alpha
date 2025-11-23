/**
 * Deployment script for GalacticSubnameRegistrar
 * 
 * Usage:
 *   npx hardhat run ./scripts/deploySubnameRegistrar.js --network sepolia
 *   npx hardhat run ./scripts/deploySubnameRegistrar.js --network mainnet
 */

const hre = require("hardhat");

// Contract addresses
const NAME_WRAPPER_ADDRESSES = {
  sepolia: "0x0635513f179D50A207757E05759CbD106d7dFcE8",
  mainnet: "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401",
};

// Parent domain
const PARENT_DOMAIN = "galacticalpha.eth";

/**
 * Compute namehash using ethers (since we're in Node.js context)
 */
function computeNamehash(name) {
  const ethers = hre.ethers;
  const parts = name.split(".");
  let node = ethers.ZeroHash; // 0x0000000000000000000000000000000000000000000000000000000000000000
  
  for (let i = parts.length - 1; i >= 0; i--) {
    const label = ethers.keccak256(ethers.toUtf8Bytes(parts[i]));
    node = ethers.keccak256(ethers.concat([node, label]));
  }
  
  return node;
}

async function main() {
  const network = hre.network.name;
  console.log(`\n🚀 Deploying GalacticSubnameRegistrar to ${network}...\n`);

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying from:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Get NameWrapper address for the network
  let nameWrapperAddress;
  if (network === "sepolia") {
    nameWrapperAddress = NAME_WRAPPER_ADDRESSES.sepolia;
  } else if (network === "mainnet" || network === "hardhat") {
    nameWrapperAddress = NAME_WRAPPER_ADDRESSES.mainnet;
  } else {
    console.error(`❌ Unsupported network: ${network}`);
    console.log("Supported networks: sepolia, mainnet");
    process.exit(1);
  }

  console.log("📦 NameWrapper address:", nameWrapperAddress);

  // Compute parent node hash
  const parentNode = computeNamehash(PARENT_DOMAIN);
  console.log("🌐 Parent domain:", PARENT_DOMAIN);
  console.log("🔑 Parent node hash:", parentNode);
  console.log("");

  // Deploy the contract
  const GalacticSubnameRegistrar = await hre.ethers.getContractFactory(
    "GalacticSubnameRegistrar"
  );

  console.log("⏳ Deploying contract...");
  const registrar = await GalacticSubnameRegistrar.deploy(
    nameWrapperAddress,
    parentNode
  );

  await registrar.waitForDeployment();
  const registrarAddress = await registrar.getAddress();

  console.log("\n✅ Contract deployed successfully!");
  console.log("📍 Contract address:", registrarAddress);
  console.log("👤 Admin address:", deployer.address);
  console.log("");

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const info = await registrar.getInfo();
  console.log("   NameWrapper:", info.wrapper);
  console.log("   Parent node:", info.parent);
  console.log("   Admin:", info.adminAddress);
  console.log("   Total minted:", info.mintedCount.toString());
  console.log("");

  // Next steps
  console.log("📋 Next steps:");
  console.log("1. Approve the contract as an operator:");
  console.log(`   - Go to app.ens.domains`);
  console.log(`   - Connect wallet that owns ${PARENT_DOMAIN}`);
  console.log(`   - Navigate to your domain → "More" → "Set Approval For All"`);
  console.log(`   - Enter: ${registrarAddress}`);
  console.log(`   - Approve the transaction`);
  console.log("");
  console.log("2. Or use the approveSubnameOperator function:");
  console.log(`   await approveSubnameOperator({`);
  console.log(`     operatorAddress: '${registrarAddress}',`);
  console.log(`     chainId: ${network === "sepolia" ? 11155111 : 1}`);
  console.log(`   })`);
  console.log("");
  console.log("3. Update your frontend config:");
  console.log(`   - Add ${registrarAddress} to lib/ens-contract-config.ts`);
  console.log("");

  // Save deployment info
  const deploymentInfo = {
    network,
    contractAddress: registrarAddress,
    deployer: deployer.address,
    nameWrapper: nameWrapperAddress,
    parentDomain: PARENT_DOMAIN,
    parentNode: parentNode,
    timestamp: new Date().toISOString(),
  };

  console.log("💾 Deployment info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Try to save to a file (optional)
  try {
    const fs = require("fs");
    const path = require("path");
    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    const filePath = path.join(deploymentsDir, `${network}-subname-registrar.json`);
    fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n📄 Saved deployment info to: ${filePath}`);
  } catch (err) {
    console.log("\n⚠️  Could not save deployment info to file:", err.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

