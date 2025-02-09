export const didContract = {
    address: "0x05506C2086564bDe5D90B91852BCB7c876fD654D",
    abi: [
    {
        "anonymous": false,
        "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "bool",
            "name": "nicknameUpdated",
            "type": "bool"
        },
        {
            "indexed": false,
            "internalType": "bool",
            "name": "bioUpdated",
            "type": "bool"
        },
        {
            "indexed": false,
            "internalType": "bool",
            "name": "avatarUpdated",
            "type": "bool"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "socialAccountsUpdated",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "cryptoAddressesUpdated",
            "type": "uint256"
        }
        ],
        "name": "BatchProfileUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "chain",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "addr",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "updateType",
            "type": "string"
        }
        ],
        "name": "CryptoAddressUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "updateType",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "fieldType",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "key",
            "type": "string"
        }
        ],
        "name": "ProfileUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "platform",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "handle",
            "type": "string"
        },
        {
            "indexed": false,
            "internalType": "string",
            "name": "updateType",
            "type": "string"
        }
        ],
        "name": "SocialAccountUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "user",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "string[]",
            "name": "platforms",
            "type": "string[]"
        },
        {
            "indexed": false,
            "internalType": "string[]",
            "name": "handles",
            "type": "string[]"
        }
        ],
        "name": "SocialAccountsUpdated",
        "type": "event"
    },
    {
        "inputs": [
        {
            "components": [
            {
                "internalType": "string",
                "name": "nickname",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "bio",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "avatarUrl",
                "type": "string"
            },
            {
                "components": [
                {
                    "internalType": "string",
                    "name": "platform",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "handle",
                    "type": "string"
                }
                ],
                "internalType": "struct DataTypes.SocialAccountData[]",
                "name": "socialAccounts",
                "type": "tuple[]"
            },
            {
                "components": [
                {
                    "internalType": "string",
                    "name": "chain",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "addr",
                    "type": "string"
                }
                ],
                "internalType": "struct DataTypes.CryptoAddressData[]",
                "name": "cryptoAddresses",
                "type": "tuple[]"
            }
            ],
            "internalType": "struct DataTypes.ProfileUpdateData",
            "name": "data",
            "type": "tuple"
        }
        ],
        "name": "batchUpdateProfile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deleteAvatar",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "string",
            "name": "chain",
            "type": "string"
        }
        ],
        "name": "deleteCryptoAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "string",
            "name": "platform",
            "type": "string"
        }
        ],
        "name": "deleteSocialAccount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "address",
            "name": "user",
            "type": "address"
        }
        ],
        "name": "getAllSocialAccounts",
        "outputs": [
        {
            "internalType": "string[]",
            "name": "platforms",
            "type": "string[]"
        },
        {
            "internalType": "string[]",
            "name": "handles",
            "type": "string[]"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "address",
            "name": "user",
            "type": "address"
        },
        {
            "internalType": "string",
            "name": "chain",
            "type": "string"
        }
        ],
        "name": "getCryptoAddress",
        "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "address",
            "name": "user",
            "type": "address"
        }
        ],
        "name": "getFullProfile",
        "outputs": [
        {
            "components": [
            {
                "internalType": "bool",
                "name": "exists",
                "type": "bool"
            },
            {
                "internalType": "string",
                "name": "nickname",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "bio",
                "type": "string"
            },
            {
                "components": [
                {
                    "internalType": "enum IHashKeyDID.AvatarType",
                    "name": "avatarType",
                    "type": "uint8"
                },
                {
                    "internalType": "string",
                    "name": "value",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "nftContract",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
                ],
                "internalType": "struct IHashKeyDID.Avatar",
                "name": "avatar",
                "type": "tuple"
            },
            {
                "components": [
                {
                    "internalType": "string",
                    "name": "platform",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "handle",
                    "type": "string"
                }
                ],
                "internalType": "struct DataTypes.SocialAccount[]",
                "name": "socials",
                "type": "tuple[]"
            },
            {
                "components": [
                {
                    "internalType": "string",
                    "name": "chain",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "addr",
                    "type": "string"
                }
                ],
                "internalType": "struct DataTypes.CryptoAddress[]",
                "name": "addresses",
                "type": "tuple[]"
            },
            {
                "components": [
                {
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "updateType",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "fieldType",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "key",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "oldValue",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "newValue",
                    "type": "string"
                }
                ],
                "internalType": "struct DataTypes.UpdateRecord[]",
                "name": "history",
                "type": "tuple[]"
            }
            ],
            "internalType": "struct DataTypes.ProfileView",
            "name": "profile",
            "type": "tuple"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "address",
            "name": "user",
            "type": "address"
        }
        ],
        "name": "getProfile",
        "outputs": [
        {
            "internalType": "string",
            "name": "nickname",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "bio",
            "type": "string"
        },
        {
            "components": [
            {
                "internalType": "enum IHashKeyDID.AvatarType",
                "name": "avatarType",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "value",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
            ],
            "internalType": "struct IHashKeyDID.Avatar",
            "name": "avatar",
            "type": "tuple"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "address",
            "name": "user",
            "type": "address"
        },
        {
            "internalType": "string",
            "name": "platform",
            "type": "string"
        }
        ],
        "name": "getSocialAccount",
        "outputs": [
        {
            "internalType": "string",
            "name": "",
            "type": "string"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "address",
            "name": "user",
            "type": "address"
        }
        ],
        "name": "getUpdateHistory",
        "outputs": [
        {
            "components": [
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "updateType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "fieldType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "key",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "oldValue",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "newValue",
                "type": "string"
            }
            ],
            "internalType": "struct DataTypes.UpdateRecord[]",
            "name": "",
            "type": "tuple[]"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "address",
            "name": "user",
            "type": "address"
        }
        ],
        "name": "hasProfile",
        "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "string",
            "name": "_nickname",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "_bio",
            "type": "string"
        }
        ],
        "name": "initProfile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "address",
            "name": "_nftContract",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "_tokenId",
            "type": "uint256"
        }
        ],
        "name": "updateAvatarNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "string",
            "name": "_imageUrl",
            "type": "string"
        }
        ],
        "name": "updateAvatarUrl",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "string",
            "name": "chain",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "addr",
            "type": "string"
        }
        ],
        "name": "updateCryptoAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "string",
            "name": "_nickname",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "_bio",
            "type": "string"
        }
        ],
        "name": "updateProfile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "string",
            "name": "platform",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "handle",
            "type": "string"
        }
        ],
        "name": "updateSocialAccount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
    ],
} as const;
