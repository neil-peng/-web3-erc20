// imports
require("dotenv").config({ path: process.env.MY_LOCAL_FILE_PATH });
const { ethers, run, network } = require("hardhat");

// async main
async function main() {
  const MyTokenFactory = await ethers.getContractFactory("MyToken");
  console.log("Deploying contract...");
  const MyToken = await MyTokenFactory.deploy();
  await MyToken.waitForDeployment();

  console.log(`Deployed contract to: ${MyToken.target}`);

  //wait for etherscan got the contract
  await MyToken.deploymentTransaction().wait(10);
  await verify(MyToken.target, [process.env.COINMARKETCAP_API_KEY]);
  console.log(`Varify contract done to: ${MyToken.target}`);
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
};

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
