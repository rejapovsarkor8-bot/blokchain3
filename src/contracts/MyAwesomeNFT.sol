// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyAwesomeNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    event NFTMinted(address indexed minter, uint256 indexed tokenId, string uri);

    constructor() ERC721("Awesome", "AWSM") Ownable(msg.sender) {}

    // 1. Create - Minting NFT (Foydalanuvchi NFT yaratadi)
    function mintNFT(string memory uri) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit NFTMinted(msg.sender, tokenId, uri);
        return tokenId;
    }

    // O'qish (Read) uchun biz quyidagilardan front-end'da foydalanamiz:
    // - balanceOf(user)
    // - tokenOfOwnerByIndex(user, index)
    // - tokenURI(tokenId)

    // Quyidagilar kutubxonalar bo'yicha talab qilinadigan override (qayta yuklanishlar)
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
