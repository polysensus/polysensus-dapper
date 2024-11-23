// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

/**
 * @dev A particular account implmentation is authorized for use.
 */
struct TokenAuth {
    address allowedAccountImplementation;
    address allowedToken;
    uint256 sequenceType;
}

library LibTokenAuth {
    struct Layout {
        mapping(uint256 => TokenAuth) tokenAuth;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256('LibTokenAuth.storage.src.chaintrap.polysensus');

    function layout() internal pure returns (Layout storage s) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            s.slot := slot
        }
    }

    /*
    function checkSenderAccountImpl(TokenAuth storage auth, address sender) internal view returns (bool, address) {
        if (!ERC6551AccountLib.isERC6551Account(
          sender, auth.allowedAccountImplementation, EIP6551_REGISTRY))
            return (false, address(0));
      
        return (true, auth.allowedAccountImplementation);
    }*/

    function _set(
        LibTokenAuth.Layout storage s,
        uint256 ty,
        address allowedAccountImplementation,
        address allowedToken,
        uint256 sequenceType
    ) internal {
        s.tokenAuth[ty] = TokenAuth({
            allowedAccountImplementation: allowedAccountImplementation,
            allowedToken: allowedToken,
            sequenceType: sequenceType
        });
    }
}
