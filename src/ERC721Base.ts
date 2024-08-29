import { Address, dataSource } from "@graphprotocol/graph-ts";
import { BatchMinted, Minted } from "../generated/templates/ERC721Base/ERC721Base";
import { Transfer } from "../generated/templates/ERC721Base/ERC721Base";
import { ZERO_ADDRESS, createTransaction} from "./helpers";
import { ERC721_BATCH_MINTED_TYPE, ERC721_BURN_TYPE, ERC721_MINTED_TYPE, ERC721_TRANSFER_TYPE } from "./helpers/transactions";

export function handleMinted(event: Minted): void {
  let appAddress = Address.fromString(dataSource.context().getString("App"));

  createTransaction(event, ERC721_MINTED_TYPE, appAddress);
}

export function handleBatchMinted(event: BatchMinted): void {
  let appAddress = Address.fromString(dataSource.context().getString("App"));

  // TODO: Should we add a transaction for each badge?
  createTransaction(event, ERC721_BATCH_MINTED_TYPE, appAddress);
}

export function handleTransfer(event: Transfer): void {
  const isBurned = event.params.to == ZERO_ADDRESS;
  const type = isBurned ? ERC721_BURN_TYPE : ERC721_TRANSFER_TYPE;
  let appAddress = Address.fromString(dataSource.context().getString("App"));

  createTransaction(event, type, appAddress);
}
