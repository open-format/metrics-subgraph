import {Address, DataSourceContext, dataSource} from "@graphprotocol/graph-ts";
import {ERC721Badge, ERC721Base, ERC721LazyMint} from "../../generated/templates";
import {Created} from "../../generated/templates/ERC721FactoryFacet/ERC721Factory";
import { createTransaction } from "../helpers";
import { BADGE_CREATE_TYPE } from "../helpers/transactions";

export function handleCreated(event: Created): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  let erc721Context = new DataSourceContext();
  erc721Context.setString("App", appAddress.toHex());

  let implementationId = event.params.implementationId.toString();
  if (implementationId == "LazyMint") {
    ERC721LazyMint.createWithContext(event.params.id, erc721Context);
  } else if (implementationId == "Badge") {
    ERC721Badge.createWithContext(event.params.id, erc721Context);
  } else {
    ERC721Base.createWithContext(event.params.id, erc721Context);
  }

  createTransaction(event, BADGE_CREATE_TYPE, appAddress);
}
