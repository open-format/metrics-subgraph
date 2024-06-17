import {Address, dataSource, log} from "@graphprotocol/graph-ts";
import {
  TokenMinted,
  BadgeMinted,
} from "../../generated/templates/RewardsFacet/RewardsFacet";
import {
  loadOrCreateTransaction,
  loadOrCreateAppStats,
  loadOrCreateUser,
  One,
} from "../helpers";

let context = dataSource.context();
let appAddress = Address.fromString(context.getString("App"));

export function handleTokenMinted(event: TokenMinted): void {
  let user = loadOrCreateUser(event.params.to, event);
  let appStats = loadOrCreateAppStats(appAddress, event);

  log.debug("app stats user id: {}", [user.id]);

  if (appStats.uniqueUsers == null) {
    appStats.uniqueUsers = new Array<string>();
  }

  let uniqueUsers = appStats.uniqueUsers as Array<string>;

  if (uniqueUsers.indexOf(user.id) == -1) {
    uniqueUsers.push(user.id);
    appStats.uniqueUsersCount = appStats.uniqueUsersCount.plus(One);
  }
  appStats.uniqueUsers = uniqueUsers;

  let transaction = loadOrCreateTransaction(event, "Reward XP");
  transaction.save();
}

export function handleTokenTransferred(event: BadgeMinted): void {}

export function handleBadgeMinted(event: BadgeMinted): void {
  let transaction = loadOrCreateTransaction(event, "Reward Badge");
  transaction.save();
}

export function handleBadgeTransferred(): void {}
