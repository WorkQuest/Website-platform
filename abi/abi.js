/* eslint-disable */

export const ERC20 = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "cap",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "BURNER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "MINTER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "cap",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getRoleMember",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleMemberCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const StakingWQ = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "tokensClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "tokensStaked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "tokensUnstaked",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "allProduced",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claim",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "distributionTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_staker",
        "type": "address"
      }
    ],
    "name": "getClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
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
    "name": "getInfoByAddress",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "staked_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "claim_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_balance",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStakingInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardTotal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "distributionTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalStaked",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalDistributed",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "stakeTokenAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "rewardTokenAddress",
            "type": "address"
          }
        ],
        "internalType": "struct WQLiquidityMining.StakeInfo",
        "name": "info_",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
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
        "internalType": "uint256",
        "name": "_startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rewardTotal",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_distributionTime",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_rewardToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_stakeToken",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "producedTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardProduced",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardTotal",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_rewardTotal",
        "type": "uint256"
      }
    ],
    "name": "setReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_distributionTime",
        "type": "uint256"
      }
    ],
    "name": "setTime",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_rewardToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_stakeToken",
        "type": "address"
      }
    ],
    "name": "setTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stakeToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "stakes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rewardAllowed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rewardDebt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "distributed",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "startTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
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
    "inputs": [],
    "name": "tokensPerStake",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDistributed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalStaked",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "update",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rewardAllowed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rewardDebt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_distributed",
        "type": "uint256"
      }
    ],
    "name": "updateStakerInfo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tps",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_totalStaked",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_totalDistributed",
        "type": "uint256"
      }
    ],
    "name": "updateStakingInfo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_startTimeNew",
        "type": "uint256"
      }
    ],
    "name": "updateStartTime",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const WQBridge = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "chainFrom",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "chainTo",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "SwapInitialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "chainFrom",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "chainTo",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "SwapRedeemed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Transferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "VALIDATOR_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "chainId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "chains",
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
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "message",
        "type": "bytes32"
      }
    ],
    "name": "getSwapState",
    "outputs": [
      {
        "internalType": "enum WQBridge.State",
        "name": "state",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
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
        "internalType": "uint256",
        "name": "_chainId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_pool",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
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
    "inputs": [],
    "name": "pool",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "chainFrom",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "redeem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "removeLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
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
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "chainTo",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "swap",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "swaps",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "internalType": "enum WQBridge.State",
        "name": "state",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "tokens",
    "outputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "native",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "lockable",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_chainId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      }
    ],
    "name": "updateChain",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_pool",
        "type": "address"
      }
    ],
    "name": "updatePool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "native",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "lockable",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "updateToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const WQBridgeToken = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "AddedBlockList",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "RemovedBlockList",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "BURNER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MINTER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PAUSER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
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
    "name": "addBlockList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
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
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isBlockListed",
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
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
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
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
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
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "removeBlockList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
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
    "inputs": [],
    "name": "symbol",
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
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const WQTExchange = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "previousAdmin",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "beacon",
        "type": "address"
      }
    ],
    "name": "BeaconUpgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Swapped",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "UPGRADER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "addToBlacklist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
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
        "internalType": "address",
        "name": "_oldToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_newToken",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "newToken",
    "outputs": [
      {
        "internalType": "contract WQBridgeTokenInterface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "oldToken",
    "outputs": [
      {
        "internalType": "contract IERC20Upgradeable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
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
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_oldToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_newToken",
        "type": "address"
      }
    ],
    "name": "setTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "setTotalSwapped",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
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
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "swap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSwapped",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      }
    ],
    "name": "upgradeTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

export const WQLiquidityMining = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "previousAdmin",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "beacon",
        "type": "address"
      }
    ],
    "name": "BeaconUpgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "Claimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "Staked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "Unstaked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "UPGRADER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "allProduced",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_paused",
        "type": "bool"
      }
    ],
    "name": "claimingPause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimingPaused",
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
    "inputs": [],
    "name": "distributionTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_staker",
        "type": "address"
      }
    ],
    "name": "getClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
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
    "name": "getInfoByAddress",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "staked_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "claim_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_balance",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStakingInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardTotal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "distributionTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalStaked",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalDistributed",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "stakeTokenAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "rewardTokenAddress",
            "type": "address"
          }
        ],
        "internalType": "struct WQLiquidityMining.StakeInfo",
        "name": "info_",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
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
        "internalType": "uint256",
        "name": "_startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rewardTotal",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_distributionTime",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_rewardToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_stakeToken",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
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
    "inputs": [],
    "name": "producedTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "removeTokenByAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardProduced",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardToken",
    "outputs": [
      {
        "internalType": "contract IERC20Upgradeable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardTotal",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_startTime",
        "type": "uint256"
      }
    ],
    "name": "setStartTime",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "stake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stakeToken",
    "outputs": [
      {
        "internalType": "contract IERC20Upgradeable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "stakes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rewardAllowed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rewardDebt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "distributed",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_paused",
        "type": "bool"
      }
    ],
    "name": "stakingPause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stakingPaused",
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
    "inputs": [],
    "name": "startTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
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
    "inputs": [],
    "name": "tokensPerStake",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDistributed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalStaked",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_paused",
        "type": "bool"
      }
    ],
    "name": "unstakingPause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unstakingPaused",
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
    "inputs": [],
    "name": "update",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_rewardTotal",
        "type": "uint256"
      }
    ],
    "name": "updateReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_rewardProduced",
        "type": "uint256"
      }
    ],
    "name": "updateRewardProduced",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_rewardTotal",
        "type": "uint256"
      }
    ],
    "name": "updateRewardTotal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rewardAllowed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rewardDebt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_distributed",
        "type": "uint256"
      }
    ],
    "name": "updateStakerInfo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_totalDistributed",
        "type": "uint256"
      }
    ],
    "name": "updateTotalDistributed",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_totalStaked",
        "type": "uint256"
      }
    ],
    "name": "updateTotalStaked",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tps",
        "type": "uint256"
      }
    ],
    "name": "updateTps",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_paused",
        "type": "bool"
      }
    ],
    "name": "updatingPause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      }
    ],
    "name": "upgradeTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

