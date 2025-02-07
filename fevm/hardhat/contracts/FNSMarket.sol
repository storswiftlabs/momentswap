// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ISpaceFNS.sol";


contract RentMarket is ReentrancyGuard {
  event ItemListed(
    address indexed owner,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price,
    uint64 expire
  );
  event ItemLend(
    address indexed user,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price,
    uint64 start,
    uint64 expire
  );
  event ItemCanceled(address indexed owner, address indexed nftAddress, uint256 indexed tokenId);

  error PriceMustBeAboveZero();
  error NotApprovedForMarketplace();
  error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
  error ItemNotForSale(address nftAddress, uint256 tokenId);
  error NotListed(address nftAddress, uint256 tokenId);
  error AlreadyListed(address nftAddress, uint256 tokenId);
  error NotOwner();
  error NoProceeds();
  error NoTransactionFee();
  error NotBeneficiary();

  struct Listing {
    uint256 tokenId;
    uint256 price;
    uint64 expire;
    address owner;
  }

  //contract address ==>{tokenId==>Listing}
  mapping(address => mapping(uint256 => Listing)) allListItem;

  mapping(address => uint256) proceeds;

  mapping(address => uint256) totalTransactionFee;

  modifier notListed(
    address nftAddress,
    uint256 tokenId,
    address owner
  ) {
    if (allListItem[nftAddress][tokenId].price > 0) {
      revert AlreadyListed(nftAddress, tokenId);
    }
    _;
  }

  modifier isOwner(
    address nftAddress,
    uint256 tokenId,
    address owner
  ) {
    if (ISpaceFNS(nftAddress).ownerOf(tokenId) != owner) {
      revert NotOwner();
    }
    _;
  }

  modifier isBeneficiary(
    address sender
  ) {
    if (sender != beneficiary) {
      revert NotBeneficiary();
    }
    _;
  }

  modifier isListed(address nftAddress, uint256 tokenId) {
    Listing memory listing = allListItem[nftAddress][tokenId];
    if (listing.price <= 0) {
      revert NotListed(nftAddress, tokenId);
    }
    _;
  }

  uint256 public feeRate;
  address payable public beneficiary;

  constructor() {
    feeRate = 5;
    beneficiary = payable(msg.sender);
  }

  function listItem(
    address nftAddress,
    uint256 tokenId,
    uint256 price,
    uint64 expire
  ) external notListed(nftAddress, tokenId, msg.sender) isOwner(nftAddress, tokenId, msg.sender) {
    if (price <= 0) {
      revert PriceMustBeAboveZero();
    }
    ISpaceFNS nft = ISpaceFNS(nftAddress);

    if (nft.getApproved(tokenId) != address(this)) {
      revert NotApprovedForMarketplace();
    }
    allListItem[nftAddress][tokenId] = Listing(tokenId, price, expire, msg.sender);
    emit ItemListed(msg.sender, nftAddress, tokenId, price, expire);
  }

  function lendItem(address nftAddress, uint256 tokenId) external payable isListed(nftAddress, tokenId) nonReentrant {
    Listing memory listedItem = allListItem[nftAddress][tokenId];
    uint256 amount = msg.value;
    if (amount < listedItem.price) {
      revert PriceNotMet(nftAddress, tokenId, listedItem.price);
    }

    uint256 feeAmount = (amount * feeRate) / 100;
    uint256 netAmount = amount - feeAmount;

    totalTransactionFee[beneficiary] += feeAmount;
    proceeds[listedItem.owner] += netAmount;

    delete (allListItem[nftAddress][tokenId]);
    ISpaceFNS(nftAddress).setUser(tokenId, msg.sender, uint64(block.timestamp), uint64(listedItem.expire));
    emit ItemLend(msg.sender, nftAddress, tokenId, listedItem.price, uint64(block.timestamp), uint64(listedItem.expire));
  }

  function cancelListing(address nftAddress, uint256 tokenId)
    external
    isOwner(nftAddress, tokenId, msg.sender)
    isListed(nftAddress, tokenId)
  {
    delete (allListItem[nftAddress][tokenId]);
    emit ItemCanceled(msg.sender, nftAddress, tokenId);
  }

  function updateListing(
    address nftAddress,
    uint256 tokenId,
    uint256 newPrice,
    uint64 newExpire
  ) external isListed(nftAddress, tokenId) nonReentrant isOwner(nftAddress, tokenId, msg.sender) {
    if (newPrice == 0) {
      revert PriceMustBeAboveZero();
    }
    allListItem[nftAddress][tokenId].price = newPrice;
    allListItem[nftAddress][tokenId].expire = newExpire;
    emit ItemListed(msg.sender, nftAddress, tokenId, newPrice, newExpire);
  }

  function withdrawProceeds() external {
    uint256 proceed = proceeds[msg.sender];
    if (proceed <= 0) {
      revert NoProceeds();
    }
    proceeds[msg.sender] = 0;

    (bool success, ) = payable(msg.sender).call{value: proceed}("");
    require(success, "Transfer failed");
  }

  function getListing(address nftAddress, uint256 tokenId) external view returns (Listing memory) {
    return allListItem[nftAddress][tokenId];
  }

  function setBeneficiary(address _beneficiary) external isBeneficiary(msg.sender) {
    beneficiary = payable(_beneficiary);
  }

  function setFeeRate(uint256 _feeRate) external isBeneficiary(msg.sender) {
    require(_feeRate <= 100, "Fee rate can only be between 0 and 100");
    feeRate = _feeRate;
  }

  function withdrawTransactionFee() external {
    uint256 totalFee = totalTransactionFee[msg.sender];
    if (totalFee <= 0) {
      revert NoTransactionFee();
    }

    totalTransactionFee[msg.sender] = 0;

    (bool success, ) = beneficiary.call{value: totalFee}("");
    require(success, "Transfer failed");
  }
}

