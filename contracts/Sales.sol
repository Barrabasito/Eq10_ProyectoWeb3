// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >= 0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Sales is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _salesIds;

    struct Sale {
        uint256 saleId;
        uint256 employeeId;
        string saleDate;
        string[] soldProducts;
        uint256[] prices;
    }

    mapping(uint256 => Sale) public sales;

    function insertSale(uint256 employeeId, string memory saleDate, string[] memory soldProducts, uint256[] memory prices) public onlyOwner returns(uint256) {
        _salesIds.increment();
        uint256 newSaleId = _salesIds.current();
        Sale memory newSale = Sale(newSaleId, employeeId, saleDate, soldProducts, prices);
        sales[newSaleId] = newSale;
        return newSaleId;
    }

    function getSales() public view returns(Sale[] memory) {
        Sale[] memory salesArray = new Sale[](_salesIds.current());
        for (uint256 i = 0; i < _salesIds.current(); i++) {
            Sale storage sale = sales[i+1];
            salesArray[i] = sale;
        }
        return salesArray;
    }

    function getSaleById(uint256 saleId) public view returns(Sale memory) {
        return sales[saleId];
    }

    function getSalesByEmployeeId(uint256 employeeId) public view returns (Sale[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _salesIds.current(); i++) {
            if (sales[i].employeeId == employeeId) {
                count++;
            }
        }
        
        Sale[] memory salesArray = new Sale[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= _salesIds.current(); i++) {
            if (sales[i].employeeId == employeeId) {
                salesArray[index] = sales[i];
                index++;
            }
        }
        return salesArray;
    }
}
