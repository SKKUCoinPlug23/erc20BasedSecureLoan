//SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.8.0;

/************
@title IFeeProvider interface
@notice Interface for the Aave fee provider.
*/

interface IFeeProvider {
    function calculateLoanOriginationFee(address _user, uint256 _amount) external view returns (uint256);
    function getLoanOriginationFeePercentage() external view returns (uint256);
}