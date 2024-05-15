require('dotenv').config();
const { ethers } = require('ethers');
const salesContract = require('../artifacts/contracts/Sales.sol/Sales.json');
const { format } = require('path');

// const PINATA_API_KEY = '7f5296a7d2ffde500f49';
// const PINATA_SECRET_KEY = 'f2eeaa9e5b5729f834b0169a2159193356ff773129022d5266eb9f51bd29ea73';
// const API_URL = 'https://eth-sepolia.g.alchemy.com/v2/L7q98I4uCHVTKCt8LPyyNfzaI3ZjR_h_';
// const PRIVATE_KEY = '575c6f028238d79b35b58d581f8499126c5985440efe2eadf31deff1c9ca8467';
// const PUBLIC_KEY = '0xEbfbE340b101475419F2dF19Ae09DD9a15F41234';
// const SALES_CONTRACT= '0x47E4b93D25D2B5820fAb30BfF3B0Fcfd0308E0cE';

const {API_URL,PRIVATE_KEY,PUBLIC_KEY,SALES_CONTRACT}=process.env;

async function createTransaction(provider, method, params) {
    const etherInterface = new ethers.utils.Interface(salesContract.abi);
    const nonce = await provider.getTransactionCount(PUBLIC_KEY, 'latest');
    const gasPrice = await provider.getGasPrice();
    const network = await provider.getNetwork();
    const { chainId } = network;
    const transaction = {
        from: PUBLIC_KEY,
        to: SALES_CONTRACT,
        nonce,
        chainId,
        gasPrice,
        data: etherInterface.encodeFunctionData(method, params)
    };
    return transaction;
}

async function createSale(employeeId, saleDate, soldProducts, prices) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const transaction = await createTransaction(provider, "insertSale", [employeeId, saleDate, soldProducts, prices]);
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

async function getSales() {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const salesContractInstance = new ethers.Contract(SALES_CONTRACT, salesContract.abi, provider);
    const result = await salesContractInstance.getSales();
    var sales = [];
    result.forEach(element => {
        sales.push(formatSale(element));
    });
    return sales;
}

async function getSale(saleId) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const salesContractInstance = new ethers.Contract(SALES_CONTRACT, salesContract.abi, provider);
    const result = await salesContractInstance.getSaleById(saleId);
    return formatSale(result);
}

async function getSalesByEmployeeId(employeeId) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const salesContractInstance = new ethers.Contract(SALES_CONTRACT, salesContract.abi, provider);
    const result = await salesContractInstance.getSalesByEmployeeId(employeeId);
    var sales = [];
    result.forEach((element) => {
        sales.push(formatSale(element));
    });
    return sales;
}

function formatSale(info) {
    let sale = {
        saleId: ethers.BigNumber.from(info[0]).toNumber(),
        employeeId: ethers.BigNumber.from(info[1]).toNumber(),
        saleDate: info[2],
    }
    let products = []
    info[3].forEach((element,index) => {
        let product = {name:element,price: ethers.BigNumber.from(info[4][index]).toNumber()}
        products.push(product)
    })
    sale.products = products
    return sale
}

module.exports = {
    getSale: getSale,
    getSales: getSales,
    createSale: createSale,
    getSalesByEmployeeId: getSalesByEmployeeId
};
