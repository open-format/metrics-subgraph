import {Address, dataSource, BigInt, log} from "@graphprotocol/graph-ts";
import {
  ContractURIUpdated,
  ERC20Base as ERC20BaseContract,
  Transfer,
} from "../generated/templates/ERC20Base/ERC20Base";
import {
  ZERO_ADDRESS,
  loadConstellation,
  loadOrCreateFungibleToken,
  loadOrCreateFungibleTokenBalance,
  loadOrCreateFungibleTokenMetadata,
  loadOrCreateStats,
  loadOrCreateUser,
  One,
} from "./helpers";

let context = dataSource.context();
let contractAddress = Address.fromString(context.getString("ERC20Contract"));

export function handleTransfer(event: Transfer): void {
  const boundContract = ERC20BaseContract.bind(contractAddress);
  const fungibleToken = loadOrCreateFungibleToken(contractAddress, event);

  // sender and receiver User and TokenBalance entities required for Wallet > Wallet transfers
  let sender = loadOrCreateUser(event.params.from, event);
  let receiver = loadOrCreateUser(event.params.to, event);

  let senderTokenBalance = loadOrCreateFungibleTokenBalance(
    contractAddress,
    event.params.from,
    event
  );

  senderTokenBalance.user = sender.id;
  senderTokenBalance.token = contractAddress.toHex();
  senderTokenBalance.balance = boundContract.balanceOf(
    Address.fromString(sender.id)
  );

  let receiverTokenBalance = loadOrCreateFungibleTokenBalance(
    contractAddress,
    event.params.to,
    event
  );

  receiverTokenBalance.user = receiver.id;
  receiverTokenBalance.token = contractAddress.toHex();
  receiverTokenBalance.balance = boundContract.balanceOf(
    Address.fromString(receiver.id)
  );

  //@TODO delete  senderTokenBalance and/or receiverTokenBalance entity if balanceOf is zero.

  const isMinted = event.params.from == ZERO_ADDRESS;
  const isBurned = event.params.to == ZERO_ADDRESS;

  if (isMinted) {
    receiver.save();
    receiverTokenBalance.save();
    // Increment tokens minted
    let stats = loadOrCreateStats();
    stats.TokensMintedTransactions = stats.TokensMintedTransactions.plus(
      BigInt.fromI32(1)
    );
    stats.save();
    log.debug("*** Tokens Minted: TokensMintedTransactions: {}", [
      stats.TokensMintedTransactions.toString(),
    ]);
  } else if (isBurned) {
    sender.save();
    senderTokenBalance.save();

    //@TODO is burntSupply the correct name?
    fungibleToken.burntSupply = fungibleToken.burntSupply.plus(
      event.params.value
    );
  } else {
    sender.save();
    receiver.save();

    receiverTokenBalance.save();
    senderTokenBalance.save();

    // Increment tokens transferred
    let stats = loadOrCreateStats();
    stats.TokensTransferredTransactions =
      stats.TokensTransferredTransactions.plus(One);
    stats.save();
    log.debug("*** Tokens Transferred: TokensTransferredTransactions: {}", [
      stats.TokensTransferredTransactions.toString(),
    ]);
  }

  fungibleToken.totalSupply = boundContract.totalSupply();
  fungibleToken.save();
}

export function handleContractURIUpdated(event: ContractURIUpdated): void {
  const constellation = loadConstellation(contractAddress);
  const fungibleToken = loadOrCreateFungibleToken(contractAddress, event);
  const fungibleTokenMetadata = loadOrCreateFungibleTokenMetadata(
    contractAddress,
    event
  );

  if (constellation) {
    constellation.metadata = fungibleTokenMetadata.id;
    constellation.save();
  } else {
    fungibleToken.metadata = fungibleTokenMetadata.id;
    fungibleToken.save();
  }
  fungibleTokenMetadata.URI = event.params.newURI;
  fungibleTokenMetadata.save();
}
