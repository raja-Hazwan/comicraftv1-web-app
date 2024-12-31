const path = require("path");
const fs = require("fs");
const solc = require("solc"); // Ensure this line is correct

const contractPath = path.resolve(__dirname, "../contracts", "ArtworkRegistry.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
    language: "Solidity",
    sources: {
        "ArtworkRegistry.sol": { content: source },
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["abi", "evm.bytecode"],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const artifactsPath = path.resolve(__dirname, "../artifacts", "ArtworkRegistry.json");

fs.writeFileSync(artifactsPath, JSON.stringify(output.contracts["ArtworkRegistry.sol"].ArtworkRegistry));
console.log("Contract compiled and ABI saved to:", artifactsPath);
