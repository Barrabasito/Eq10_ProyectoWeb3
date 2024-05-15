// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Branches is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _branchIds;

    struct Branch {
        string name;
        string branchAddress;
        // string street;
        // string outerNumber;
        // string innerNumber;
        // string city;
        // string state;
        // string country;
        // string postalCode;
        string phone;
        string email;
        string rfc;
        uint256 quantityEmployees;
        uint256 branchId;
    }

    mapping(uint256 => Branch) public branches;

    function insertBranch(
        string memory name,
        string memory branchAddress,
        // string memory street,
        // string memory outerNumber,
        // string memory innerNumber,
        // string memory city,
        // string memory state,
        // string memory country,
        // string memory postalCode,
        string memory phone,
        string memory email,
        string memory rfc
    ) public onlyOwner returns (uint256) {
        _branchIds.increment();
        uint256 newBranchId = _branchIds.current();
        Branch memory newBranch = Branch(
            name,
            branchAddress,
            // street,
            // outerNumber,
            // innerNumber,
            // city,
            // state,
            // country,
            // postalCode,
            phone,
            email,
            rfc,
            0,
            newBranchId
        );
        branches[newBranchId] = newBranch;
        return newBranchId;
    }

    function getBranches() public view returns (Branch[] memory) {
        Branch[] memory branchesArray = new Branch[](_branchIds.current());
        for (uint256 i = 0; i < _branchIds.current(); i++) {
            Branch storage branch = branches[i + 1];
            branchesArray[i] = branch;
        }
        return branchesArray;
    }

    function getBranchById(uint256 branchId)
        public
        view
        returns (Branch memory)
    {
        return branches[branchId];
    }

    function registerEmployee(uint256 branchId)
        public
        onlyOwner
    {
        branches[branchId].quantityEmployees += 1;
    }
}
