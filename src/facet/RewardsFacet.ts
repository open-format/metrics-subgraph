import {log} from "@graphprotocol/graph-ts";
import {
  TokenMinted,
  BadgeMinted,
} from "../../generated/templates/RewardsFacet/RewardsFacet";
import {loadOrCreateTransaction} from "../helpers";

export function handleTokenMinted(event: TokenMinted): void {
  //log.debug("*** Transaction RewardsFacet: Reward XP", []);
  let transaction = loadOrCreateTransaction(event, "Reward XP");
  transaction.save();
}

export function handleTokenTransferred(event: BadgeMinted): void {}

export function handleBadgeMinted(event: BadgeMinted): void {
  //log.debug("*** Transaction RewardsFacet: Reward Badge", []);
  let transaction = loadOrCreateTransaction(event, "Reward Badge");
  transaction.save();
}

export function handleBadgeTransferred(): void {}
