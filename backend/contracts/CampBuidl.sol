//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract CampBuidl is ERC721, ERC721Burnable, Pausable, AccessControl, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
        bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
   

    constructor()ERC721("CampBuidl","CAM"){
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function pause() public onlyRole(PAUSER_ROLE)  {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE)  {
        _unpause();
    } 

    function safeMint(address to) public onlyRole(PAUSER_ROLE)  {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            
            _safeMint(to, tokenId);
            
        }
   

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override(ERC721 ,ERC721Enumerable)
    {
            super._beforeTokenTransfer(from, to, tokenId, batchSize);
        }

    
    
    function _burn(uint256 tokenId) internal override(ERC721 ) {
        super._burn(tokenId);
    }
   
    

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721 , ERC721Enumerable , AccessControl)
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}
    
   
}
    