export const MainNetWQBridge = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "chainFrom",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "chainTo",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "SwapInitialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "chainFrom",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "chainTo",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "SwapRedeemed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Transferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "VALIDATOR_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "chainId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "chains",
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
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "message",
        "type": "bytes32"
      }
    ],
    "name": "getSwapState",
    "outputs": [
      {
        "internalType": "enum WQBridge.State",
        "name": "state",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
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
        "internalType": "uint256",
        "name": "_chainId",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "_pool",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
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
    "inputs": [],
    "name": "pool",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "chainFrom",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "redeem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "removeLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
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
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "chainTo",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "swap",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "swaps",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "internalType": "enum WQBridge.State",
        "name": "state",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "tokens",
    "outputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "native",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "lockable",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_chainId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      }
    ],
    "name": "updateChain",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_pool",
        "type": "address"
      }
    ],
    "name": "updatePool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "native",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "lockable",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "updateToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const MainNetWQBridgeToken = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "AddedBlockList",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "RemovedBlockList",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "BURNER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MINTER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PAUSER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
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
    "name": "addBlockList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
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
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isBlockListed",
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
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
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
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
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
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "removeBlockList",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
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
    "inputs": [],
    "name": "symbol",
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
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const MainNetWQTExchange = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_oldToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_newToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Swapped",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "addToBlacklist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
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
    "inputs": [],
    "name": "newToken",
    "outputs": [
      {
        "internalType": "contract WQBridgeTokenInterface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "oldToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
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
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "removeAnyToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_oldToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_newToken",
        "type": "address"
      }
    ],
    "name": "setTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "setTotalSwapped",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
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
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "swap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSwapped",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const WQStackingNative = [
  {
    "_format": "hh-sol-artifact-1",
    "contractName": "WQStakingNative",
    "sourceName": "contracts/WQStakingNative.sol",
    "abi": [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "Claimed",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "previousAdminRole",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "newAdminRole",
            "type": "bytes32"
          }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "RoleGranted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "RoleRevoked",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "Staked",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "Unstaked",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "ADMIN_ROLE",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "UPGRADER_ROLE",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "allProduced",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "claimPeriod",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "distributionTime",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_staker",
            "type": "address"
          }
        ],
        "name": "getClaim",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "reward",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address payable",
            "name": "user",
            "type": "address"
          }
        ],
        "name": "getInfoByAddress",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "staked_",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claim_",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_balance",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          }
        ],
        "name": "getRoleAdmin",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getStakingInfo",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "rewardTotal",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "distributionTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "stakePeriod",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "claimPeriod",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "minStake",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "maxStake",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalStaked",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalDistributed",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "rewardTokenAddress",
                "type": "address"
              }
            ],
            "internalType": "struct WQStakingNative.StakeInfo",
            "name": "info_",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "hasRole",
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
            "internalType": "uint256",
            "name": "_startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_rewardTotal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_distributionTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_stakePeriod",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_claimPeriod",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_minStake",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_maxStake",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_rewardToken",
            "type": "address"
          }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "maxStake",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "minStake",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "producedTime",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "rewardProduced",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "rewardToken",
        "outputs": [
          {
            "internalType": "contract IERC20Upgradeable",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "rewardTotal",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "setReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "stake",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "stakePeriod",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "stakes",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardAllowed",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardDebt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "distributed",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stakedAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claimedAt",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "startTime",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes4",
            "name": "interfaceId",
            "type": "bytes4"
          }
        ],
        "name": "supportsInterface",
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
        "inputs": [],
        "name": "tokensPerStake",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalDistributed",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalStaked",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "unstake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "update",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_user",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_rewardAllowed",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_rewardDebt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_distributed",
            "type": "uint256"
          }
        ],
        "name": "updateStakerInfo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_tps",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_totalStaked",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_totalDistributed",
            "type": "uint256"
          }
        ],
        "name": "updateStakingInfo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    "bytecode": "0x608060405234801561001057600080fd5b50611f03806100206000396000f3fe6080604052600436106102045760003560e01c806378e9792511610118578063c67f7f77116100a0578063efca2eed1161006f578063efca2eed146105dd578063f5e63937146105f3578063f72c0d8b14610609578063f7c618c11461063d578063f959680b1461067557600080fd5b8063c67f7f7714610571578063d547741f14610591578063e07ae092146105b1578063ea1b28e0146105c757600080fd5b806391d14854116100e757806391d14854146104ef578063a217fddf1461050f578063a2e6204514610524578063b40cd21d14610539578063c1699a991461055b57600080fd5b806378e97925146104725780637dc2cd9814610488578063817b1cd21461049e5780639060688c146104b457600080fd5b806334df07961161019b57806349c1cf6e1161016a57806349c1cf6e146103e55780634cd3723a146103fb5780634e71d92d1461041b5780636b6f4f451461043057806375b238fc1461045057600080fd5b806334df07961461039157806336568abe146103a7578063375b3c0a146103c75780633a4b66f1146103dd57600080fd5b8063260c9676116101d7578063260c96761461030f578063293be456146103315780632e17de78146103515780632f2ff15d1461037157600080fd5b806301ffc9a71461020957806316934fc41461023e578063248a9ca3146102bb57806324addbbc146102f9575b600080fd5b34801561021557600080fd5b50610229610224366004611ab3565b61068b565b60405190151581526020015b60405180910390f35b34801561024a57600080fd5b5061028e6102593660046119ed565b60c960205260009081526040902080546001820154600283015460038401546004850154600590950154939492939192909186565b604080519687526020870195909552938501929092526060840152608083015260a082015260c001610235565b3480156102c757600080fd5b506102eb6102d6366004611a6c565b60009081526065602052604090206001015490565b604051908152602001610235565b34801561030557600080fd5b506102eb60d55481565b34801561031b57600080fd5b5061032f61032a366004611adb565b6106c2565b005b34801561033d57600080fd5b5061032f61034c366004611a6c565b6106ea565b34801561035d57600080fd5b5061032f61036c366004611a6c565b610718565b34801561037d57600080fd5b5061032f61038c366004611a84565b6108e7565b34801561039d57600080fd5b506102eb60d25481565b3480156103b357600080fd5b5061032f6103c2366004611a84565b610912565b3480156103d357600080fd5b506102eb60d05481565b61032f610990565b3480156103f157600080fd5b506102eb60cd5481565b34801561040757600080fd5b506102eb6104163660046119ed565b610c57565b34801561042757600080fd5b5061032f610ccf565b34801561043c57600080fd5b5061032f61044b366004611a09565b610e75565b34801561045c57600080fd5b506102eb600080516020611eae83398151915281565b34801561047e57600080fd5b506102eb60cb5481565b34801561049457600080fd5b506102eb60cf5481565b3480156104aa57600080fd5b506102eb60d65481565b3480156104c057600080fd5b506104d46104cf3660046119ed565b610ebe565b60408051938452602084019290925290820152606001610235565b3480156104fb57600080fd5b5061022961050a366004611a84565b610efa565b34801561051b57600080fd5b506102eb600081565b34801561053057600080fd5b5061032f610f25565b34801561054557600080fd5b5061054e610f96565b6040516102359190611d2d565b34801561056757600080fd5b506102eb60ce5481565b34801561057d57600080fd5b5061032f61058c366004611b06565b61105e565b34801561059d57600080fd5b5061032f6105ac366004611a84565b6111aa565b3480156105bd57600080fd5b506102eb60d35481565b3480156105d357600080fd5b506102eb60d15481565b3480156105e957600080fd5b506102eb60d75481565b3480156105ff57600080fd5b506102eb60d45481565b34801561061557600080fd5b506102eb7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e381565b34801561064957600080fd5b5060ca5461065d906001600160a01b031681565b6040516001600160a01b039091168152602001610235565b34801561068157600080fd5b506102eb60cc5481565b60006001600160e01b03198216637965db0b60e01b14806106bc57506301ffc9a760e01b6001600160e01b03198316145b92915050565b600080516020611eae8339815191526106db81336111d0565b5060d29290925560d65560d755565b600080516020611eae83398151915261070381336111d0565b61070b611234565b60d455504260d55560cc55565b600260975414156107445760405162461bcd60e51b815260040161073b90611cf6565b60405180910390fd5b60026097556102586107596201518042611e58565b10158015610776575062014f286107736201518042611e58565b11155b6107925760405162461bcd60e51b815260040161073b90611c81565b33600090815260c96020526040902080548211156108025760405162461bcd60e51b815260206004820152602760248201527f57515374616b696e673a204e6f7420656e6f75676820746f6b656e7320746f20604482015266756e7374616b6560c81b606482015260840161073b565b61080a610f25565b670de0b6b3a764000060d254836108219190611ddb565b61082b9190611dc7565b81600101600082825461083e9190611daf565b9091555050805482908290600090610857908490611dfa565b925050819055508160d660008282546108709190611dfa565b9091555050604051339083156108fc029084906000818181858888f193505050501580156108a2573d6000803e3d6000fd5b506040805183815242602082015233917f7d3c803765ec6329bfc61627600c66b23d6663e88dfec119fd0457cd4b7e404391015b60405180910390a250506001609755565b60008281526065602052604090206001015461090381336111d0565b61090d8383611270565b505050565b6001600160a01b03811633146109825760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b606482015260840161073b565b61098c82826112f6565b5050565b600260975414156109b35760405162461bcd60e51b815260040161073b90611cf6565b600260975560cb544211610a1a5760405162461bcd60e51b815260206004820152602860248201527f57515374616b696e673a205374616b696e672074696d6520686173206e6f742060448201526718dbdb59481e595d60c21b606482015260840161073b565b610258610a2a6201518042611e58565b10158015610a47575062014f28610a446201518042611e58565b11155b610a635760405162461bcd60e51b815260040161073b90611c81565b60d054341015610ad45760405162461bcd60e51b815260206004820152603660248201527f57515374616b696e673a20416d6f756e742073686f756c642062652067726561604482015275746572207468616e206d696e696d756d207374616b6560501b606482015260840161073b565b33600090815260c96020526040902060d1548154610af29034611daf565b1115610b5c5760405162461bcd60e51b815260206004820152603360248201527f57515374616b696e673a20416d6f756e742073686f756c64206265206c657373604482015272207468616e206d6178696d756d207374616b6560681b606482015260840161073b565b60ce546004820154610b6e9042611dfa565b11610b8b5760405162461bcd60e51b815260040161073b90611cb0565b60d65415610b9b57610b9b610f25565b670de0b6b3a764000060d25434610bb29190611ddb565b610bbc9190611dc7565b816002016000828254610bcf9190611daf565b925050819055503460d66000828254610be89190611daf565b9091555050805434908290600090610c01908490611daf565b9091555050426004820181905560405133917f1b52f0db6b5f755caa8f232eebe353a340637e6c55969d84b3ee0cee945aa43391610c4791348252602082015260400190565b60405180910390a2506001609755565b60d25460d6546000919015610cbe576000610c70611234565b905060d354811115610cbc57600060d35482610c8c9190611dfa565b60d654909150610ca482670de0b6b3a7640000611ddb565b610cae9190611dc7565b610cb89084611daf565b9250505b505b610cc8838261135d565b9392505050565b60026097541415610cf25760405162461bcd60e51b815260040161073b90611cf6565b6002609755610258610d076201518042611e58565b10158015610d24575062014f28610d216201518042611e58565b11155b610d405760405162461bcd60e51b815260040161073b90611c81565b33600090815260c96020526040902060cf546005820154610d619042611dfa565b11610d7e5760405162461bcd60e51b815260040161073b90611cb0565b60d65415610d8e57610d8e610f25565b6000610d9c3360d25461135d565b905060008111610dee5760405162461bcd60e51b815260206004820152601b60248201527f57515374616b696e673a204e6f7468696e6720746f20636c61696d0000000000604482015260640161073b565b80826003016000828254610e029190611daf565b909155505042600583015560d78054829190600090610e22908490611daf565b909155505060ca54610e3e906001600160a01b031633836113cb565b6040805182815242602082015233917fc09f7b3c1c5b70bf6d30e485a4525d625d4723aed5d319376825446ef135c7ca91016108d6565b600080516020611eae833981519152610e8e81336111d0565b506001600160a01b03909416600090815260c9602052604090209283556001830191909155600282015560030155565b6001600160a01b038116600090815260c960205260408120805491908190610ee585610c57565b939593946001600160a01b0316319392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6000610f2f611234565b905060d354811115610f9357600060d35482610f4b9190611dfa565b60d65490915015610f8c5760d654610f6b82670de0b6b3a7640000611ddb565b610f759190611dc7565b60d26000828254610f869190611daf565b90915550505b5060d38190555b50565b610ff560405180610140016040528060008152602001600081526020016000815260200160008152602001600081526020016000815260200160008152602001600081526020016000815260200160006001600160a01b031681525090565b50604080516101408101825260cb54815260cc54602082015260cd549181019190915260ce54606082015260cf54608082015260d05460a082015260d15460c082015260d65460e082015260d75461010082015260ca546001600160a01b031661012082015290565b600054610100900460ff1680611077575060005460ff16155b6110935760405162461bcd60e51b815260040161073b90611c33565b600054610100900460ff161580156110b5576000805461ffff19166101011790555b6110bd61141d565b6110c56114a0565b60cb89905560cc88905560cd87905560ce86905560cf85905560d084905560d183905560ca80546001600160a01b0319166001600160a01b03841617905560d58990556111136000336114ff565b61112b600080516020611eae833981519152336114ff565b6111557f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3336114ff565b61118d7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3600080516020611eae833981519152611509565b801561119f576000805461ff00191690555b505050505050505050565b6000828152606560205260409020600101546111c681336111d0565b61090d83836112f6565b6111da8282610efa565b61098c576111f2816001600160a01b03166014611554565b6111fd836020611554565b60405160200161120e929190611b8b565b60408051601f198184030181529082905262461bcd60e51b825261073b91600401611c00565b600060cd5460d554426112479190611dfa565b60cc546112549190611ddb565b61125e9190611dc7565b60d45461126b9190611daf565b905090565b61127a8282610efa565b61098c5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556112b23390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6113008282610efa565b1561098c5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6001600160a01b038216600090815260c9602052604081206002810154600382015460018301548354670de0b6b3a76400009061139b908890611ddb565b6113a59190611dc7565b6113af9190611daf565b6113b99190611dfa565b6113c39190611dfa565b949350505050565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b17905261090d908490611736565b600054610100900460ff1680611436575060005460ff16155b6114525760405162461bcd60e51b815260040161073b90611c33565b600054610100900460ff16158015611474576000805461ffff19166101011790555b61147c611808565b611484611808565b61148c611808565b8015610f93576000805461ff001916905550565b600054610100900460ff16806114b9575060005460ff16155b6114d55760405162461bcd60e51b815260040161073b90611c33565b600054610100900460ff161580156114f7576000805461ffff19166101011790555b61148c611872565b61098c8282611270565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60606000611563836002611ddb565b61156e906002611daf565b67ffffffffffffffff81111561159457634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156115be576020820181803683370190505b509050600360fc1b816000815181106115e757634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061162457634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000611648846002611ddb565b611653906001611daf565b90505b60018111156116e7576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061169557634e487b7160e01b600052603260045260246000fd5b1a60f81b8282815181106116b957634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c936116e081611e41565b9050611656565b508315610cc85760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161073b565b600061178b826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166118e29092919063ffffffff16565b80519091501561090d57808060200190518101906117a99190611a4c565b61090d5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161073b565b600054610100900460ff1680611821575060005460ff16155b61183d5760405162461bcd60e51b815260040161073b90611c33565b600054610100900460ff1615801561148c576000805461ffff19166101011790558015610f93576000805461ff001916905550565b600054610100900460ff168061188b575060005460ff16155b6118a75760405162461bcd60e51b815260040161073b90611c33565b600054610100900460ff161580156118c9576000805461ffff19166101011790555b60016097558015610f93576000805461ff001916905550565b60606113c3848460008585843b61193b5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161073b565b600080866001600160a01b031685876040516119579190611b6f565b60006040518083038185875af1925050503d8060008114611994576040519150601f19603f3d011682016040523d82523d6000602084013e611999565b606091505b50915091506119a98282866119b4565b979650505050505050565b606083156119c3575081610cc8565b8251156119d35782518084602001fd5b8160405162461bcd60e51b815260040161073b9190611c00565b6000602082840312156119fe578081fd5b8135610cc881611e98565b600080600080600060a08688031215611a20578081fd5b8535611a2b81611e98565b97602087013597506040870135966060810135965060800135945092505050565b600060208284031215611a5d578081fd5b81518015158114610cc8578182fd5b600060208284031215611a7d578081fd5b5035919050565b60008060408385031215611a96578182fd5b823591506020830135611aa881611e98565b809150509250929050565b600060208284031215611ac4578081fd5b81356001600160e01b031981168114610cc8578182fd5b600080600060608486031215611aef578283fd5b505081359360208301359350604090920135919050565b600080600080600080600080610100898b031215611b22578283fd5b883597506020890135965060408901359550606089013594506080890135935060a0890135925060c0890135915060e0890135611b5e81611e98565b809150509295985092959890939650565b60008251611b81818460208701611e11565b9190910192915050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351611bc3816017850160208801611e11565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611bf4816028840160208801611e11565b01602801949350505050565b6020815260008251806020840152611c1f816040850160208701611e11565b601f01601f19169190910160400192915050565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526015908201527457515374616b696e673a204461696c79206c6f636b60581b604082015260600190565b60208082526026908201527f57515374616b696e673a20596f752063616e6e6f74207374616b6520746f6b656040820152651b9cc81e595d60d21b606082015260800190565b6020808252601f908201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604082015260600190565b600061014082019050825182526020830151602083015260408301516040830152606083015160608301526080830151608083015260a083015160a083015260c083015160c083015260e083015160e083015261010080840151818401525061012080840151611da7828501826001600160a01b03169052565b505092915050565b60008219821115611dc257611dc2611e6c565b500190565b600082611dd657611dd6611e82565b500490565b6000816000190483118215151615611df557611df5611e6c565b500290565b600082821015611e0c57611e0c611e6c565b500390565b60005b83811015611e2c578181015183820152602001611e14565b83811115611e3b576000848401525b50505050565b600081611e5057611e50611e6c565b506000190190565b600082611e6757611e67611e82565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b6001600160a01b0381168114610f9357600080fdfea49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775a2646970667358221220699f083a1e0715b6f586f3573db89c024aa431a9cd5787ad6d34c149aa39668d64736f6c63430008040033",
    "deployedBytecode": "0x6080604052600436106102045760003560e01c806378e9792511610118578063c67f7f77116100a0578063efca2eed1161006f578063efca2eed146105dd578063f5e63937146105f3578063f72c0d8b14610609578063f7c618c11461063d578063f959680b1461067557600080fd5b8063c67f7f7714610571578063d547741f14610591578063e07ae092146105b1578063ea1b28e0146105c757600080fd5b806391d14854116100e757806391d14854146104ef578063a217fddf1461050f578063a2e6204514610524578063b40cd21d14610539578063c1699a991461055b57600080fd5b806378e97925146104725780637dc2cd9814610488578063817b1cd21461049e5780639060688c146104b457600080fd5b806334df07961161019b57806349c1cf6e1161016a57806349c1cf6e146103e55780634cd3723a146103fb5780634e71d92d1461041b5780636b6f4f451461043057806375b238fc1461045057600080fd5b806334df07961461039157806336568abe146103a7578063375b3c0a146103c75780633a4b66f1146103dd57600080fd5b8063260c9676116101d7578063260c96761461030f578063293be456146103315780632e17de78146103515780632f2ff15d1461037157600080fd5b806301ffc9a71461020957806316934fc41461023e578063248a9ca3146102bb57806324addbbc146102f9575b600080fd5b34801561021557600080fd5b50610229610224366004611ab3565b61068b565b60405190151581526020015b60405180910390f35b34801561024a57600080fd5b5061028e6102593660046119ed565b60c960205260009081526040902080546001820154600283015460038401546004850154600590950154939492939192909186565b604080519687526020870195909552938501929092526060840152608083015260a082015260c001610235565b3480156102c757600080fd5b506102eb6102d6366004611a6c565b60009081526065602052604090206001015490565b604051908152602001610235565b34801561030557600080fd5b506102eb60d55481565b34801561031b57600080fd5b5061032f61032a366004611adb565b6106c2565b005b34801561033d57600080fd5b5061032f61034c366004611a6c565b6106ea565b34801561035d57600080fd5b5061032f61036c366004611a6c565b610718565b34801561037d57600080fd5b5061032f61038c366004611a84565b6108e7565b34801561039d57600080fd5b506102eb60d25481565b3480156103b357600080fd5b5061032f6103c2366004611a84565b610912565b3480156103d357600080fd5b506102eb60d05481565b61032f610990565b3480156103f157600080fd5b506102eb60cd5481565b34801561040757600080fd5b506102eb6104163660046119ed565b610c57565b34801561042757600080fd5b5061032f610ccf565b34801561043c57600080fd5b5061032f61044b366004611a09565b610e75565b34801561045c57600080fd5b506102eb600080516020611eae83398151915281565b34801561047e57600080fd5b506102eb60cb5481565b34801561049457600080fd5b506102eb60cf5481565b3480156104aa57600080fd5b506102eb60d65481565b3480156104c057600080fd5b506104d46104cf3660046119ed565b610ebe565b60408051938452602084019290925290820152606001610235565b3480156104fb57600080fd5b5061022961050a366004611a84565b610efa565b34801561051b57600080fd5b506102eb600081565b34801561053057600080fd5b5061032f610f25565b34801561054557600080fd5b5061054e610f96565b6040516102359190611d2d565b34801561056757600080fd5b506102eb60ce5481565b34801561057d57600080fd5b5061032f61058c366004611b06565b61105e565b34801561059d57600080fd5b5061032f6105ac366004611a84565b6111aa565b3480156105bd57600080fd5b506102eb60d35481565b3480156105d357600080fd5b506102eb60d15481565b3480156105e957600080fd5b506102eb60d75481565b3480156105ff57600080fd5b506102eb60d45481565b34801561061557600080fd5b506102eb7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e381565b34801561064957600080fd5b5060ca5461065d906001600160a01b031681565b6040516001600160a01b039091168152602001610235565b34801561068157600080fd5b506102eb60cc5481565b60006001600160e01b03198216637965db0b60e01b14806106bc57506301ffc9a760e01b6001600160e01b03198316145b92915050565b600080516020611eae8339815191526106db81336111d0565b5060d29290925560d65560d755565b600080516020611eae83398151915261070381336111d0565b61070b611234565b60d455504260d55560cc55565b600260975414156107445760405162461bcd60e51b815260040161073b90611cf6565b60405180910390fd5b60026097556102586107596201518042611e58565b10158015610776575062014f286107736201518042611e58565b11155b6107925760405162461bcd60e51b815260040161073b90611c81565b33600090815260c96020526040902080548211156108025760405162461bcd60e51b815260206004820152602760248201527f57515374616b696e673a204e6f7420656e6f75676820746f6b656e7320746f20604482015266756e7374616b6560c81b606482015260840161073b565b61080a610f25565b670de0b6b3a764000060d254836108219190611ddb565b61082b9190611dc7565b81600101600082825461083e9190611daf565b9091555050805482908290600090610857908490611dfa565b925050819055508160d660008282546108709190611dfa565b9091555050604051339083156108fc029084906000818181858888f193505050501580156108a2573d6000803e3d6000fd5b506040805183815242602082015233917f7d3c803765ec6329bfc61627600c66b23d6663e88dfec119fd0457cd4b7e404391015b60405180910390a250506001609755565b60008281526065602052604090206001015461090381336111d0565b61090d8383611270565b505050565b6001600160a01b03811633146109825760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b606482015260840161073b565b61098c82826112f6565b5050565b600260975414156109b35760405162461bcd60e51b815260040161073b90611cf6565b600260975560cb544211610a1a5760405162461bcd60e51b815260206004820152602860248201527f57515374616b696e673a205374616b696e672074696d6520686173206e6f742060448201526718dbdb59481e595d60c21b606482015260840161073b565b610258610a2a6201518042611e58565b10158015610a47575062014f28610a446201518042611e58565b11155b610a635760405162461bcd60e51b815260040161073b90611c81565b60d054341015610ad45760405162461bcd60e51b815260206004820152603660248201527f57515374616b696e673a20416d6f756e742073686f756c642062652067726561604482015275746572207468616e206d696e696d756d207374616b6560501b606482015260840161073b565b33600090815260c96020526040902060d1548154610af29034611daf565b1115610b5c5760405162461bcd60e51b815260206004820152603360248201527f57515374616b696e673a20416d6f756e742073686f756c64206265206c657373604482015272207468616e206d6178696d756d207374616b6560681b606482015260840161073b565b60ce546004820154610b6e9042611dfa565b11610b8b5760405162461bcd60e51b815260040161073b90611cb0565b60d65415610b9b57610b9b610f25565b670de0b6b3a764000060d25434610bb29190611ddb565b610bbc9190611dc7565b816002016000828254610bcf9190611daf565b925050819055503460d66000828254610be89190611daf565b9091555050805434908290600090610c01908490611daf565b9091555050426004820181905560405133917f1b52f0db6b5f755caa8f232eebe353a340637e6c55969d84b3ee0cee945aa43391610c4791348252602082015260400190565b60405180910390a2506001609755565b60d25460d6546000919015610cbe576000610c70611234565b905060d354811115610cbc57600060d35482610c8c9190611dfa565b60d654909150610ca482670de0b6b3a7640000611ddb565b610cae9190611dc7565b610cb89084611daf565b9250505b505b610cc8838261135d565b9392505050565b60026097541415610cf25760405162461bcd60e51b815260040161073b90611cf6565b6002609755610258610d076201518042611e58565b10158015610d24575062014f28610d216201518042611e58565b11155b610d405760405162461bcd60e51b815260040161073b90611c81565b33600090815260c96020526040902060cf546005820154610d619042611dfa565b11610d7e5760405162461bcd60e51b815260040161073b90611cb0565b60d65415610d8e57610d8e610f25565b6000610d9c3360d25461135d565b905060008111610dee5760405162461bcd60e51b815260206004820152601b60248201527f57515374616b696e673a204e6f7468696e6720746f20636c61696d0000000000604482015260640161073b565b80826003016000828254610e029190611daf565b909155505042600583015560d78054829190600090610e22908490611daf565b909155505060ca54610e3e906001600160a01b031633836113cb565b6040805182815242602082015233917fc09f7b3c1c5b70bf6d30e485a4525d625d4723aed5d319376825446ef135c7ca91016108d6565b600080516020611eae833981519152610e8e81336111d0565b506001600160a01b03909416600090815260c9602052604090209283556001830191909155600282015560030155565b6001600160a01b038116600090815260c960205260408120805491908190610ee585610c57565b939593946001600160a01b0316319392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6000610f2f611234565b905060d354811115610f9357600060d35482610f4b9190611dfa565b60d65490915015610f8c5760d654610f6b82670de0b6b3a7640000611ddb565b610f759190611dc7565b60d26000828254610f869190611daf565b90915550505b5060d38190555b50565b610ff560405180610140016040528060008152602001600081526020016000815260200160008152602001600081526020016000815260200160008152602001600081526020016000815260200160006001600160a01b031681525090565b50604080516101408101825260cb54815260cc54602082015260cd549181019190915260ce54606082015260cf54608082015260d05460a082015260d15460c082015260d65460e082015260d75461010082015260ca546001600160a01b031661012082015290565b600054610100900460ff1680611077575060005460ff16155b6110935760405162461bcd60e51b815260040161073b90611c33565b600054610100900460ff161580156110b5576000805461ffff19166101011790555b6110bd61141d565b6110c56114a0565b60cb89905560cc88905560cd87905560ce86905560cf85905560d084905560d183905560ca80546001600160a01b0319166001600160a01b03841617905560d58990556111136000336114ff565b61112b600080516020611eae833981519152336114ff565b6111557f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3336114ff565b61118d7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3600080516020611eae833981519152611509565b801561119f576000805461ff00191690555b505050505050505050565b6000828152606560205260409020600101546111c681336111d0565b61090d83836112f6565b6111da8282610efa565b61098c576111f2816001600160a01b03166014611554565b6111fd836020611554565b60405160200161120e929190611b8b565b60408051601f198184030181529082905262461bcd60e51b825261073b91600401611c00565b600060cd5460d554426112479190611dfa565b60cc546112549190611ddb565b61125e9190611dc7565b60d45461126b9190611daf565b905090565b61127a8282610efa565b61098c5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556112b23390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6113008282610efa565b1561098c5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6001600160a01b038216600090815260c9602052604081206002810154600382015460018301548354670de0b6b3a76400009061139b908890611ddb565b6113a59190611dc7565b6113af9190611daf565b6113b99190611dfa565b6113c39190611dfa565b949350505050565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b17905261090d908490611736565b600054610100900460ff1680611436575060005460ff16155b6114525760405162461bcd60e51b815260040161073b90611c33565b600054610100900460ff16158015611474576000805461ffff19166101011790555b61147c611808565b611484611808565b61148c611808565b8015610f93576000805461ff001916905550565b600054610100900460ff16806114b9575060005460ff16155b6114d55760405162461bcd60e51b815260040161073b90611c33565b600054610100900460ff161580156114f7576000805461ffff19166101011790555b61148c611872565b61098c8282611270565b600082815260656020526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b60606000611563836002611ddb565b61156e906002611daf565b67ffffffffffffffff81111561159457634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156115be576020820181803683370190505b509050600360fc1b816000815181106115e757634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061162457634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000611648846002611ddb565b611653906001611daf565b90505b60018111156116e7576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061169557634e487b7160e01b600052603260045260246000fd5b1a60f81b8282815181106116b957634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c936116e081611e41565b9050611656565b508315610cc85760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161073b565b600061178b826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166118e29092919063ffffffff16565b80519091501561090d57808060200190518101906117a99190611a4c565b61090d5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161073b565b600054610100900460ff1680611821575060005460ff16155b61183d5760405162461bcd60e51b815260040161073b90611c33565b600054610100900460ff1615801561148c576000805461ffff19166101011790558015610f93576000805461ff001916905550565b600054610100900460ff168061188b575060005460ff16155b6118a75760405162461bcd60e51b815260040161073b90611c33565b600054610100900460ff161580156118c9576000805461ffff19166101011790555b60016097558015610f93576000805461ff001916905550565b60606113c3848460008585843b61193b5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161073b565b600080866001600160a01b031685876040516119579190611b6f565b60006040518083038185875af1925050503d8060008114611994576040519150601f19603f3d011682016040523d82523d6000602084013e611999565b606091505b50915091506119a98282866119b4565b979650505050505050565b606083156119c3575081610cc8565b8251156119d35782518084602001fd5b8160405162461bcd60e51b815260040161073b9190611c00565b6000602082840312156119fe578081fd5b8135610cc881611e98565b600080600080600060a08688031215611a20578081fd5b8535611a2b81611e98565b97602087013597506040870135966060810135965060800135945092505050565b600060208284031215611a5d578081fd5b81518015158114610cc8578182fd5b600060208284031215611a7d578081fd5b5035919050565b60008060408385031215611a96578182fd5b823591506020830135611aa881611e98565b809150509250929050565b600060208284031215611ac4578081fd5b81356001600160e01b031981168114610cc8578182fd5b600080600060608486031215611aef578283fd5b505081359360208301359350604090920135919050565b600080600080600080600080610100898b031215611b22578283fd5b883597506020890135965060408901359550606089013594506080890135935060a0890135925060c0890135915060e0890135611b5e81611e98565b809150509295985092959890939650565b60008251611b81818460208701611e11565b9190910192915050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351611bc3816017850160208801611e11565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611bf4816028840160208801611e11565b01602801949350505050565b6020815260008251806020840152611c1f816040850160208701611e11565b601f01601f19169190910160400192915050565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526015908201527457515374616b696e673a204461696c79206c6f636b60581b604082015260600190565b60208082526026908201527f57515374616b696e673a20596f752063616e6e6f74207374616b6520746f6b656040820152651b9cc81e595d60d21b606082015260800190565b6020808252601f908201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604082015260600190565b600061014082019050825182526020830151602083015260408301516040830152606083015160608301526080830151608083015260a083015160a083015260c083015160c083015260e083015160e083015261010080840151818401525061012080840151611da7828501826001600160a01b03169052565b505092915050565b60008219821115611dc257611dc2611e6c565b500190565b600082611dd657611dd6611e82565b500490565b6000816000190483118215151615611df557611df5611e6c565b500290565b600082821015611e0c57611e0c611e6c565b500390565b60005b83811015611e2c578181015183820152602001611e14565b83811115611e3b576000848401525b50505050565b600081611e5057611e50611e6c565b506000190190565b600082611e6757611e67611e82565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b6001600160a01b0381168114610f9357600080fdfea49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775a2646970667358221220699f083a1e0715b6f586f3573db89c024aa431a9cd5787ad6d34c149aa39668d64736f6c63430008040033",
    "linkReferences": {},
    "deployedLinkReferences": {}
  }
]; // WUSD

