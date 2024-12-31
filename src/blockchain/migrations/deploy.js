const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Read the compiled contract JSON
const contractJSON = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../Artifacts/ArtworkRegistry.json"), "utf8")
);

const deploy = async () => {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545"); // Ganache RPC
    const wallet = new ethers.Wallet("0xf36e87d5f04e866342518501669ba1d6a89ff78f0703f5a7b84990f1a301a927", provider);

    // Create a contract factory
    const factory = new ethers.ContractFactory(contractJSON.abi, contractJSON.evm.bytecode.object, wallet);

    console.log("Deploying contract...");
    const contract = await factory.deploy();
    await contract.deployed();
    console.log(`Contract deployed at address: ${contract.address}`);
};

deploy().catch((error) => {
    console.error("Error deploying contract:", error);
});
