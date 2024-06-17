import { Address, DataSourceContext, dataSource } from "@graphprotocol/graph-ts";
import { Created } from "../../generated/templates/ERC20FactoryFacet/ERC20FactoryFacet";
import { createTransaction } from "../helpers";
import { ERC20_CREATE_TYPE } from "../helpers/transactions";
import { ERC20Base } from "../../generated/templates";

export function handleCreated(event: Created): void {
  let context = dataSource.context();
  let appAddress = Address.fromString(context.getString("App"));
  let erc20Context = new DataSourceContext();

  erc20Context.setString("App", appAddress.toHex());
  ERC20Base.createWithContext(event.params.id, erc20Context);

  
  let tx = createTransaction(event, ERC20_CREATE_TYPE, appAddress);
  tx.save();
}