export const WQStacking = [
  {
    "_format": "hh-sol-artifact-1",
    "contractName": "WQStaking",
    "sourceName": "contracts/WQStaking.sol",
    "abi": [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "previousAdmin",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "newAdmin",
            "type": "address"
          }
        ],
        "name": "AdminChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "beacon",
            "type": "address"
          }
        ],
        "name": "BeaconUpgraded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "previousAdminRole",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "newAdminRole",
            "type": "bytes32"
          }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "RoleGranted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "RoleRevoked",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "implementation",
            "type": "address"
          }
        ],
        "name": "Upgraded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "tokensClaimed",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "tokensStaked",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "tokensUnstaked",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "ADMIN_ROLE",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "UPGRADER_ROLE",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "allProduced",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "claim",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "claimPeriod",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "distributionTime",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_staker",
            "type": "address"
          }
        ],
        "name": "getClaim",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "reward",
            "type": "uint256"
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
        "name": "getInfoByAddress",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "staked_",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claim_",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_balance",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          }
        ],
        "name": "getRoleAdmin",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getStakingInfo",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "rewardTotal",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "distributionTime",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "stakePeriod",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "claimPeriod",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "minStake",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "maxStake",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalStaked",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "totalDistributed",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "stakeTokenAddress",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "rewardTokenAddress",
                "type": "address"
              }
            ],
            "internalType": "struct WQStaking.StakeInfo",
            "name": "info_",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "hasRole",
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
            "internalType": "uint256",
            "name": "_startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_rewardTotal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_distributionTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_stakePeriod",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_claimPeriod",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_minStake",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_maxStake",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_rewardToken",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_stakeToken",
            "type": "address"
          }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "maxStake",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "minStake",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "producedTime",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "rewardProduced",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "rewardToken",
        "outputs": [
          {
            "internalType": "contract IERC20Upgradeable",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "rewardTotal",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_rewardTotal",
            "type": "uint256"
          }
        ],
        "name": "setReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "duration",
            "type": "uint256"
          }
        ],
        "name": "stake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "stakePeriod",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "stakeToken",
        "outputs": [
          {
            "internalType": "contract IERC20Upgradeable",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "stakes",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardAllowed",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardDebt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "distributed",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stakedAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claimedAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "unstakeTime",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "startTime",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes4",
            "name": "interfaceId",
            "type": "bytes4"
          }
        ],
        "name": "supportsInterface",
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
        "inputs": [],
        "name": "tokensPerStake",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalDistributed",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalStaked",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "unstake",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "update",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_producedTime",
            "type": "uint256"
          }
        ],
        "name": "updateProducedTime",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_user",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_rewardAllowed",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_rewardDebt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_distributed",
            "type": "uint256"
          }
        ],
        "name": "updateStakerInfo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_tps",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_totalStaked",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_totalDistributed",
            "type": "uint256"
          }
        ],
        "name": "updateStakingInfo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_startTimeNew",
            "type": "uint256"
          }
        ],
        "name": "updateStartTime",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newImplementation",
            "type": "address"
          }
        ],
        "name": "upgradeTo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newImplementation",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "upgradeToAndCall",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ],
    "bytecode": "0x60a06040523060601b60805234801561001757600080fd5b5060805160601c6129c161004b60003960008181610cd801528181610d180152818161101a015261105a01526129c16000f3fe60806040526004361061023b5760003560e01c806375b238fc1161012e578063c1699a99116100ab578063efca2eed1161006f578063efca2eed146106f0578063f5e6393714610707578063f72c0d8b1461071e578063f7c618c114610752578063f959680b1461077257600080fd5b8063c1699a991461066b578063cc1a5b1914610682578063d547741f146106a2578063e07ae092146106c2578063ea1b28e0146106d957600080fd5b80639060688c116100f25780639060688c146105c457806391d14854146105ff578063a217fddf1461061f578063a2e6204514610634578063b40cd21d1461064957600080fd5b806375b238fc1461053e57806378e97925146105605780637b0472f0146105765780637dc2cd9814610596578063817b1cd2146105ad57600080fd5b806334df0796116101bc5780634cd3723a116101805780634cd3723a1461049e5780634e71d92d146104be5780634f1ef286146104d357806351ed6a30146104e65780636b6f4f451461051e57600080fd5b806334df07961461041957806336568abe146104305780633659cfe614610450578063375b3c0a1461047057806349c1cf6e1461048757600080fd5b806324addbbc1161020357806324addbbc14610382578063260c967614610399578063293be456146103b95780632e17de78146103d95780632f2ff15d146103f957600080fd5b80630118acf81461024057806301ffc9a71461026257806306bcf02f1461029757806316934fc4146102b7578063248a9ca314610344575b600080fd5b34801561024c57600080fd5b5061026061025b366004612502565b610788565b005b34801561026e57600080fd5b5061028261027d366004612476565b6108c1565b60405190151581526020015b60405180910390f35b3480156102a357600080fd5b506102606102b2366004612433565b6108f8565b3480156102c357600080fd5b5061030f6102d23660046122fb565b60fb602052600090815260409020805460018201546002830154600384015460048501546005860154600690960154949593949293919290919087565b604080519788526020880196909652948601939093526060850191909152608084015260a083015260c082015260e00161028e565b34801561035057600080fd5b5061037461035f366004612433565b60009081526065602052604090206001015490565b60405190815260200161028e565b34801561038e57600080fd5b506103746101085481565b3480156103a557600080fd5b506102606103b43660046124d7565b610975565b3480156103c557600080fd5b506102606103d4366004612433565b6109a0565b3480156103e557600080fd5b506102606103f4366004612433565b6109d0565b34801561040557600080fd5b5061026061041436600461244b565b610c24565b34801561042557600080fd5b506103746101055481565b34801561043c57600080fd5b5061026061044b36600461244b565b610c4f565b34801561045c57600080fd5b5061026061046b3660046122fb565b610ccd565b34801561047c57600080fd5b506103746101035481565b34801561049357600080fd5b506103746101005481565b3480156104aa57600080fd5b506103746104b93660046122fb565b610d96565b3480156104ca57600080fd5b50610282610e13565b6102606104e1366004612315565b61100f565b3480156104f257600080fd5b5060fc54610506906001600160a01b031681565b6040516001600160a01b03909116815260200161028e565b34801561052a57600080fd5b506102606105393660046123d2565b6110c5565b34801561054a57600080fd5b5061037460008051602061296c83398151915281565b34801561056c57600080fd5b5061037460fe5481565b34801561058257600080fd5b506102606105913660046124b6565b61110e565b3480156105a257600080fd5b506103746101025481565b3480156105b957600080fd5b506103746101095481565b3480156105d057600080fd5b506105e46105df3660046122fb565b61146a565b6040805193845260208401929092529082015260600161028e565b34801561060b57600080fd5b5061028261061a36600461244b565b611521565b34801561062b57600080fd5b50610374600081565b34801561064057600080fd5b5061026061154c565b34801561065557600080fd5b5061065e6115bf565b60405161028e91906127b5565b34801561067757600080fd5b506103746101015481565b34801561068e57600080fd5b5061026061069d366004612433565b6116ac565b3480156106ae57600080fd5b506102606106bd36600461244b565b61172d565b3480156106ce57600080fd5b506103746101065481565b3480156106e557600080fd5b506103746101045481565b3480156106fc57600080fd5b5061037461010a5481565b34801561071357600080fd5b506103746101075481565b34801561072a57600080fd5b506103747f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e381565b34801561075e57600080fd5b5060fd54610506906001600160a01b031681565b34801561077e57600080fd5b5061037460ff5481565b600054610100900460ff16806107a1575060005460ff16155b6107c65760405162461bcd60e51b81526004016107bd90612721565b60405180910390fd5b600054610100900460ff161580156107e8576000805461ffff19166101011790555b6107f0611753565b6107f86117d6565b60fe8a905560ff89905561010088905561010187905561010286905561010385905561010484905560fd80546001600160a01b038086166001600160a01b03199283161790925560fc8054928516929091169190911790556101088a9055610861600033611834565b61087960008051602061296c83398151915233611834565b6108a37f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e333611834565b80156108b5576000805461ff00191690555b50505050505050505050565b60006001600160e01b03198216637965db0b60e01b14806108f257506301ffc9a760e01b6001600160e01b03198316145b92915050565b61091060008051602061296c83398151915233611521565b6109705760405162461bcd60e51b815260206004820152602b60248201527f57515374616b696e673a206f6e6c79206f776e65722063616e206368616e676560448201526a2073746172742074696d6560a81b60648201526084016107bd565b60fe55565b60008051602061296c83398151915261098e813361183e565b50610105929092556101095561010a55565b60008051602061296c8339815191526109b9813361183e565b6109c16118a2565b6101075550426101085560ff55565b6102586109e062015180426128ee565b101580156109fd575062014f286109fa62015180426128ee565b11155b610a195760405162461bcd60e51b81526004016107bd90612688565b61010b5460ff1615610a6d5760405162461bcd60e51b815260206004820152601b60248201527f57515374616b696e673a205265656e7472616e6379206775617264000000000060448201526064016107bd565b61010b805460ff1916600117905533600090815260fb602052604090206006810154421015610aee5760405162461bcd60e51b815260206004820152602760248201527f57515374616b696e673a20596f752063616e6e6f7420756e7374616b6520746f6044820152661ad95b881e595d60ca1b60648201526084016107bd565b8054821115610b4f5760405162461bcd60e51b815260206004820152602760248201527f57515374616b696e673a204e6f7420656e6f75676820746f6b656e7320746f20604482015266756e7374616b6560c81b60648201526084016107bd565b610b5761154c565b670de0b6b3a76400006101055483610b6f9190612875565b610b799190612861565b816001016000828254610b8c9190612849565b9091555050805482908290600090610ba5908490612894565b92505081905550816101096000828254610bbf9190612894565b909155505060fc54610bdb906001600160a01b031633846118e1565b6040805183815242602082015233917f20e2259c6381605e5d17428981162480e1e50fa1d6bf3d53a374741af4973aca910160405180910390a2505061010b805460ff19169055565b600082815260656020526040902060010154610c40813361183e565b610c4a8383611944565b505050565b6001600160a01b0381163314610cbf5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084016107bd565b610cc982826119ca565b5050565b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161415610d165760405162461bcd60e51b81526004016107bd9061263c565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610d48611a31565b6001600160a01b031614610d6e5760405162461bcd60e51b81526004016107bd906126d5565b610d7781611a5f565b60408051600080825260208201909252610d9391839190611a8a565b50565b61010554610109546000919015610e02576000610db16118a2565b905061010654811115610e005760006101065482610dcf9190612894565b61010954909150610de882670de0b6b3a7640000612875565b610df29190612861565b610dfc9084612849565b9250505b505b610e0c8382611bd5565b9392505050565b6000610258610e2562015180426128ee565b10158015610e42575062014f28610e3f62015180426128ee565b11155b610e5e5760405162461bcd60e51b81526004016107bd90612688565b61010b5460ff1615610eb25760405162461bcd60e51b815260206004820152601b60248201527f57515374616b696e673a205265656e7472616e6379206775617264000000000060448201526064016107bd565b61010b805460ff1916600117905533600090815260fb60205260409020610102546005820154610ee29042612894565b11610eff5760405162461bcd60e51b81526004016107bd9061276f565b6101095415610f1057610f1061154c565b6000610f1f3361010554611bd5565b905060008111610f715760405162461bcd60e51b815260206004820152601b60248201527f57515374616b696e673a204e6f7468696e6720746f20636c61696d000000000060448201526064016107bd565b80826003016000828254610f859190612849565b909155505042600583015561010a8054829190600090610fa6908490612849565b909155505060fd54610fc2906001600160a01b031633836118e1565b6040805182815242602082015233917f9a5504b59d017387dcd5f2a9ef1a11e83d7a1b8b56d91c580ad8ee01084aaa00910160405180910390a2505061010b805460ff1916905550600190565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156110585760405162461bcd60e51b81526004016107bd9061263c565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661108a611a31565b6001600160a01b0316146110b05760405162461bcd60e51b81526004016107bd906126d5565b6110b982611a5f565b610cc982826001611a8a565b60008051602061296c8339815191526110de813361183e565b506001600160a01b03909416600090815260fb602052604090209283556001830191909155600282015560030155565b60fe5442116111705760405162461bcd60e51b815260206004820152602860248201527f57515374616b696e673a205374616b696e672074696d6520686173206e6f742060448201526718dbdb59481e595d60c21b60648201526084016107bd565b61025861118062015180426128ee565b1015801561119d575062014f2861119a62015180426128ee565b11155b6111b95760405162461bcd60e51b81526004016107bd90612688565b6101035482101561122b5760405162461bcd60e51b815260206004820152603660248201527f57515374616b696e673a20416d6f756e742073686f756c642062652067726561604482015275746572207468616e206d696e696d756d207374616b6560501b60648201526084016107bd565b33600090815260fb6020526040902061010454815461124a9085612849565b11156112b45760405162461bcd60e51b815260206004820152603360248201527f57515374616b696e673a20416d6f756e742073686f756c64206265206c657373604482015272207468616e206d6178696d756d207374616b6560681b60648201526084016107bd565b806006015442106113565781601e14806112ce575081603c145b806112d9575081605a145b61133b5760405162461bcd60e51b815260206004820152602d60248201527f57515374616b696e673a206475726174696f6e206d7573742062652033302c2060448201526c3630206f72203930206461797360981b60648201526084016107bd565b61134682603c612875565b6113509042612849565b60068201555b6101015460048201546113699042612894565b116113865760405162461bcd60e51b81526004016107bd9061276f565b61010954156113975761139761154c565b60fc546113af906001600160a01b0316333086611c43565b670de0b6b3a764000061010554846113c79190612875565b6113d19190612861565b8160020160008282546113e49190612849565b925050819055508261010960008282546113fe9190612849565b9091555050805483908290600090611417908490612849565b9091555050426004820181905560405133917f6ef4db1c27745f3a9d449371f22e684aa75791b2972945ce80f56932e588e1629161145d91878252602082015260400190565b60405180910390a2505050565b6001600160a01b038116600090815260fb6020526040812080549190819061149185610d96565b60fc546040516370a0823160e01b81526001600160a01b0388811660048301529295508692869216906370a082319060240160206040518083038186803b1580156114db57600080fd5b505afa1580156114ef573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611513919061249e565b935093509350509193909250565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60006115566118a2565b905061010654811115610d9357600061010654826115749190612894565b61010954909150156115b8576101095461159682670de0b6b3a7640000612875565b6115a09190612861565b61010560008282546115b29190612849565b90915550505b5061010655565b61162e60405180610160016040528060008152602001600081526020016000815260200160008152602001600081526020016000815260200160008152602001600081526020016000815260200160006001600160a01b0316815260200160006001600160a01b031681525090565b50604080516101608101825260fe54815260ff5460208201526101008054928201929092526101015460608201526101025460808201526101035460a08201526101045460c08201526101095460e082015261010a549181019190915260fc546001600160a01b0390811661012083015260fd541661014082015290565b6116c460008051602061296c83398151915233611521565b6117275760405162461bcd60e51b815260206004820152602e60248201527f57515374616b696e673a206f6e6c79206f776e65722063616e206368616e676560448201526d2070726f64756365642074696d6560901b60648201526084016107bd565b61010855565b600082815260656020526040902060010154611749813361183e565b610c4a83836119ca565b600054610100900460ff168061176c575060005460ff16155b6117885760405162461bcd60e51b81526004016107bd90612721565b600054610100900460ff161580156117aa576000805461ffff19166101011790555b6117b2611c81565b6117ba611c81565b6117c2611c81565b8015610d93576000805461ff001916905550565b600054610100900460ff16806117ef575060005460ff16155b61180b5760405162461bcd60e51b81526004016107bd90612721565b600054610100900460ff161580156117b2576000805461ffff19166101011790556117ba611c81565b610cc98282611944565b6118488282611521565b610cc957611860816001600160a01b03166014611ceb565b61186b836020611ceb565b60405160200161187c929190612594565b60408051601f198184030181529082905262461bcd60e51b82526107bd91600401612609565b60006101005461010854426118b79190612894565b60ff546118c49190612875565b6118ce9190612861565b610107546118dc9190612849565b905090565b6040516001600160a01b038316602482015260448101829052610c4a90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611ecd565b61194e8282611521565b610cc95760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556119863390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6119d48282611521565b15610cc95760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3610cc9813361183e565b6000611a94611a31565b9050611a9f84611f9f565b600083511180611aac5750815b15611abd57611abb8484612044565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff16611bce57805460ff191660011781556040516001600160a01b0383166024820152611b3c90869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b179052612044565b50805460ff19168155611b4d611a31565b6001600160a01b0316826001600160a01b031614611bc55760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b60648201526084016107bd565b611bce8561212f565b5050505050565b6001600160a01b038216600090815260fb602052604081206002810154600382015460018301548354670de0b6b3a764000090611c13908890612875565b611c1d9190612861565b611c279190612849565b611c319190612894565b611c3b9190612894565b949350505050565b6040516001600160a01b0380851660248301528316604482015260648101829052611c7b9085906323b872dd60e01b9060840161190d565b50505050565b600054610100900460ff1680611c9a575060005460ff16155b611cb65760405162461bcd60e51b81526004016107bd90612721565b600054610100900460ff161580156117c2576000805461ffff19166101011790558015610d93576000805461ff001916905550565b60606000611cfa836002612875565b611d05906002612849565b67ffffffffffffffff811115611d2b57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611d55576020820181803683370190505b509050600360fc1b81600081518110611d7e57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110611dbb57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000611ddf846002612875565b611dea906001612849565b90505b6001811115611e7e576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110611e2c57634e487b7160e01b600052603260045260246000fd5b1a60f81b828281518110611e5057634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c93611e77816128d7565b9050611ded565b508315610e0c5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016107bd565b6000611f22826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b031661216f9092919063ffffffff16565b805190915015610c4a5780806020019051810190611f409190612413565b610c4a5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016107bd565b803b6120035760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b60648201526084016107bd565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b6120a35760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b60648201526084016107bd565b600080846001600160a01b0316846040516120be9190612578565b600060405180830381855af49150503d80600081146120f9576040519150601f19603f3d011682016040523d82523d6000602084013e6120fe565b606091505b509150915061212682826040518060600160405280602781526020016129456027913961217e565b95945050505050565b61213881611f9f565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6060611c3b84846000856121b7565b6060831561218d575081610e0c565b82511561219d5782518084602001fd5b8160405162461bcd60e51b81526004016107bd9190612609565b6060824710156122185760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016107bd565b843b6122665760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016107bd565b600080866001600160a01b031685876040516122829190612578565b60006040518083038185875af1925050503d80600081146122bf576040519150601f19603f3d011682016040523d82523d6000602084013e6122c4565b606091505b50915091506122d482828661217e565b979650505050505050565b80356001600160a01b03811681146122f657600080fd5b919050565b60006020828403121561230c578081fd5b610e0c826122df565b60008060408385031215612327578081fd5b612330836122df565b9150602083013567ffffffffffffffff8082111561234c578283fd5b818501915085601f83011261235f578283fd5b8135818111156123715761237161292e565b604051601f8201601f19908116603f011681019083821181831017156123995761239961292e565b816040528281528860208487010111156123b1578586fd5b82602086016020830137856020848301015280955050505050509250929050565b600080600080600060a086880312156123e9578081fd5b6123f2866122df565b97602087013597506040870135966060810135965060800135945092505050565b600060208284031215612424578081fd5b81518015158114610e0c578182fd5b600060208284031215612444578081fd5b5035919050565b6000806040838503121561245d578182fd5b8235915061246d602084016122df565b90509250929050565b600060208284031215612487578081fd5b81356001600160e01b031981168114610e0c578182fd5b6000602082840312156124af578081fd5b5051919050565b600080604083850312156124c8578182fd5b50508035926020909101359150565b6000806000606084860312156124eb578283fd5b505081359360208301359350604090920135919050565b60008060008060008060008060006101208a8c031215612520578384fd5b8935985060208a0135975060408a0135965060608a0135955060808a0135945060a08a0135935060c08a0135925061255a60e08b016122df565b91506125696101008b016122df565b90509295985092959850929598565b6000825161258a8184602087016128ab565b9190910192915050565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516125cc8160178501602088016128ab565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516125fd8160288401602088016128ab565b01602801949350505050565b60208152600082518060208401526126288160408501602087016128ab565b601f01601f19169190910160400192915050565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602d908201527f57515374616b696e673a204461696c79206c6f636b2066726f6d2032333a353060408201526c20746f2030303a31302055544360981b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526026908201527f57515374616b696e673a20596f752063616e6e6f74207374616b6520746f6b656040820152651b9cc81e595d60d21b606082015260800190565b600061016082019050825182526020830151602083015260408301516040830152606083015160608301526080830151608083015260a083015160a083015260c083015160c083015260e083015160e08301526101008084015181840152506101208084015161282f828501826001600160a01b03169052565b5050610140928301516001600160a01b0316919092015290565b6000821982111561285c5761285c612902565b500190565b60008261287057612870612918565b500490565b600081600019048311821515161561288f5761288f612902565b500290565b6000828210156128a6576128a6612902565b500390565b60005b838110156128c65781810151838201526020016128ae565b83811115611c7b5750506000910152565b6000816128e6576128e6612902565b506000190190565b6000826128fd576128fd612918565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775a26469706673582212208da95ec8a4b7f1405ee628aa19aac8c27f6258141929f5d8d57086ef6525f8d464736f6c63430008040033",
    "deployedBytecode": "0x60806040526004361061023b5760003560e01c806375b238fc1161012e578063c1699a99116100ab578063efca2eed1161006f578063efca2eed146106f0578063f5e6393714610707578063f72c0d8b1461071e578063f7c618c114610752578063f959680b1461077257600080fd5b8063c1699a991461066b578063cc1a5b1914610682578063d547741f146106a2578063e07ae092146106c2578063ea1b28e0146106d957600080fd5b80639060688c116100f25780639060688c146105c457806391d14854146105ff578063a217fddf1461061f578063a2e6204514610634578063b40cd21d1461064957600080fd5b806375b238fc1461053e57806378e97925146105605780637b0472f0146105765780637dc2cd9814610596578063817b1cd2146105ad57600080fd5b806334df0796116101bc5780634cd3723a116101805780634cd3723a1461049e5780634e71d92d146104be5780634f1ef286146104d357806351ed6a30146104e65780636b6f4f451461051e57600080fd5b806334df07961461041957806336568abe146104305780633659cfe614610450578063375b3c0a1461047057806349c1cf6e1461048757600080fd5b806324addbbc1161020357806324addbbc14610382578063260c967614610399578063293be456146103b95780632e17de78146103d95780632f2ff15d146103f957600080fd5b80630118acf81461024057806301ffc9a71461026257806306bcf02f1461029757806316934fc4146102b7578063248a9ca314610344575b600080fd5b34801561024c57600080fd5b5061026061025b366004612502565b610788565b005b34801561026e57600080fd5b5061028261027d366004612476565b6108c1565b60405190151581526020015b60405180910390f35b3480156102a357600080fd5b506102606102b2366004612433565b6108f8565b3480156102c357600080fd5b5061030f6102d23660046122fb565b60fb602052600090815260409020805460018201546002830154600384015460048501546005860154600690960154949593949293919290919087565b604080519788526020880196909652948601939093526060850191909152608084015260a083015260c082015260e00161028e565b34801561035057600080fd5b5061037461035f366004612433565b60009081526065602052604090206001015490565b60405190815260200161028e565b34801561038e57600080fd5b506103746101085481565b3480156103a557600080fd5b506102606103b43660046124d7565b610975565b3480156103c557600080fd5b506102606103d4366004612433565b6109a0565b3480156103e557600080fd5b506102606103f4366004612433565b6109d0565b34801561040557600080fd5b5061026061041436600461244b565b610c24565b34801561042557600080fd5b506103746101055481565b34801561043c57600080fd5b5061026061044b36600461244b565b610c4f565b34801561045c57600080fd5b5061026061046b3660046122fb565b610ccd565b34801561047c57600080fd5b506103746101035481565b34801561049357600080fd5b506103746101005481565b3480156104aa57600080fd5b506103746104b93660046122fb565b610d96565b3480156104ca57600080fd5b50610282610e13565b6102606104e1366004612315565b61100f565b3480156104f257600080fd5b5060fc54610506906001600160a01b031681565b6040516001600160a01b03909116815260200161028e565b34801561052a57600080fd5b506102606105393660046123d2565b6110c5565b34801561054a57600080fd5b5061037460008051602061296c83398151915281565b34801561056c57600080fd5b5061037460fe5481565b34801561058257600080fd5b506102606105913660046124b6565b61110e565b3480156105a257600080fd5b506103746101025481565b3480156105b957600080fd5b506103746101095481565b3480156105d057600080fd5b506105e46105df3660046122fb565b61146a565b6040805193845260208401929092529082015260600161028e565b34801561060b57600080fd5b5061028261061a36600461244b565b611521565b34801561062b57600080fd5b50610374600081565b34801561064057600080fd5b5061026061154c565b34801561065557600080fd5b5061065e6115bf565b60405161028e91906127b5565b34801561067757600080fd5b506103746101015481565b34801561068e57600080fd5b5061026061069d366004612433565b6116ac565b3480156106ae57600080fd5b506102606106bd36600461244b565b61172d565b3480156106ce57600080fd5b506103746101065481565b3480156106e557600080fd5b506103746101045481565b3480156106fc57600080fd5b5061037461010a5481565b34801561071357600080fd5b506103746101075481565b34801561072a57600080fd5b506103747f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e381565b34801561075e57600080fd5b5060fd54610506906001600160a01b031681565b34801561077e57600080fd5b5061037460ff5481565b600054610100900460ff16806107a1575060005460ff16155b6107c65760405162461bcd60e51b81526004016107bd90612721565b60405180910390fd5b600054610100900460ff161580156107e8576000805461ffff19166101011790555b6107f0611753565b6107f86117d6565b60fe8a905560ff89905561010088905561010187905561010286905561010385905561010484905560fd80546001600160a01b038086166001600160a01b03199283161790925560fc8054928516929091169190911790556101088a9055610861600033611834565b61087960008051602061296c83398151915233611834565b6108a37f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e333611834565b80156108b5576000805461ff00191690555b50505050505050505050565b60006001600160e01b03198216637965db0b60e01b14806108f257506301ffc9a760e01b6001600160e01b03198316145b92915050565b61091060008051602061296c83398151915233611521565b6109705760405162461bcd60e51b815260206004820152602b60248201527f57515374616b696e673a206f6e6c79206f776e65722063616e206368616e676560448201526a2073746172742074696d6560a81b60648201526084016107bd565b60fe55565b60008051602061296c83398151915261098e813361183e565b50610105929092556101095561010a55565b60008051602061296c8339815191526109b9813361183e565b6109c16118a2565b6101075550426101085560ff55565b6102586109e062015180426128ee565b101580156109fd575062014f286109fa62015180426128ee565b11155b610a195760405162461bcd60e51b81526004016107bd90612688565b61010b5460ff1615610a6d5760405162461bcd60e51b815260206004820152601b60248201527f57515374616b696e673a205265656e7472616e6379206775617264000000000060448201526064016107bd565b61010b805460ff1916600117905533600090815260fb602052604090206006810154421015610aee5760405162461bcd60e51b815260206004820152602760248201527f57515374616b696e673a20596f752063616e6e6f7420756e7374616b6520746f6044820152661ad95b881e595d60ca1b60648201526084016107bd565b8054821115610b4f5760405162461bcd60e51b815260206004820152602760248201527f57515374616b696e673a204e6f7420656e6f75676820746f6b656e7320746f20604482015266756e7374616b6560c81b60648201526084016107bd565b610b5761154c565b670de0b6b3a76400006101055483610b6f9190612875565b610b799190612861565b816001016000828254610b8c9190612849565b9091555050805482908290600090610ba5908490612894565b92505081905550816101096000828254610bbf9190612894565b909155505060fc54610bdb906001600160a01b031633846118e1565b6040805183815242602082015233917f20e2259c6381605e5d17428981162480e1e50fa1d6bf3d53a374741af4973aca910160405180910390a2505061010b805460ff19169055565b600082815260656020526040902060010154610c40813361183e565b610c4a8383611944565b505050565b6001600160a01b0381163314610cbf5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084016107bd565b610cc982826119ca565b5050565b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161415610d165760405162461bcd60e51b81526004016107bd9061263c565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610d48611a31565b6001600160a01b031614610d6e5760405162461bcd60e51b81526004016107bd906126d5565b610d7781611a5f565b60408051600080825260208201909252610d9391839190611a8a565b50565b61010554610109546000919015610e02576000610db16118a2565b905061010654811115610e005760006101065482610dcf9190612894565b61010954909150610de882670de0b6b3a7640000612875565b610df29190612861565b610dfc9084612849565b9250505b505b610e0c8382611bd5565b9392505050565b6000610258610e2562015180426128ee565b10158015610e42575062014f28610e3f62015180426128ee565b11155b610e5e5760405162461bcd60e51b81526004016107bd90612688565b61010b5460ff1615610eb25760405162461bcd60e51b815260206004820152601b60248201527f57515374616b696e673a205265656e7472616e6379206775617264000000000060448201526064016107bd565b61010b805460ff1916600117905533600090815260fb60205260409020610102546005820154610ee29042612894565b11610eff5760405162461bcd60e51b81526004016107bd9061276f565b6101095415610f1057610f1061154c565b6000610f1f3361010554611bd5565b905060008111610f715760405162461bcd60e51b815260206004820152601b60248201527f57515374616b696e673a204e6f7468696e6720746f20636c61696d000000000060448201526064016107bd565b80826003016000828254610f859190612849565b909155505042600583015561010a8054829190600090610fa6908490612849565b909155505060fd54610fc2906001600160a01b031633836118e1565b6040805182815242602082015233917f9a5504b59d017387dcd5f2a9ef1a11e83d7a1b8b56d91c580ad8ee01084aaa00910160405180910390a2505061010b805460ff1916905550600190565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156110585760405162461bcd60e51b81526004016107bd9061263c565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661108a611a31565b6001600160a01b0316146110b05760405162461bcd60e51b81526004016107bd906126d5565b6110b982611a5f565b610cc982826001611a8a565b60008051602061296c8339815191526110de813361183e565b506001600160a01b03909416600090815260fb602052604090209283556001830191909155600282015560030155565b60fe5442116111705760405162461bcd60e51b815260206004820152602860248201527f57515374616b696e673a205374616b696e672074696d6520686173206e6f742060448201526718dbdb59481e595d60c21b60648201526084016107bd565b61025861118062015180426128ee565b1015801561119d575062014f2861119a62015180426128ee565b11155b6111b95760405162461bcd60e51b81526004016107bd90612688565b6101035482101561122b5760405162461bcd60e51b815260206004820152603660248201527f57515374616b696e673a20416d6f756e742073686f756c642062652067726561604482015275746572207468616e206d696e696d756d207374616b6560501b60648201526084016107bd565b33600090815260fb6020526040902061010454815461124a9085612849565b11156112b45760405162461bcd60e51b815260206004820152603360248201527f57515374616b696e673a20416d6f756e742073686f756c64206265206c657373604482015272207468616e206d6178696d756d207374616b6560681b60648201526084016107bd565b806006015442106113565781601e14806112ce575081603c145b806112d9575081605a145b61133b5760405162461bcd60e51b815260206004820152602d60248201527f57515374616b696e673a206475726174696f6e206d7573742062652033302c2060448201526c3630206f72203930206461797360981b60648201526084016107bd565b61134682603c612875565b6113509042612849565b60068201555b6101015460048201546113699042612894565b116113865760405162461bcd60e51b81526004016107bd9061276f565b61010954156113975761139761154c565b60fc546113af906001600160a01b0316333086611c43565b670de0b6b3a764000061010554846113c79190612875565b6113d19190612861565b8160020160008282546113e49190612849565b925050819055508261010960008282546113fe9190612849565b9091555050805483908290600090611417908490612849565b9091555050426004820181905560405133917f6ef4db1c27745f3a9d449371f22e684aa75791b2972945ce80f56932e588e1629161145d91878252602082015260400190565b60405180910390a2505050565b6001600160a01b038116600090815260fb6020526040812080549190819061149185610d96565b60fc546040516370a0823160e01b81526001600160a01b0388811660048301529295508692869216906370a082319060240160206040518083038186803b1580156114db57600080fd5b505afa1580156114ef573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611513919061249e565b935093509350509193909250565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60006115566118a2565b905061010654811115610d9357600061010654826115749190612894565b61010954909150156115b8576101095461159682670de0b6b3a7640000612875565b6115a09190612861565b61010560008282546115b29190612849565b90915550505b5061010655565b61162e60405180610160016040528060008152602001600081526020016000815260200160008152602001600081526020016000815260200160008152602001600081526020016000815260200160006001600160a01b0316815260200160006001600160a01b031681525090565b50604080516101608101825260fe54815260ff5460208201526101008054928201929092526101015460608201526101025460808201526101035460a08201526101045460c08201526101095460e082015261010a549181019190915260fc546001600160a01b0390811661012083015260fd541661014082015290565b6116c460008051602061296c83398151915233611521565b6117275760405162461bcd60e51b815260206004820152602e60248201527f57515374616b696e673a206f6e6c79206f776e65722063616e206368616e676560448201526d2070726f64756365642074696d6560901b60648201526084016107bd565b61010855565b600082815260656020526040902060010154611749813361183e565b610c4a83836119ca565b600054610100900460ff168061176c575060005460ff16155b6117885760405162461bcd60e51b81526004016107bd90612721565b600054610100900460ff161580156117aa576000805461ffff19166101011790555b6117b2611c81565b6117ba611c81565b6117c2611c81565b8015610d93576000805461ff001916905550565b600054610100900460ff16806117ef575060005460ff16155b61180b5760405162461bcd60e51b81526004016107bd90612721565b600054610100900460ff161580156117b2576000805461ffff19166101011790556117ba611c81565b610cc98282611944565b6118488282611521565b610cc957611860816001600160a01b03166014611ceb565b61186b836020611ceb565b60405160200161187c929190612594565b60408051601f198184030181529082905262461bcd60e51b82526107bd91600401612609565b60006101005461010854426118b79190612894565b60ff546118c49190612875565b6118ce9190612861565b610107546118dc9190612849565b905090565b6040516001600160a01b038316602482015260448101829052610c4a90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611ecd565b61194e8282611521565b610cc95760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556119863390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6119d48282611521565b15610cc95760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b7f189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3610cc9813361183e565b6000611a94611a31565b9050611a9f84611f9f565b600083511180611aac5750815b15611abd57611abb8484612044565b505b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143805460ff16611bce57805460ff191660011781556040516001600160a01b0383166024820152611b3c90869060440160408051601f198184030181529190526020810180516001600160e01b0316631b2ce7f360e11b179052612044565b50805460ff19168155611b4d611a31565b6001600160a01b0316826001600160a01b031614611bc55760405162461bcd60e51b815260206004820152602f60248201527f45524331393637557067726164653a207570677261646520627265616b73206660448201526e75727468657220757067726164657360881b60648201526084016107bd565b611bce8561212f565b5050505050565b6001600160a01b038216600090815260fb602052604081206002810154600382015460018301548354670de0b6b3a764000090611c13908890612875565b611c1d9190612861565b611c279190612849565b611c319190612894565b611c3b9190612894565b949350505050565b6040516001600160a01b0380851660248301528316604482015260648101829052611c7b9085906323b872dd60e01b9060840161190d565b50505050565b600054610100900460ff1680611c9a575060005460ff16155b611cb65760405162461bcd60e51b81526004016107bd90612721565b600054610100900460ff161580156117c2576000805461ffff19166101011790558015610d93576000805461ff001916905550565b60606000611cfa836002612875565b611d05906002612849565b67ffffffffffffffff811115611d2b57634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015611d55576020820181803683370190505b509050600360fc1b81600081518110611d7e57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110611dbb57634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a9053506000611ddf846002612875565b611dea906001612849565b90505b6001811115611e7e576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110611e2c57634e487b7160e01b600052603260045260246000fd5b1a60f81b828281518110611e5057634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c93611e77816128d7565b9050611ded565b508315610e0c5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016107bd565b6000611f22826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b031661216f9092919063ffffffff16565b805190915015610c4a5780806020019051810190611f409190612413565b610c4a5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016107bd565b803b6120035760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b60648201526084016107bd565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80546001600160a01b0319166001600160a01b0392909216919091179055565b6060823b6120a35760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b60648201526084016107bd565b600080846001600160a01b0316846040516120be9190612578565b600060405180830381855af49150503d80600081146120f9576040519150601f19603f3d011682016040523d82523d6000602084013e6120fe565b606091505b509150915061212682826040518060600160405280602781526020016129456027913961217e565b95945050505050565b61213881611f9f565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6060611c3b84846000856121b7565b6060831561218d575081610e0c565b82511561219d5782518084602001fd5b8160405162461bcd60e51b81526004016107bd9190612609565b6060824710156122185760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016107bd565b843b6122665760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016107bd565b600080866001600160a01b031685876040516122829190612578565b60006040518083038185875af1925050503d80600081146122bf576040519150601f19603f3d011682016040523d82523d6000602084013e6122c4565b606091505b50915091506122d482828661217e565b979650505050505050565b80356001600160a01b03811681146122f657600080fd5b919050565b60006020828403121561230c578081fd5b610e0c826122df565b60008060408385031215612327578081fd5b612330836122df565b9150602083013567ffffffffffffffff8082111561234c578283fd5b818501915085601f83011261235f578283fd5b8135818111156123715761237161292e565b604051601f8201601f19908116603f011681019083821181831017156123995761239961292e565b816040528281528860208487010111156123b1578586fd5b82602086016020830137856020848301015280955050505050509250929050565b600080600080600060a086880312156123e9578081fd5b6123f2866122df565b97602087013597506040870135966060810135965060800135945092505050565b600060208284031215612424578081fd5b81518015158114610e0c578182fd5b600060208284031215612444578081fd5b5035919050565b6000806040838503121561245d578182fd5b8235915061246d602084016122df565b90509250929050565b600060208284031215612487578081fd5b81356001600160e01b031981168114610e0c578182fd5b6000602082840312156124af578081fd5b5051919050565b600080604083850312156124c8578182fd5b50508035926020909101359150565b6000806000606084860312156124eb578283fd5b505081359360208301359350604090920135919050565b60008060008060008060008060006101208a8c031215612520578384fd5b8935985060208a0135975060408a0135965060608a0135955060808a0135945060a08a0135935060c08a0135925061255a60e08b016122df565b91506125696101008b016122df565b90509295985092959850929598565b6000825161258a8184602087016128ab565b9190910192915050565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516125cc8160178501602088016128ab565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516125fd8160288401602088016128ab565b01602801949350505050565b60208152600082518060208401526126288160408501602087016128ab565b601f01601f19169190910160400192915050565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602d908201527f57515374616b696e673a204461696c79206c6f636b2066726f6d2032333a353060408201526c20746f2030303a31302055544360981b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b60208082526026908201527f57515374616b696e673a20596f752063616e6e6f74207374616b6520746f6b656040820152651b9cc81e595d60d21b606082015260800190565b600061016082019050825182526020830151602083015260408301516040830152606083015160608301526080830151608083015260a083015160a083015260c083015160c083015260e083015160e08301526101008084015181840152506101208084015161282f828501826001600160a01b03169052565b5050610140928301516001600160a01b0316919092015290565b6000821982111561285c5761285c612902565b500190565b60008261287057612870612918565b500490565b600081600019048311821515161561288f5761288f612902565b500290565b6000828210156128a6576128a6612902565b500390565b60005b838110156128c65781810151838201526020016128ae565b83811115611c7b5750506000910152565b6000816128e6576128e6612902565b506000190190565b6000826128fd576128fd612918565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fdfe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775a26469706673582212208da95ec8a4b7f1405ee628aa19aac8c27f6258141929f5d8d57086ef6525f8d464736f6c63430008040033",
    "linkReferences": {},
    "deployedLinkReferences": {}
  }

]; // WQT

