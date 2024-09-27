import { Address, ethereum } from "@graphprotocol/graph-ts";
import { EventAppStat, EventStat, EventTypeAppStat, EventTypeStat, EventTypeUserAppStat, EventTypeUserStat, EventUserAppStat, EventUserStat } from "../../generated/schema";
import { GLOBAL_EVENT_STAT_ID } from "./transactions";

export function createOrUpdateEventStat(event: ethereum.Event): void {
    const id = GLOBAL_EVENT_STAT_ID;
    let stat = EventStat.load(id);
    if (!stat) {
        stat = new EventStat(GLOBAL_EVENT_STAT_ID)
        stat.createdAt = event.block.timestamp;
        stat.createdAtBlock = event.block.number;
        stat.totalCount = 0;
    }
    stat.updatedAt = event.block.timestamp;
    stat.updatedAtBlock = event.block.number;
    stat.totalCount = stat.totalCount + 1;
    stat.save();
}

export function createOrUpdateEventTypeStat(event: ethereum.Event, eventType: string): void {
    const id = eventType;
    let stat = EventTypeStat.load(id);
    if (!stat) {
        stat = new EventTypeStat(id)
        stat.createdAt = event.block.timestamp;
        stat.createdAtBlock = event.block.number;
        stat.totalCount = 0;
    }

    stat.eventType = eventType;

    stat.updatedAt = event.block.timestamp;
    stat.updatedAtBlock = event.block.number;
    stat.totalCount = stat.totalCount + 1;
    stat.save();
}

export function createOrUpdateEventTypeAppStat(event: ethereum.Event, eventType: string, appAddress: Address): void {
    const appId = appAddress.toHex();
    const id = eventType.concat("-").concat(appId);
    let stat = EventTypeAppStat.load(id);
    if (!stat) {
        stat = new EventTypeAppStat(id)
        stat.createdAt = event.block.timestamp;
        stat.createdAtBlock = event.block.number;
        stat.totalCount = 0;
    }

    stat.eventType = eventType;
    stat.appId = appId;

    stat.updatedAt = event.block.timestamp;
    stat.updatedAtBlock = event.block.number;
    stat.totalCount = stat.totalCount + 1;
    stat.save();
}

export function createOrUpdateEventTypeUserStat(event: ethereum.Event, eventType: string): void {
    const userId = event.transaction.from.toHex();
    const id = eventType.concat("-").concat(userId);
    let stat = EventTypeUserStat.load(id);
    if (!stat) {
        stat = new EventTypeUserStat(id)
        stat.createdAt = event.block.timestamp;
        stat.createdAtBlock = event.block.number;
        stat.totalCount = 0;
    }

    stat.eventType = eventType;
    stat.userId = userId;

    stat.updatedAt = event.block.timestamp;
    stat.updatedAtBlock = event.block.number;
    stat.totalCount = stat.totalCount + 1;
    stat.save();
}

export function createOrUpdateEventTypeUserAppStat(event: ethereum.Event, eventType: string, appAddress: Address): void {
    const userId = event.transaction.from.toHex();
    const appId = appAddress.toHex();
    const id = eventType.concat("-").concat(userId).concat("-").concat(appId);
    let stat = EventTypeUserAppStat.load(id);
    if (!stat) {
        stat = new EventTypeUserAppStat(id)
        stat.createdAt = event.block.timestamp;
        stat.createdAtBlock = event.block.number;
        stat.totalCount = 0;
    }

    stat.eventType = eventType;
    stat.userId = userId;
    stat.appId = appId;

    stat.updatedAt = event.block.timestamp;
    stat.updatedAtBlock = event.block.number;
    stat.totalCount = stat.totalCount + 1;
    stat.save();
}

export function createOrUpdateEventAppStat(event: ethereum.Event, appAddress: Address): void {
    const appId = appAddress.toHex();
    const id = appId;
    let stat = EventAppStat.load(id);
    if (!stat) {
        stat = new EventAppStat(id)
        stat.createdAt = event.block.timestamp;
        stat.createdAtBlock = event.block.number;
        stat.totalCount = 0;
    }

    stat.appId = appId;

    stat.updatedAt = event.block.timestamp;
    stat.updatedAtBlock = event.block.number;
    stat.totalCount = stat.totalCount + 1;
    stat.save();
}

export function createOrUpdateEventUserStat(event: ethereum.Event): void {
    const userId = event.transaction.from.toHex();
    const id = userId;
    let stat = EventUserStat.load(id);
    if (!stat) {
        stat = new EventUserStat(id)
        stat.createdAt = event.block.timestamp;
        stat.createdAtBlock = event.block.number;
        stat.totalCount = 0;
    }

    stat.userId = userId;

    stat.updatedAt = event.block.timestamp;
    stat.updatedAtBlock = event.block.number;
    stat.totalCount = stat.totalCount + 1;
    stat.save();
}

export function createOrUpdateEventUserAppStat(event: ethereum.Event, appAddress: Address): void {
    const userId = event.transaction.from.toHex();
    const appId = appAddress.toHex();
    const id = userId.concat("-").concat(appId);
    let stat = EventUserAppStat.load(id);
    if (!stat) {
        stat = new EventUserAppStat(id)
        stat.createdAt = event.block.timestamp;
        stat.createdAtBlock = event.block.number;
        stat.totalCount = 0;
    }

    stat.userId = userId;
    stat.appId = appId;

    stat.updatedAt = event.block.timestamp;
    stat.updatedAtBlock = event.block.number;
    stat.totalCount = stat.totalCount + 1;
    stat.save();
}
