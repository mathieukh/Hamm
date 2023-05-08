export const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "piggyBankId",
        type: "uint256",
      },
    ],
    name: "PiggyBankCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "piggyBankId",
        type: "uint256",
      },
    ],
    name: "PiggyBankWithdrawed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "piggyBankId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "withdrawerAddress",
        type: "address",
      },
    ],
    name: "changeWithdrawer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "beneficiaryAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "withdrawerAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
    ],
    name: "createNewPiggyBank",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
    ],
    name: "createNewPiggyBankForSender",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "piggyBankId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "depositPiggyBank",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "piggyBankId",
        type: "uint256",
      },
    ],
    name: "getPiggyBankById",
    outputs: [
      {
        internalType: "bool",
        name: "paused",
        type: "bool",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "address",
        name: "tokenContractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "beneficiaryAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "withdrawerAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "beneficiaryAddress",
        type: "address",
      },
    ],
    name: "getPiggyBankIdsForAddress",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPiggyBanksIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "piggyBankId",
        type: "uint256",
      },
    ],
    name: "togglePiggyBank",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "piggyBankId",
        type: "uint256",
      },
    ],
    name: "withdrawalPiggyBank",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
