import { Address, dataSource } from "@graphprotocol/graph-ts";
import { BatchMinted, Minted, TokensLazyMinted, Transfer } from "../generated/templates/ERC721LazyMint/ERC721LazyMint";
import { ZERO_ADDRESS, createTransaction } from "./helpers";
import { ERC721_LAZY_BATCH_MINT_TYPE, ERC721_LAZY_BURN_TYPE, ERC721_LAZY_MINT_LAZY_TYPE, ERC721_LAZY_MINT_TYPE, ERC721_LAZY_TRANSFER_TYPE } from "./helpers/transactions";

export function handleMinted(event: Minted): void {
  let appAddress = Address.fromString(dataSource.context().getString("App"));
  let transaction = createTransaction(event, ERC721_LAZY_MINT_TYPE, appAddress);
  transaction.save();
}

export function handleBatchMinted(event: BatchMinted): void {
  let appAddress = Address.fromString(dataSource.context().getString("App"));
  let transaction = createTransaction(event, ERC721_LAZY_BATCH_MINT_TYPE, appAddress);
  transaction.save();
}

export function handleLazyMint(event: TokensLazyMinted): void {
  let appAddress = Address.fromString(dataSource.context().getString("App"));
  let transaction = createTransaction(event, ERC721_LAZY_MINT_LAZY_TYPE, appAddress);
  transaction.save();
}

export function handleTransfer(event: Transfer): void {
  const isBurned = event.params.to == ZERO_ADDRESS;
  const type = isBurned ? ERC721_LAZY_BURN_TYPE : ERC721_LAZY_TRANSFER_TYPE;
  let appAddress = Address.fromString(dataSource.context().getString("App"));

  let transaction = createTransaction(event, type, appAddress);
  transaction.save();
}
