import { DataSourceContext, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Created } from "../generated/AppFactory/AppFactory";
import { ERC20FactoryFacet, ERC721FactoryFacet, RewardsFacet } from "../generated/templates";
import { createTransaction, secondsInHour } from "./helpers";
import { APP_CREATE_TYPE } from "./helpers/transactions";
import { Timestamp } from "../generated/schema";

export function handleCreated(event: Created): void {
  let context = new DataSourceContext();
  context.setString("App", event.params.id.toHex());

  ERC721FactoryFacet.createWithContext(event.params.id, context);
  ERC20FactoryFacet.createWithContext(event.params.id, context);
  RewardsFacet.createWithContext(event.params.id, context);

  createTransaction(event, APP_CREATE_TYPE, event.params.id);
}

export function handleBlock(block: ethereum.Block): void {
  // floor timestamp to previous hour
  let hourTimestamp = block.timestamp.div(secondsInHour).times(secondsInHour);

  let exists = Timestamp.load(hourTimestamp.toString());
  if(!exists){
    let timestamp = new Timestamp(hourTimestamp.toString());
    timestamp.blockNumber = block.number;
    timestamp.save();
  }
}