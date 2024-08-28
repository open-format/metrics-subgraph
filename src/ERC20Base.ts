import { Address, dataSource } from "@graphprotocol/graph-ts";
import { ContractURIUpdated, Transfer } from "../generated/templates/ERC20Base/ERC20Base";
import { ZERO_ADDRESS, createTransaction } from "./helpers";
import { ERC20_BURN_TYPE, ERC20_MINT_TYPE, ERC20_TRANSFER_TYPE, ERC20_UPDATE_TYPE } from "./helpers/transactions";


export function handleTransfer(event: Transfer): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));

  const isMinted = event.params.from == ZERO_ADDRESS;
  const isBurned = event.params.to == ZERO_ADDRESS;

  const type = isMinted
    ? ERC20_MINT_TYPE
    : isBurned
    ? ERC20_BURN_TYPE
    : ERC20_TRANSFER_TYPE;

  createTransaction(event, type, appAddress);
}

export function handleContractURIUpdated(event: ContractURIUpdated): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));

  createTransaction(event, ERC20_UPDATE_TYPE, appAddress);
}
