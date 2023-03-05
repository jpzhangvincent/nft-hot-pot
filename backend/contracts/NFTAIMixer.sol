//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTAIMixer is
    ERC721,
    ERC721Burnable,
    Pausable,
    AccessControl,
    ERC721Enumerable
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string _baseTokenURI;
    uint256 private constant feePercent = 25;
    uint256 private constant price = 0.001 ether;
    address private admin;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event SetBaseURIEvent(string uri);

    constructor() ERC721("NFTAIMixer", "NAM") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        admin = msg.sender;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function publicMint() public payable {
        require(msg.value == price, "Price is Wrong");
        uint256 royalty = (price * 1000) / feePercent;
        mintModule(msg.sender);
        payable(admin).transfer(royalty);
    }

    function safeMint(address to) public onlyRole(ADMIN_ROLE) {
        mintModule(to);
    }

    function mintModule(address to) private {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function setBaseURI(string memory baseURI) public onlyRole(ADMIN_ROLE) {
        _baseTokenURI = baseURI;
        emit SetBaseURIEvent(baseURI);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