export const WQStaking = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "previousAdmin",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newAdmin",
          "type": "address"
        }
      ],
      "name": "AdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "beacon",
          "type": "address"
        }
      ],
      "name": "BeaconUpgraded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "implementation",
          "type": "address"
        }
      ],
      "name": "Upgraded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "tokensClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "tokensStaked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "tokensUnstaked",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "UPGRADER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "allProduced",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claim",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claimPeriod",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "distributionTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_staker",
          "type": "address"
        }
      ],
      "name": "getClaim",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "reward",
          "type": "uint256"
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
      "name": "getInfoByAddress",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "staked_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "claim_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_balance",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getStakingInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "rewardTotal",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "distributionTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "stakePeriod",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "claimPeriod",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minStake",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxStake",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalStaked",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalDistributed",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "stakeTokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "rewardTokenAddress",
              "type": "address"
            }
          ],
          "internalType": "struct WQStaking.StakeInfo",
          "name": "info_",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
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
          "internalType": "uint256",
          "name": "_startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_rewardTotal",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_distributionTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_stakePeriod",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_claimPeriod",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_minStake",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxStake",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_rewardToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_stakeToken",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxStake",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minStake",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "producedTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rewardProduced",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rewardToken",
      "outputs": [
        {
          "internalType": "contract IERC20Upgradeable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rewardTotal",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_rewardTotal",
          "type": "uint256"
        }
      ],
      "name": "setReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        }
      ],
      "name": "stake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "stakePeriod",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "stakeToken",
      "outputs": [
        {
          "internalType": "contract IERC20Upgradeable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "stakes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "rewardAllowed",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "rewardDebt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "distributed",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "stakedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "claimedAt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "unstakeTime",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "startTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
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
      "inputs": [],
      "name": "tokensPerStake",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalDistributed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalStaked",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "unstake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "update",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_producedTime",
          "type": "uint256"
        }
      ],
      "name": "updateProducedTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_rewardAllowed",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_rewardDebt",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_distributed",
          "type": "uint256"
        }
      ],
      "name": "updateStakerInfo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tps",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_totalStaked",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_totalDistributed",
          "type": "uint256"
        }
      ],
      "name": "updateStakingInfo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_startTimeNew",
          "type": "uint256"
        }
      ],
      "name": "updateStartTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        }
      ],
      "name": "upgradeTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newImplementation",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "upgradeToAndCall",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
];

