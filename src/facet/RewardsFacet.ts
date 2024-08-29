import {Address, dataSource, log} from "@graphprotocol/graph-ts";
import { TokenMinted, BadgeMinted, BadgeTransferred, TokenTransferred } from "../../generated/templates/RewardsFacet/RewardsFacet";
import { createTransaction } from "../helpers";
import { BADGE_MINT_TYPE, BADGE_TRANSFER_TYPE, TOKEN_MINT_TYPE, TOKEN_TRANSFER_TYPE } from "../helpers/transactions";

export function handleTokenMinted(event: TokenMinted): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  createTransaction(event, TOKEN_MINT_TYPE, appAddress);
}

export function handleTokenTransferred(event: TokenTransferred): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  createTransaction(event, TOKEN_TRANSFER_TYPE, appAddress);
}

export function handleBadgeMinted(event: BadgeMinted): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  createTransaction(event, BADGE_MINT_TYPE, appAddress);
}

export function handleBadgeTransferred(event: BadgeTransferred): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  createTransaction(event, BADGE_TRANSFER_TYPE, appAddress);
}
