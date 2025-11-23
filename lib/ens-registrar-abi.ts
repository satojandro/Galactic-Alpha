/**
 * ABI for GalacticSubnameRegistrar contract
 */
export const GALACTIC_SUBNAME_REGISTRAR_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'label',
        type: 'string',
      },
    ],
    name: 'mintSubname',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'label',
        type: 'string',
      },
    ],
    name: 'isAvailable',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'label',
        type: 'string',
      },
    ],
    name: 'isMinted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalMinted',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getInfo',
    outputs: [
      {
        internalType: 'address',
        name: 'wrapper',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'parent',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'adminAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'mintedCount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'parentOwner',
        type: 'address',
      },
    ],
    name: 'isContractApproved',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'isMinted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'string',
        name: 'label',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'fullName',
        type: 'string',
      },
    ],
    name: 'SubnameMinted',
    type: 'event',
  },
] as const

