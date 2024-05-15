// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >= 0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Employees is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _employeeIds;

    struct Employee {
        string names;
        string surnames;
        string birthdate;
        string rfc;
        string employeeAddress;
        // string languages;
        string email;
        string workArea;
        uint256 salary;
        uint256 amountSalesInMoney;
        uint256 employeeId;
        uint256 branchId;
    }

    mapping(uint256 => Employee) public employees;

    function insertEmployee(
        string memory names,
        string memory surnames,
        string memory birthdate,
        string memory rfc,
        string memory employeeAddress,
        // string memory languages,
        string memory email,
        string memory workArea,
        uint256 salary,
        uint256 branchId
    ) public onlyOwner returns (uint256) {
        _employeeIds.increment();
        uint256 newEmployeeId = _employeeIds.current();
        Employee memory newEmployee = Employee(
            names,
            surnames,
            birthdate,
            rfc,
            employeeAddress,
            // languages,
            email,
            workArea,
            salary,
            0,
            newEmployeeId,
            branchId
        );
        employees[newEmployeeId] = newEmployee;
        return newEmployeeId;
    }

    function getEmployees() public view returns (Employee[] memory) {
        Employee[] memory employeesArray = new Employee[](_employeeIds.current());
        for (uint256 i = 0; i < _employeeIds.current(); i++) {
            Employee storage employee = employees[i + 1];
            employeesArray[i] = employee;
        }
        return employeesArray;
    }

    function getEmployeeById(uint256 employeeId) public view returns (Employee memory) {
        return employees[employeeId];
    }

    function registerSale(uint256 employeeId, uint256 amount) public onlyOwner {
        employees[employeeId].amountSalesInMoney += amount;
    }
}
