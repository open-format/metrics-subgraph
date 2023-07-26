import {Address, BigInt, dataSource, store} from "@graphprotocol/graph-ts";
import {
  BatchMinted,
  ERC721Base as ERC721BaseContract,
  Minted
} from "../generated/templates/ERC721Base/ERC721Base";

import {Transfer} from "../generated/templates/ERC721Base/ERC721Base";
import {
  ZERO_ADDRESS,
  loadBadgeToken,
  loadOrCreateBadge,
  loadOrCreateBadgeToken,
  loadOrCreateUser
} from "./helpers";

let context = dataSource.context();
let contractAddress = Address.fromString(context.getString("ERC721Contract"));
const boundContract = ERC721BaseContract.bind(contractAddress);

export function handleMinted(event: Minted): void {
  const totalSupply = boundContract
    .nextTokenIdToMint()
    .minus(BigInt.fromI32(1));

  let BadgeToken = loadOrCreateBadgeToken(
    event.address,
    totalSupply.toString(),
    event
  );
  let user = loadOrCreateUser(event.params.to, event);

  BadgeToken.owner = user.id;
  BadgeToken.metadataURI = event.params.tokenURI;
  BadgeToken.tokenId = totalSupply;
  BadgeToken.badge = event.address.toHex();

  BadgeToken.save();
  user.save();
}

export function handleBatchMinted(event: BatchMinted): void {
  let user = loadOrCreateUser(event.params.to, event);
  let Badge = loadOrCreateBadge(contractAddress, event);

  const totalSupplyBeforeMint = boundContract
    .totalSupply()
    .minus(event.params.quantity);

  for (let i = 0; i < event.params.quantity.toI32(); i++) {
    const tokenId = totalSupplyBeforeMint.plus(BigInt.fromI32(i));

    let BadgeToken = loadOrCreateBadgeToken(
      event.address,
      tokenId.toString(),
      event
    );
    BadgeToken.owner = user.id;
    BadgeToken.metadataURI = event.params.baseURI;
    BadgeToken.tokenId = tokenId;
    BadgeToken.badge = event.address.toHex();
    BadgeToken.save();
  }

  Badge.totalClaimed = totalSupplyBeforeMint.plus(event.params.quantity);
  Badge.save();
}

export function handleTransfer(event: Transfer): void {
  let Badge = loadBadgeToken(event.address, event.params.tokenId.toString());
  if (Badge) {
    if (event.params.to == ZERO_ADDRESS) {
      //@TODO is burntSupply the correct name?
      store.remove("Badge", Badge.id);
    } else {
      Badge.owner = event.params.to.toHex();
      Badge.save();
    }
  }
}
