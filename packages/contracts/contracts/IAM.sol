// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "hardhat/console.sol";
import "./SignatureVerifier.sol";

contract IAM is SignatureVerifier {
    struct Account {
        address pub;
        bytes32 seed;
    }

    uint256 private _nonce;

    mapping(address => Account) public accounts;
    mapping(address => bool) public registered;

    constructor() {
        _nonce = block.number;
    }

    function getNonce() external view returns (uint256) {
        return _nonce;
    }

    function resolvePublicKey(address addr_) external view returns (address) {
        return accounts[addr_].pub;
    }

    function incrementNonce() internal {
        _nonce++;
    }

    function determineNextSeed() public view returns (bytes32) {
        return bytes32(abi.encodePacked(msg.sender, _nonce));
    }

    function register(address pub_, bytes calldata signature_) external {
        require(accounts[msg.sender].pub == address(0), "Already registered");

        bytes32 seed = determineNextSeed();
        require(validate(msg.sender, seed, signature_), "Invalid signature");

        accounts[msg.sender] = Account(pub_, seed);
        registered[msg.sender] = true;

        incrementNonce();
    }

    function validate(
        address from_,
        bytes32 seed_,
        bytes calldata signature_
    ) private pure returns (bool) {
        bytes32 digest = keccak256(abi.encodePacked(from_, seed_));

        return verifySignature(from_, digest, signature_);
    }
}
