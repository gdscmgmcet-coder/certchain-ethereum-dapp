// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Custom errors for gas efficiency
error NotAdmin();
error CertificateAlreadyExists(string id);
error CertificateNotFound(string id);
error EmptyId();
error EmptyHash();

/// @title CertChain - Decentralized Certificate Verification
/// @notice Allows an admin to store certificate hashes and anyone to verify them
contract CertificateVerification {
    address public admin;

    // Certificate ID => IPFS/SHA-256 hash
    mapping(string => string) private certificates;
    // Track existence separately for gas-efficient checks
    mapping(string => bool) private exists;

    event CertificateAdded(string indexed id, string hash, uint256 timestamp);

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice Add a new certificate (open to all users)
    /// @param _id Unique certificate identifier
    /// @param _hash IPFS CID or SHA-256 hash of the certificate
    function addCertificate(
        string calldata _id,
        string calldata _hash
    ) external {
        if (bytes(_id).length == 0) revert EmptyId();
        if (bytes(_hash).length == 0) revert EmptyHash();
        if (exists[_id]) revert CertificateAlreadyExists(_id);

        certificates[_id] = _hash;
        exists[_id] = true;

        emit CertificateAdded(_id, _hash, block.timestamp);
    }

    /// @notice Verify a certificate by its ID
    /// @param _id Certificate identifier to look up
    /// @return The stored hash for the certificate
    function verifyCertificate(
        string calldata _id
    ) external view returns (string memory) {
        if (!exists[_id]) revert CertificateNotFound(_id);
        return certificates[_id];
    }

    /// @notice Check if a certificate exists
    /// @param _id Certificate identifier
    /// @return True if the certificate exists
    function certificateExists(
        string calldata _id
    ) external view returns (bool) {
        return exists[_id];
    }
}
