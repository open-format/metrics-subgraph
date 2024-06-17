import { DataSourceContext } from "@graphprotocol/graph-ts";
import { Created } from "../generated/AppFactory/AppFactory";
import { ERC20FactoryFacet, ERC721FactoryFacet, RewardsFacet } from "../generated/templates";
import { createTransaction } from "./helpers";
import { APP_CREATE_TYPE } from "./helpers/transactions";

export function handleCreated(event: Created): void {
  let context = new DataSourceContext();
  context.setString("App", event.params.id.toHex());

  ERC721FactoryFacet.createWithContext(event.params.id, context);
  ERC20FactoryFacet.createWithContext(event.params.id, context);
  RewardsFacet.createWithContext(event.params.id, context);

  let transaction = createTransaction(event, APP_CREATE_TYPE, event.params.id);
  transaction.save();
}
