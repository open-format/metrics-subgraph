import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { Transaction, TransactionAppStat, TransactionStat, TransactionTypeAppStat, TransactionTypeStat, TransactionTypeUserAppStat, TransactionTypeUserStat, TransactionUserAppStat, TransactionUserStat, User } from "../../generated/schema";
import { GLOBAL_TRANSACTION_STAT_ID, isAppType } from "./transactions";

export function createTransaction(event: ethereum.Event, type: string, appAddress: Address): void {
  let user = loadOrCreateUser(event.transaction.from, event);
  user.save();

  // ${transaction_hash}-${transaction_log_index}
  // We need to make transactionLogIndex part of the id because several events can
  // come in the same transaction, even events of same type.
  let transaction = new Transaction(event.transaction.hash.toHex().concat('-').concat(event.transactionLogIndex.toHex()));
  transaction.timestamp = event.block.timestamp.toI64();
  transaction.type = type;
  transaction.userId = user.id;
  transaction.appId = appAddress.toHex();
  transaction.gasUsed = event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0);
  transaction.createdAt = event.block.timestamp;
  transaction.createdAtBlock = event.block.number;
  transaction.save();

  if (isAppType(type)) {
    createOrUpdateTransactionStat(event);
    createOrUpdateTransactionTypeStat(event, type);
    createOrUpdateTransactionTypeAppStat(event, type, appAddress);
    createOrUpdateTransactionTypeUserStat(event, type);
    createOrUpdateTransactionTypeUserAppStat(event, type, appAddress);
    createOrUpdateTransactionAppStat(event, appAddress);
    createOrUpdateTransactionUserStat(event);
    createOrUpdateTransactionUserAppStat(event, appAddress);
  }
}

export function createOrUpdateTransactionStat(event: ethereum.Event): void {
  const id = GLOBAL_TRANSACTION_STAT_ID;
  let stat = TransactionStat.load(id);
  if (!stat) {
    stat = new TransactionStat(GLOBAL_TRANSACTION_STAT_ID)
    stat.createdAt = event.block.timestamp;
    stat.createdAtBlock = event.block.number;
    stat.totalCount = 0;
    stat.totalGasUsed = BigInt.fromI32(0);
  }
  stat.updatedAt = event.block.timestamp;
  stat.updatedAtBlock = event.block.number;
  stat.totalCount = stat.totalCount + 1;
  stat.totalGasUsed = stat.totalGasUsed.plus(event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0));
  stat.save();
}

export function createOrUpdateTransactionTypeStat(event: ethereum.Event, type: string): void {
  const id = type;
  let stat = TransactionTypeStat.load(id);
  if (!stat) {
    stat = new TransactionTypeStat(id)
    stat.createdAt = event.block.timestamp;
    stat.createdAtBlock = event.block.number;
    stat.totalCount = 0;
    stat.totalGasUsed = BigInt.fromI32(0);
  }
  
  stat.type = type;

  stat.updatedAt = event.block.timestamp;
  stat.updatedAtBlock = event.block.number;
  stat.totalCount = stat.totalCount + 1;
  stat.totalGasUsed = stat.totalGasUsed.plus(event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0));
  stat.save();
}

export function createOrUpdateTransactionTypeAppStat(event: ethereum.Event, type: string, appAddress: Address): void {
  const appId = appAddress.toHex();
  const id = type.concat("-").concat(appId);
  let stat = TransactionTypeAppStat.load(id);
  if (!stat) {
    stat = new TransactionTypeAppStat(id)
    stat.createdAt = event.block.timestamp;
    stat.createdAtBlock = event.block.number;
    stat.totalCount = 0;
    stat.totalGasUsed = BigInt.fromI32(0);
  }
  
  stat.type = type;
  stat.appId = appId;
  
  stat.updatedAt = event.block.timestamp;
  stat.updatedAtBlock = event.block.number;
  stat.totalCount = stat.totalCount + 1;
  stat.totalGasUsed = stat.totalGasUsed.plus(event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0));
  stat.save();
}