export const WQStakingNative = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "Claimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "Staked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "Unstaked",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "UPGRADER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "allProduced",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimPeriod",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "distributionTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_staker",
        "type": "address"
      }
    ],
    "name": "getClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getInfoByAddress",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "staked_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "claim_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_balance",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStakingInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardTotal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "distributionTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stakePeriod",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claimPeriod",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minStake",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxStake",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalStaked",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalDistributed",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "rewardTokenAddress",
            "type": "address"
          }
        ],
        "internalType": "struct WQStakingNative.StakeInfo",
        "name": "info_",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
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
        "internalType": "uint256",
        "name": "_startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rewardTotal",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_distributionTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_stakePeriod",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_claimPeriod",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minStake",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxStake",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_rewardToken",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxStake",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "minStake",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "producedTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardProduced",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardToken",
    "outputs": [
      {
        "internalType": "contract IERC20Upgradeable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardTotal",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "setReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stake",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stakePeriod",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "stakes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rewardAllowed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rewardDebt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "distributed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "stakedAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "claimedAt",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "startTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
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
    "inputs": [],
    "name": "tokensPerStake",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDistributed",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalStaked",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "unstake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "update",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rewardAllowed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_rewardDebt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_distributed",
        "type": "uint256"
      }
    ],
    "name": "updateStakerInfo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_tps",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_totalStaked",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_totalDistributed",
        "type": "uint256"
      }
    ],
    "name": "updateStakingInfo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
