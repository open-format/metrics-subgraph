import {DataSourceContext} from "@graphprotocol/graph-ts";
import {Created} from "../generated/AppFactory/AppFactory";
import {
  ERC20FactoryFacet,
  ERC721FactoryFacet,
  RewardsFacet,
} from "../generated/templates";
import {One, loadOrCreateStats, loadOrCreateTransaction} from "./helpers";

export function handleCreated(event: Created): void {
  let context = new DataSourceContext();
  context.setString("App", event.params.id.toHex());

  ERC721FactoryFacet.createWithContext(event.params.id, context);
  ERC20FactoryFacet.createWithContext(event.params.id, context);
  RewardsFacet.createWithContext(event.params.id, context);

  let transaction = loadOrCreateTransaction(event, "Create dApp");
  transaction.save();

  let stats = loadOrCreateStats();
  stats.appCount = stats.appCount.plus(One);
  stats.save();
}
