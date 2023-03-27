import {
  Address,
  BigInt,
  dataSource,
  DataSourceContext
} from "@graphprotocol/graph-ts";
import {ERC20Base} from "../../generated/templates";
import {Created} from "../../generated/templates/ERC20FactoryFacet/ERC20FactoryFacet";
import {
  loadOrCreateContract,
  loadOrCreateContractMetadata,
  loadOrCreateToken,
  loadOrCreateUser
} from "../helpers";

let context = dataSource.context();
let appAddress = Address.fromString(context.getString("app"));

export function handleCreated(event: Created): void {
  let ERC20Context = new DataSourceContext();

  ERC20Context.setString("ERC20Contract", event.params.id.toHex());
  ERC20Base.createWithContext(event.params.id, ERC20Context);

  let contract = loadOrCreateContract(event.params.id);
  let contractMetadata = loadOrCreateContractMetadata(event.params.id);
  let user = loadOrCreateUser(event.params.creator, event);
  let token = loadOrCreateToken(event.params.id, event);

  contract.type = "Token";
  contract.createdAtBlock = event.block.number;
  contract.createdAt = event.block.timestamp;
  contract.owner = event.params.creator.toHex();
  contract.metadata = contractMetadata.id;
  contract.app = appAddress.toHex();

  contractMetadata.name = event.params.name;
  contractMetadata.symbol = event.params.symbol;
  contractMetadata.totalSupply = BigInt.fromI32(0);

  token.contract = event.params.id.toHex();

  contract.save();
  contractMetadata.save();
  user.save();
  token.save();
}
