// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./KeyManager.sol";
import "./SubHandler.sol";
import "./IAM.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PortalOrchestrator {
    address private _admin;

    mapping(address => bool) public spenders;

    KeyManager public keyManager;
    SubHandler public subHandler;
    IAM public iam;
    ERC20 public usdfc;

    uint256 public immutable ONE_USDFC;

    event Payment(address indexed user, uint256 amount, string reason);

    constructor(address usdfc_) {
        _admin = msg.sender;

        keyManager = new KeyManager();
        spenders[address(keyManager)] = true;

        subHandler = new SubHandler(_admin);
        spenders[address(subHandler)] = true;

        iam = new IAM();
        spenders[address(iam)] = true;

        usdfc = ERC20(usdfc_);
        ONE_USDFC = 10 ** 18; //usdfc.decimals();
    }

    modifier onlyAdmin() {
        require(msg.sender == _admin, "Not admin");
        _;
    }

    modifier onlySpender() {
        require(spenders[msg.sender], "Not a spender");
        _;
    }

    function setAdmin(address admin_) external {
        _admin = admin_;
    }

    function receivePayment(
        uint256 amount_,
        address spender_,
        string calldata reason_
    ) external onlySpender {
        require(amount_ > 0, "Amount must be greater than zero");

        usdfc.transferFrom(spender_, address(this), amount_);

        emit Payment(msg.sender, amount_, reason_);
    }

    function spend(
        uint256 amount_,
        address spender_,
        address receiver_
    ) external onlySpender {
        require(amount_ > 0, "Amount must be greater than zero");

        usdfc.transferFrom(spender_, receiver_, amount_);
    }

    function withdraw(address to_, uint256 amount_) external onlyAdmin {
        require(to_ != address(0), "Invalid address");
        require(amount_ > 0, "Amount must be greater than zero");
        require(
            usdfc.balanceOf(address(this)) >= amount_ * ONE_USDFC,
            "Insufficient balance"
        );

        usdfc.transfer(to_, amount_ * ONE_USDFC);
    }
}
