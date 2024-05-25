require('dotenv').config();
const { ethers } = require('ethers');
const employeeContract = require('../artifacts/contracts/Employees.sol/Employees.json');

const {API_URL,PRIVATE_KEY,PUBLIC_KEY,EMPLOYEE_CONTRACT}=process.env;

async function createTransaction(provider, method, params) {
    const etherInterface = new ethers.utils.Interface(employeeContract.abi);
    const nonce = await provider.getTransactionCount(PUBLIC_KEY, 'latest');
    const gasPrice = await provider.getGasPrice();
    const network = await provider.getNetwork();
    const { chainId } = network;
    const transaction = {
        from: PUBLIC_KEY,
        to: EMPLOYEE_CONTRACT,
        nonce,
        chainId,
        gasPrice,
        data: etherInterface.encodeFunctionData(method, params)
    };
    return transaction;
}

async function createEmployee(names, surnames, birthdate, rfc, employeeAddress, email, workArea, salary, branchId) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const transaction = await createTransaction(provider, "insertEmployee", [names, surnames, birthdate, rfc, employeeAddress, email, workArea, salary, branchId]);
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

async function getEmployees() {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const employeeContractInstance = new ethers.Contract(EMPLOYEE_CONTRACT, employeeContract.abi, provider);
    const result = await employeeContractInstance.getEmployees();
    var employees = [];
    result.forEach(element => {
        employees.push(formatEmployee(element));
    });
    return employees;
}

async function getEmployee(employeeId) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const employeeContractInstance = new ethers.Contract(EMPLOYEE_CONTRACT, employeeContract.abi, provider);
    const result = await employeeContractInstance.getEmployeeById(employeeId);
    return formatEmployee(result);
}

async function updateAmount(employeeId, amount) {
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const transaction = await createTransaction(provider, "registerSale", [employeeId, amount]);
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

function formatEmployee(info) {
    return {
        names: info[0],
        surnames: info[1],
        birthdate: info[2],
        rfc: info[3],
        employeeAddress: info[4],
        // languages: info[5],
        email: info[5],
        workArea: info[6],
        salary: ethers.BigNumber.from(info[7]).toNumber(),
        amountSalesInMoney: ethers.BigNumber.from(info[8]).toNumber(),
        employeeId: ethers.BigNumber.from(info[9]).toNumber(),
        branchId: ethers.BigNumber.from(info[10]).toNumber()
    };
}

module.exports = {
    getEmployee: getEmployee,
    getEmployees: getEmployees,
    createEmployee: createEmployee,
    updateAmount: updateAmount
};