export function createOrUpdateTransactionTypeUserStat(event: ethereum.Event, type: string): void {
  const userId = event.transaction.from.toHex();
  const id = type.concat("-").concat(userId);
  let stat = TransactionTypeUserStat.load(id);
  if (!stat) {
    stat = new TransactionTypeUserStat(id)
    stat.createdAt = event.block.timestamp;
    stat.createdAtBlock = event.block.number;
    stat.totalCount = 0;
    stat.totalGasUsed = BigInt.fromI32(0);
  }

  stat.type = type;
  stat.userId = userId;
  
  stat.updatedAt = event.block.timestamp;
  stat.updatedAtBlock = event.block.number;
  stat.totalCount = stat.totalCount + 1;
  stat.totalGasUsed = stat.totalGasUsed.plus(event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0));
  stat.save();
}

export function createOrUpdateTransactionTypeUserAppStat(event: ethereum.Event, type: string, appAddress: Address): void {
  const userId = event.transaction.from.toHex();
  const appId = appAddress.toHex();
  const id = type.concat("-").concat(userId).concat("-").concat(appId);
  let stat = TransactionTypeUserAppStat.load(id);
  if (!stat) {
    stat = new TransactionTypeUserAppStat(id)
    stat.createdAt = event.block.timestamp;
    stat.createdAtBlock = event.block.number;
    stat.totalCount = 0;
    stat.totalGasUsed = BigInt.fromI32(0);
  }

  stat.type = type;
  stat.userId = userId;
  stat.appId = appId;
  
  stat.updatedAt = event.block.timestamp;
  stat.updatedAtBlock = event.block.number;
  stat.totalCount = stat.totalCount + 1;
  stat.totalGasUsed = stat.totalGasUsed.plus(event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0));
  stat.save();
}

export function createOrUpdateTransactionAppStat(event: ethereum.Event, appAddress: Address): void {
  const appId = appAddress.toHex();
  const id = appId;
  let stat = TransactionAppStat.load(id);
  if (!stat) {
    stat = new TransactionAppStat(id)
    stat.createdAt = event.block.timestamp;
    stat.createdAtBlock = event.block.number;
    stat.totalCount = 0;
    stat.totalGasUsed = BigInt.fromI32(0);
  }

  stat.appId = appId;
  
  stat.updatedAt = event.block.timestamp;
  stat.updatedAtBlock = event.block.number;
  stat.totalCount = stat.totalCount + 1;
  stat.totalGasUsed = stat.totalGasUsed.plus(event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0));
  stat.save();
}

export function createOrUpdateTransactionUserStat(event: ethereum.Event): void {
  const userId = event.transaction.from.toHex();
  const id = userId;
  let stat = TransactionUserStat.load(id);
  if (!stat) {
    stat = new TransactionUserStat(id)
    stat.createdAt = event.block.timestamp;
    stat.createdAtBlock = event.block.number;
    stat.totalCount = 0;
    stat.totalGasUsed = BigInt.fromI32(0);
  }

  stat.userId = userId;
  
  stat.updatedAt = event.block.timestamp;
  stat.updatedAtBlock = event.block.number;
  stat.totalCount = stat.totalCount + 1;
  stat.totalGasUsed = stat.totalGasUsed.plus(event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0));
  stat.save();
}

export function createOrUpdateTransactionUserAppStat(event: ethereum.Event, appAddress: Address): void {
  const userId = event.transaction.from.toHex();
  const appId = appAddress.toHex();
  const id = userId.concat("-").concat(appId);
  let stat = TransactionUserAppStat.load(id);
  if (!stat) {
    stat = new TransactionUserAppStat(id)
    stat.createdAt = event.block.timestamp;
    stat.createdAtBlock = event.block.number;
    stat.totalCount = 0;
    stat.totalGasUsed = BigInt.fromI32(0);
  }

  stat.userId = userId;
  stat.appId = appId;
  
  stat.updatedAt = event.block.timestamp;
  stat.updatedAtBlock = event.block.number;
  stat.totalCount = stat.totalCount + 1;
  stat.totalGasUsed = stat.totalGasUsed.plus(event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0));
  stat.save();
}


export function loadOrCreateUser(userAddress: Address, event: ethereum.Event): User {
  let user = loadUser(userAddress);
  if (!user) {
    user = createUser(userAddress, event);
  }
  return user as User;
}

export function createUser(userAddress: Address, event: ethereum.Event): User {
  const id = userAddress.toHex();
  let user = new User(id);
  user.createdAt = event.block.timestamp;
  user.createdAtBlock = event.block.number;

  return user as User;
}

export function loadUser(userAddress: Address): User | null{
  const id = userAddress.toHex();
  let user = User.load(id);

  return user;
}
