import {
  TokenMinted,
  BadgeMinted,
} from "../../generated/templates/RewardsFacet/RewardsFacet";
import {loadOrCreateTransaction} from "../helpers";

export function handleTokenMinted(event: TokenMinted): void {
  let transaction = loadOrCreateTransaction(event, "Reward XP");
  transaction.save();
}

export function handleTokenTransferred(): void {}

export function handleBadgeMinted(event: BadgeMinted): void {
  let transaction = loadOrCreateTransaction(event, "Reward Badge");
  transaction.save();
}

export function handleBadgeTransferred(): void {}
 