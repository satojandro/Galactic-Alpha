// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface INameWrapper {
    function setSubnodeOwner(
        bytes32 parentNode,
        string calldata label,
        address owner,
        uint32 fuses,
        uint64 expiry
    ) external returns (bytes32);
    
    function ownerOf(uint256 tokenId) external view returns (address);
    
    function isApprovedForAll(address account, address operator) external view returns (bool);
}

/**
 * @title GalacticSubnameRegistrar
 * @notice Allows users to mint ENS subnames under galacticalpha.eth
 * @dev This contract must be approved as an operator by the owner of galacticalpha.eth
 */
contract GalacticSubnameRegistrar {
    INameWrapper public immutable nameWrapper;
    bytes32 public immutable parentNode;
    address public immutable admin;
    
    // Default fuses: no restrictions (0 means no fuses burned)
    uint32 public constant DEFAULT_FUSES = 0;
    
    // Default expiry: maximum uint64 (effectively no expiry)
    uint64 public constant DEFAULT_EXPIRY = type(uint64).max;
    
    // Track minted subnames to prevent duplicates
    mapping(string => bool) public isMinted;
    
    // Track total minted count
    uint256 public totalMinted;
    
    event SubnameMinted(address indexed to, string indexed label, string fullName);
    event SubnameRecovered(string indexed label, address indexed to);
    event AdminChanged(address indexed oldAdmin, address indexed newAdmin);
    
    error AlreadyMinted(string label);
    error NotAdmin();
    error NotApproved();
    error InvalidLabel(string label);
    
    /**
     * @notice Constructor sets up the registrar
     * @param _nameWrapper Address of the ENS NameWrapper contract
     * @param _parentNode Namehash of the parent domain (galacticalpha.eth)
     */
    constructor(address _nameWrapper, bytes32 _parentNode) {
        require(_nameWrapper != address(0), "Invalid NameWrapper address");
        require(_parentNode != bytes32(0), "Invalid parent node");
        
        nameWrapper = INameWrapper(_nameWrapper);
        parentNode = _parentNode;
        admin = msg.sender;
    }
    
    /**
     * @notice Mint a subname for the caller
     * @param label The subname label (e.g., "nova-sunburst" for nova-sunburst.galacticalpha.eth)
     * @dev Requires the contract to be approved as an operator by the parent domain owner
     */
    function mintSubname(string calldata label) external {
        // Validate label is not empty
        bytes memory labelBytes = bytes(label);
        require(labelBytes.length > 0, "Label cannot be empty");
        require(labelBytes.length <= 255, "Label too long");
        
        // Check if already minted
        if (isMinted[label]) {
            revert AlreadyMinted(label);
        }
        
        // Verify contract is approved as operator
        // We need to check if the contract itself is approved
        // The parent domain owner should have called setApprovalForAll on NameWrapper
        // Note: This check is done implicitly by the NameWrapper contract
        
        // Mark as minted before external call (prevents reentrancy)
        isMinted[label] = true;
        totalMinted++;
        
        // Create the subname
        nameWrapper.setSubnodeOwner(
            parentNode,
            label,
            msg.sender, // Owner receives the subname
            DEFAULT_FUSES,
            DEFAULT_EXPIRY
        );
        
        // Emit event with full name for easier indexing
        string memory fullName = string(abi.encodePacked(label, ".galacticalpha.eth"));
        emit SubnameMinted(msg.sender, label, fullName);
    }
    
    /**
     * @notice Check if a subname is available
     * @param label The subname label to check
     * @return True if available, false if already minted
     */
    function isAvailable(string calldata label) external view returns (bool) {
        return !isMinted[label];
    }
    
    /**
     * @notice Recover a subname (admin only)
     * @param label The subname label to recover
     * @dev Useful if a subname needs to be reclaimed (e.g., abuse, expired)
     */
    function recoverSubname(string calldata label) external {
        if (msg.sender != admin) {
            revert NotAdmin();
        }
        
        // Transfer ownership back to admin
        nameWrapper.setSubnodeOwner(
            parentNode,
            label,
            admin,
            DEFAULT_FUSES,
            DEFAULT_EXPIRY
        );
        
        emit SubnameRecovered(label, admin);
    }
    
    /**
     * @notice Check if contract is approved as operator
     * @param parentOwner Address of the parent domain owner
     * @return True if approved, false otherwise
     */
    function isContractApproved(address parentOwner) external view returns (bool) {
        return nameWrapper.isApprovedForAll(parentOwner, address(this));
    }
    
    /**
     * @notice Get contract info
     * @return wrapper Address of NameWrapper
     * @return parent Namehash of parent domain
     * @return adminAddress Admin address
     * @return mintedCount Total subnames minted
     */
    function getInfo() external view returns (
        address wrapper,
        bytes32 parent,
        address adminAddress,
        uint256 mintedCount
    ) {
        return (
            address(nameWrapper),
            parentNode,
            admin,
            totalMinted
        );
    }
}

