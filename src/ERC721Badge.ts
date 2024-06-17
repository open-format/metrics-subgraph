import { Address, BigInt, dataSource, store } from "@graphprotocol/graph-ts";
import { BatchMinted, ERC721Badge as ERC721BadgeContract, Minted, UpdatedBaseURI, BatchMetadataUpdate } from "../generated/templates/ERC721Badge/ERC721Badge";
import { Transfer } from "../generated/templates/ERC721Badge/ERC721Badge";
import { ZERO_ADDRESS, createTransaction } from "./helpers";
import { ERC721_BADGE_BATCH_MINTED_TYPE, ERC721_BADGE_BURN_TYPE, ERC721_BADGE_MINTED_TYPE, ERC721_BADGE_TRANSFER_TYPE, ERC721_BADGE_UPDATE_TYPE } from "./helpers/transactions";

export function handleMinted(event: Minted): void {
  let appAddress = Address.fromString(dataSource.context().getString("App"));
  let transaction = createTransaction(event, ERC721_BADGE_MINTED_TYPE, appAddress);
  transaction.save();

}

export function handleBatchMinted(event: BatchMinted): void {
  let appAddress = Address.fromString(dataSource.context().getString("App"));
  let transaction = createTransaction(event, ERC721_BADGE_BATCH_MINTED_TYPE, appAddress);
  transaction.save();
}

export function handleTransfer(event: Transfer): void {
  const isBurned = event.params.to == ZERO_ADDRESS;
  const type = isBurned ? ERC721_BADGE_BURN_TYPE : ERC721_BADGE_TRANSFER_TYPE;
  let appAddress = Address.fromString(dataSource.context().getString("App"));

  let transaction = createTransaction(event, type, appAddress);
  transaction.save();
}

export function handleUpdatedBaseURI(event: UpdatedBaseURI): void {
  let appAddress = Address.fromString(dataSource.context().getString("App"));
  let transaction = createTransaction(event, ERC721_BADGE_UPDATE_TYPE, appAddress);
  transaction.save();
}

export function handleBatchMetadataUpdate(event: BatchMetadataUpdate): void {
  //TODO: This event is emitted with UpdatedBaseURI, should we log it too?
}