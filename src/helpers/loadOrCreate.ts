import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Event, Transaction, User } from "../../generated/schema";
import { getTransactionType, TRANSACTION_TYPE_UNKNOWN } from "./transactions";
import { createOrUpdateTransactionAppStat, createOrUpdateTransactionStat, createOrUpdateTransactionTypeAppStat, createOrUpdateTransactionTypeStat, createOrUpdateTransactionTypeUserAppStat, createOrUpdateTransactionTypeUserStat, createOrUpdateTransactionUserAppStat, createOrUpdateTransactionUserStat } from "./createOrUpdateTransaction";
import { createOrUpdateEventAppStat, createOrUpdateEventStat, createOrUpdateEventTypeAppStat, createOrUpdateEventTypeStat, createOrUpdateEventTypeUserAppStat, createOrUpdateEventTypeUserStat, createOrUpdateEventUserAppStat, createOrUpdateEventUserStat } from "./createOrUpdateEvent";

export function createTransaction(event: ethereum.Event, eventType: string, appAddress: Address): void {
  let user = loadOrCreateUser(event.transaction.from, event);
  user.save();

  let transaction = Transaction.load(event.transaction.hash.toHex());

  // If transaction exists, we already collected stats for it.
  if (!transaction) {
    const functionSelector = event.transaction.input.toHexString().slice(0, 10);
    const transactionType = getTransactionType(functionSelector)
    transaction = new Transaction(event.transaction.hash.toHex());
    transaction.userId = user.id;
    transaction.appId = appAddress.toHex();
    transaction.gasUsed = event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0);
    transaction.gasPrice = event.transaction.gasPrice;
    transaction.createdAt = event.block.timestamp;
    transaction.createdAtBlock = event.block.number;
    transaction.transactionType = transactionType;
    transaction.functionSelector = functionSelector;
    transaction.save();

    // Collect stats only for know transaction types
    // Do we trigger handled events outside these transaction types?
    if (transactionType != TRANSACTION_TYPE_UNKNOWN) {
      createOrUpdateTransactionStat(event);
      createOrUpdateTransactionTypeStat(event, transactionType);
      createOrUpdateTransactionTypeAppStat(event, transactionType, appAddress);
      createOrUpdateTransactionTypeUserStat(event, transactionType);
      createOrUpdateTransactionTypeUserAppStat(event, transactionType, appAddress);
      createOrUpdateTransactionAppStat(event, appAddress);
      createOrUpdateTransactionUserStat(event);
      createOrUpdateTransactionUserAppStat(event, appAddress);
    }
  }

  // Event Id: transaction_hash-eventLogIndexInTransaction
  let transactionEvent = new Event(event.transaction.hash.toHex().concat('-').concat(event.transactionLogIndex.toHex()));
  transactionEvent.transaction = transaction.id;
  transactionEvent.eventType = eventType;
  transactionEvent.userId = user.id;
  transactionEvent.appId = appAddress.toHex();
  transactionEvent.createdAt = event.block.timestamp;
  transactionEvent.createdAtBlock = event.block.number;
  transactionEvent.save();

  // Save event stats
  createOrUpdateEventStat(event);
  createOrUpdateEventTypeStat(event, eventType);
  createOrUpdateEventTypeAppStat(event, eventType, appAddress);
  createOrUpdateEventTypeUserStat(event, eventType);
  createOrUpdateEventTypeUserAppStat(event, eventType, appAddress);
  createOrUpdateEventAppStat(event, appAddress);
  createOrUpdateEventUserStat(event);
  createOrUpdateEventUserAppStat(event, appAddress);
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

export function loadUser(userAddress: Address): User | null {
  const id = userAddress.toHex();
  let user = User.load(id);

  return user;
}
