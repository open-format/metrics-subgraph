import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { TransactionAppStat, TransactionStat, TransactionTypeAppStat, TransactionTypeStat, TransactionTypeUserAppStat, TransactionTypeUserStat, TransactionUserAppStat, TransactionUserStat } from "../../generated/schema";
import { GLOBAL_TRANSACTION_STAT_ID } from "./transactions";

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

export function createOrUpdateTransactionTypeStat(event: ethereum.Event, transactionType: string): void {
    const id = transactionType;
    let stat = TransactionTypeStat.load(id);
    if (!stat) {
        stat = new TransactionTypeStat(id)
        stat.createdAt = event.block.timestamp;
        stat.createdAtBlock = event.block.number;
        stat.totalCount = 0;
        stat.totalGasUsed = BigInt.fromI32(0);
    }

    stat.transactionType = transactionType;

    stat.updatedAt = event.block.timestamp;
    stat.updatedAtBlock = event.block.number;
    stat.totalCount = stat.totalCount + 1;
    stat.totalGasUsed = stat.totalGasUsed.plus(event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0));
    stat.save();
}

export function createOrUpdateTransactionTypeAppStat(event: ethereum.Event, transactionType: string, appAddress: Address): void {
    const appId = appAddress.toHex();
    const id = transactionType.concat("-").concat(appId);
    let stat = TransactionTypeAppStat.load(id);
    if (!stat) {
        stat = new TransactionTypeAppStat(id)
        stat.createdAt = event.block.timestamp;
        stat.createdAtBlock = event.block.number;
        stat.totalCount = 0;
        stat.totalGasUsed = BigInt.fromI32(0);
    }

    stat.transactionType = transactionType;
    stat.appId = appId;

    stat.updatedAt = event.block.timestamp;
    stat.updatedAtBlock = event.block.number;
    stat.totalCount = stat.totalCount + 1;
    stat.totalGasUsed = stat.totalGasUsed.plus(event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0));
    stat.save();
}

export function createOrUpdateTransactionTypeUserStat(event: ethereum.Event, transactionType: string): void {
    const userId = event.transaction.from.toHex();
    const id = transactionType.concat("-").concat(userId);
    let stat = TransactionTypeUserStat.load(id);
    if (!stat) {
        stat = new TransactionTypeUserStat(id)
        stat.createdAt = event.block.timestamp;
        stat.createdAtBlock = event.block.number;
        stat.totalCount = 0;
        stat.totalGasUsed = BigInt.fromI32(0);
    }

    stat.transactionType = transactionType;
    stat.userId = userId;

    stat.updatedAt = event.block.timestamp;
    stat.updatedAtBlock = event.block.number;
    stat.totalCount = stat.totalCount + 1;
    stat.totalGasUsed = stat.totalGasUsed.plus(event.receipt ? event.receipt!.gasUsed : BigInt.fromI32(0));
    stat.save();
}

export function createOrUpdateTransactionTypeUserAppStat(event: ethereum.Event, transactionType: string, appAddress: Address): void {
    const userId = event.transaction.from.toHex();
    const appId = appAddress.toHex();
    const id = transactionType.concat("-").concat(userId).concat("-").concat(appId);
    let stat = TransactionTypeUserAppStat.load(id);
    if (!stat) {
        stat = new TransactionTypeUserAppStat(id)
        stat.createdAt = event.block.timestamp;
        stat.createdAtBlock = event.block.number;
        stat.totalCount = 0;
        stat.totalGasUsed = BigInt.fromI32(0);
    }

    stat.transactionType = transactionType;
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
