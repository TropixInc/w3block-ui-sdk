/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Transaction {
    status: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    address: string;
    chainId: number;
    data: TransactionData;
    txHash?: any;
    externalId?: any;
    source: string;
    signedAt?: any;
    expiredAt?: any;
    expireAt: Date;
  }
  
  export type TransactionData =
    | ContractTransactionCallable
    | ContractDeployCallable;
  
  export interface ContractDeployCallable {
    methodName: 'deploy';
    signature: string[];
    bytecode: string;
    argumentValues: any[];
    type: BlockchainCallableEnum.DEPLOYMENT;
  }
  
  export interface ContractTransactionCallable {
    methodName: string;
    arguments: TransactionArgument[];
    argumentValues: any[];
    outputs: any[];
    abi: Abi;
    signature: string;
    contractAddress: string;
    type: BlockchainCallableEnum.TRANSACTION;
    ether?: string;
  }
  
  export interface ContractTransactionCallable {
    methodName: string;
    arguments: TransactionArgument[];
    argumentValues: any[];
    outputs: any[];
    abi: Abi;
    signature: string;
    contractAddress: string;
    type: BlockchainCallableEnum.TRANSACTION;
    ether?: string;
  }
  
  export interface Abi {
    name: string;
    type: string;
    inputs: TransactionInput[];
    outputs: any[];
    payable: boolean;
    constant: boolean;
  }
  
  export interface TransactionInput {
    name: string;
    type: string;
  }
  
  export enum BlockchainCallableEnum {
    CALL = 'call',
    TRANSACTION = 'transaction',
    DEPLOYMENT = 'deployment',
  }
  
  export interface TransactionArgument {
    name: string;
    type: string;
    index: number;
    value: any;
  }
  
  export enum Status {
    PENDING = 'pending',
  }
  
  export interface SigninResponseSocket {
    address: string;
    chainId: number;
    data: Transaction;
    id: string;
    status: Status;
  }
  