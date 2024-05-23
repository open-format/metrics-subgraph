import {log} from "@graphprotocol/graph-ts";
import {
  BatchMinted,
  Minted,
  TokensLazyMinted,
  Transfer,
} from "../generated/templates/ERC721LazyMint/ERC721LazyMint";

import {
  One,
  ZERO_ADDRESS,
  loadOrCreateStats,
  loadOrCreateTransaction,
} from "./helpers";

export function handleMinted(event: Minted): void {
  let transaction = loadOrCreateTransaction(event, "ERC721Drop Mint");
  transaction.save();
  log.debug("*** Transaction ERC721LazyMint: ERC721Drop Mint", []);

  let stats = loadOrCreateStats();
  stats.BadgesMintedTransactions = stats.BadgesMintedTransactions.plus(One);
  stats.save();
}

export function handleBatchMinted(event: BatchMinted): void {
  let transaction = loadOrCreateTransaction(event, "ERC721Drop Batch Mint");
  transaction.save();
  log.debug("*** Transaction ERC721LazyMint: ERC721Drop Batch Mint", []);

  let stats = loadOrCreateStats();
  stats.BadgesMintedTransactions = stats.BadgesMintedTransactions.plus(One);
  stats.save();
}

export function handleLazyMint(event: TokensLazyMinted): void {
  let transaction = loadOrCreateTransaction(event, "ERC721Drop Lazy Mint");
  transaction.save();
  log.debug("*** Transaction ERC721LazyMint: ERC721Drop Lazy Mint", []);
}

export function handleTransfer(event: Transfer): void {
  const isBurned = event.params.to == ZERO_ADDRESS;
  const type = isBurned ? "ERC721Drop Burn" : "ERC721Drop Transfer";

  let transaction = loadOrCreateTransaction(event, type);
  transaction.save();
  log.debug("*** Transaction ERC721LazyMint: {}", [type]);

  let stats = loadOrCreateStats();
  stats.BadgesTransferredTransactions =
    stats.BadgesTransferredTransactions.plus(One);
  stats.save();
}
