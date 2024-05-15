// async function main() {
//     const Branches = await ethers.getContractFactory('Branches');
//     const branches = await Branches.deploy();
//     const txHash = branches.deployTransaction.hash;
//     const txReceipt = await ethers.provider.waitForTransaction(txHash);
//     console.log("Branches contract deployed to Address:", txReceipt.contractAddress);
// }

// main().then(() => { process.exit(0) }).catch((error) => {
//     console.log(error);
//     process.exit(1);
// })

// async function main() {
//     const Employees = await ethers.getContractFactory('Employees');
//     const employees = await Employees.deploy();
//     const txHash = employees.deployTransaction.hash;
//     const txReceipt = await ethers.provider.waitForTransaction(txHash);
//     console.log("Employees contract deployed to Address:", txReceipt.contractAddress);
// }

// main().then(()=>{process.exit(0)}).catch((error)=>{
//     console.log(error);
//     process.exit(1);
// })

async function main(){
    const Sales = await ethers.getContractFactory('Sales') //NFT2024
    const sales = await Sales.deploy()
    const txHash = sales.deployTransaction.hash;
    const txReceipt = await ethers.provider.waitForTransaction(txHash);
    console.log("Contract deployed to Address",txReceipt.contractAddress);
}

main().then(()=>{process.exit(0)}).catch((error)=>{
    console.log(error),process.exit(1)
})