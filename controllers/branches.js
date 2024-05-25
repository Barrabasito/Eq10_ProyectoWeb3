require('dotenv').config();
const { ethers } = require('ethers');
const branchContract = require('../artifacts/contracts/Branches.sol/Branches.json');


const {API_URL,PRIVATE_KEY,PUBLIC_KEY,BRANCH_CONTRACT}=process.env;

async function createTransaction(provider, method, params) {
    const branchInterface = new ethers.utils.Interface(branchContract.abi);
    const nonce = await provider.getTransactionCount(PUBLIC_KEY, 'latest');
    const gasPrice = await provider.getGasPrice();
    const network = await provider.getNetwork();
    const { chainId } = network;
    const transaction = {
        from: PUBLIC_KEY,
        to: BRANCH_CONTRACT,
        nonce,
        chainId,
        gasPrice,
        data: branchInterface.encodeFunctionData(method, params)
    };
    return transaction;
}

async function createBranch(name, branchAddress,phone, email, rfc){//street, outerNumber, innerNumber, city, state, country, postalCode, phone, email, rfc) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const transaction = await createTransaction(provider, "insertBranch", [name, branchAddress,phone, email, rfc]);
    const estimateGas = await provider.estimateGas(transaction);
    transaction["gasLimit"] = estimateGas;
    const signedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(signedTx);
    await transactionReceipt.wait();
    const hash = transactionReceipt.hash;
    console.log("Transaction Hash", hash);
    const receipt = await provider.getTransactionReceipt(hash);
    return receipt;
}

async function getBranches() {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const branchContractInstance = new ethers.Contract(BRANCH_CONTRACT, branchContract.abi, provider);
    const result = await branchContractInstance.getBranches();
    var branches = [];
    result.forEach(element => {
        branches.push(formatBranch(element));
    });
    return branches;
}

async function getBranch(branchId) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const branchContractInstance = new ethers.Contract(BRANCH_CONTRACT, branchContract.abi, provider);
    const result = await branchContractInstance.getBranchById(branchId);
    return formatBranch(result);
}

async function updateQuantityEmployees(branchId) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const transaction = await createTransaction(provider, "registerEmployee",[branchId]);
    const estimateGas = await provider.estimateGas(transaction);
    transaction["gasLimit"] = estimateGas;
    const signedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(signedTx);
    await transactionReceipt.wait();
    const hash = transactionReceipt.hash;
    console.log("Transaction Hash", hash);
    const receipt = await provider.getTransactionReceipt(hash);
    return receipt;
}

function formatBranch(info) {
    return {
        name: info[0],
        branchAddress: info[1],
        phone: info[2],
        email: info[3],
        rfc: info[4],
        quantityEmployees: ethers.BigNumber.from(info[5]).toNumber(),
        branchId: ethers.BigNumber.from(info[6]).toNumber()
        // street: info[1],
        // outerNumber: info[2],
        // innerNumber: info[3],
        // city: info[4],
        // state: info[5],
        // country: info[6],
        // postalCode: info[7],
        // phone: info[8],
        // email: info[9],
        // rfc: info[10],
        // quantityEmployees: ethers.BigNumber.from(info[11]).toNumber(),
        // branchId: ethers.BigNumber.from(info[12]).toNumber()
    };
}

module.exports = {
    getBranch: getBranch,
    getBranches: getBranches,
    createBranch: createBranch,
    updateQuantityEmployees: updateQuantityEmployees
};
