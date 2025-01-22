# Metrics Subgraph

The metrics subgraph aggregates all transactions and events from OPENFORMAT contracts into easily filterable by dimensions.

## Deployments

| Provider | Chain | Endpoint |
| --- | --- | --- |
| Subgraph Studio | Aurora testnet | <https://api.studio.thegraph.com/query/82634/open-format-metrics-aurora-testnet/v0.0.10> |
|  Subgraph Studio  | Aurora | <https://api.studio.thegraph.com/query/82634/open-format-metrics-aurora/v0.0.10> |
| Subgraph Studio | Base Sepolia (testnet) | <https://api.studio.thegraph.com/query/82634/open-format-metrics-base-sepolia/v0.0.10> |
|  Subgraph Studio  | Base | <https://api.studio.thegraph.com/query/82634/open-format-metrics-base/v0.0.10> |
| Alchemy Subgraphs | Arbitrum Sepolia (testnet) | <https://subgraphs.alchemy.com/subgraphs/5834> |
| Alchemy Subgraphs | Arbitrum Sepolia (staging) | <https://subgraphs.alchemy.com/subgraphs/7952> |
| Mobula Subgraphs | Matchain | <https://subgraph.mobula.io/subgraphs/name/open-format-matchain-metrics-v0_0_10> |

## Querying

## Entities

These are the main entities:

- Transaction: Stores information about transactions executed by OPENFORMAT contracts.
- Event: Stores information about transaction events triggered by OPENFORMAT contracts.
- User: Stored information about users that call functions from OPENFORMAT contracts.

A many-to-one relation exists between Transaction and Events, where a Transaction has multiple events associated.

All other entities are used to calculate and store statistics about Transactions and Events.

### Stats Entities

The stats entity names uses the following pattern **TransactionDimension1Dimension2...Stat** and **EventDimension1Dimension2...Stat**.
`TransactionStat` and `EventStat` will give aggregations across OPENFORMAT ecosystem.

Following is the list of all dimensions:

- Type (Transaction type or Event type)
- User
- App

This means if we want stats aggregated by Transaction Type, User and App we should query entity `TransactionTypeUserAppStat`.

Following is a list of all Stats Entities:

```text
* Transaction related stats *
TransactionStat
TransactionTypeStat
TransactionTypeAppStat
TransactionTypeUserStat
TransactionTypeUserAppStat
TransactionAppStat
TransactionUserStat
TransactionUserAppStat

* Event related stats *
EventStat
EventTypeStat
EventTypeAppStat
EventTypeUserStat
EventTypeUserAppStat
EventAppStat
EventUserStat
EventUserAppStat
```

See [schema.graphql](/schema.graphql) for different properties available in each entity.

### Totals

#### Total count of apps created

```graphql
{
  transactionTypeStats(where: { transactionType:"Create App" }){
    totalCount
  }
}
```

#### Total transactions

```graphql
{
  transactionStats {
    totalCount
  }
}
```

#### Total transactions for a given app

```graphql
{
  transactionAppStats(where: { 
    appId: "0xad2143d3944d31143cbb46a79f2b56b45754119c"
  }){
    totalCount
  }
}
```

#### Total transactions for a given user

```graphql
{
  transactionUserStats(where: {
    userId: "0xad2143d3944d31143cbb46a79f2b56b45754119c"
  }){
    totalCount
  }
}
```

#### Total transactions of type "Mint ERC20" for a given app

```graphql
{
  transactionTypeAppStats(where: {
    appId: "0xad2143d3944d31143cbb46a79f2b56b45754119c"
    transactionType: "Mint ERC20"
  }){
    totalCount
  }
}
```

#### Total count of badges created

```graphql
{
  eventTypeStats(where: { eventType:"Badge Create" }){
    totalCount
  }
}
```

#### Total events triggered

```graphql
{
  eventStats {
    totalCount
  }
}
```

#### Total events for a given app

```graphql
{
  eventAppStats(where: { 
    appId: "0xad2143d3944d31143cbb46a79f2b56b45754119c"
  }){
    totalCount
  }
}
```

#### Total events for a given user

```graphql
{
  eventUserStats(where: {
    userId: "0xad2143d3944d31143cbb46a79f2b56b45754119c"
  }){
    totalCount
  }
}
```

#### Total tokens created by a given app

```graphql
{
  eventTypeAppStats(where: {
    appId: "0xad2143d3944d31143cbb46a79f2b56b45754119c"
    eventType: "Token Create"
  }){
    totalCount
  }
}

```


See the lists of [transaction types](#transaction-types) and [event types](#event-types) for different options.

## Aggregations over time

You can use subgraph [Time-travel queries](https://thegraph.com/docs/en/querying/graphql-api/#time-travel-queries) to know the values of stats entities at any point in the past. In order to do this you need to specify the block number in the query, the result will be like a snapshot of the entities at the specified point.

You can also bundle several time travel queries into one query by utilizing [aliases](https://graphql.org/learn/queries/#aliases). This allows you to get as many snapshots as you need in a single query. You can use filters with aliases without problems.

### Apps created over time

The following query will return the total number of Apps created at 3 different points: currently, at block `80171125` and at block `80114208`.

```graphql
{  
  current: transactionTypeStats ( where: {transactionType:"Create App"} ) {
    totalCount
    updatedAt
  }
  block_80171125: transactionTypeStats (block: {number: 80171125}, where: {transactionType:"Create App"}) {
    totalCount
    updatedAt
  }
  block_80114208: transactionTypeStats (block: {number: 80114208}, where: {transactionType:"Create App"}) {
    totalCount
    updatedAt
  }
}
```

For this query the results can be understood as:

- `totalCount`: The total number of apps created at that point.
- `updatedAt`: UNIX time in milliseconds when the stats were last updated.

## Gas and Cost

`totalGasUsed` can be added to queries to get the total cumulative gas used. Just like `transactionCount` this works across all dimensions.

`totalGasCost` stores the cumulative gas costs. Gas costs of a transaction is defined as the gas used by the transaction multiplied by the transaction gas price. Similarly is works across all dimensions.

For example if we use the total apps created query

- `totalCount`: The total number of apps created
- `totalGasUsed` : The total gas used creating apps
- `totalGasCost` : The total cost creating apps

```graphql
{
  transactionTypeStats(where: {
   transactionType:"Create App"
  }){
    totalCount
    totalGasUsed
    totalGasCost
  }
}
```

## Transaction Types

Transaction types are defined according to the contract function called in the transaction.

```javascript
"Batch Mint Badge"
"Mint Badge"
"Mint ERC20"
"Mint ERC721"
"Multicall"
"Transfer ERC20"
"Transfer ERC721"
"Create ERC20"
"Create ERC721"
"Create ERC721 Token Uri"
"Get ERC721 Factory Implementation"
"Calculate ERC721 Factory Deployment Address"
"Calculate ERC20 Factory Deployment Address"
"Get ERC20 Factory Implementation"
"Create App"
```

## Event Types

```javascript
// ERC721 Badge
"ERC721Badge Mint"
"ERC721Badge Batch Mint"
"ERC721Badge Transfer"
"ERC721Badge Burn"
"ERC721Badge Update"

// ERC721 Base
"ERC721 Mint"
"ERC721 Batch Mint"
"ERC721 Transfer"
"ERC721 Burn"

// ERC721 Lazy Mint
"ERC721Lazy Mint"
"ERC721Lazy Batch Mint"
"ERC721Lazy Lazy Mint"
"ERC721Lazy Transfer"
"ERC721Lazy Burn"

// Credits
"ERC20 Mint"
"ERC20 Burn"
"ERC20 Transfer"
"ERC20 Update"

// Rewarding XP
"Token Create"
"Token Reward"
"Token Transfer"

// Rewarding Badges
"Badge Create"
"Badge Reward"
"Badge Transfer"

// App Factory
"App Create"
```

## Local Development

### Prerequisites

Before starting the local development, ensure that you have the following:

- A local version of [graph-node](https://github.com/graphprotocol/graph-node) running. We recommend using [Docker Compose](https://github.com/graphprotocol/graph-node/tree/master/docker#docker-compose).
- A local testnet node running and our [smart contracts](https://github.com/open-format/contracts#getting-started) deployed locally.

### Clone the repository:

Clone the subgraph repository by running the following command:

`git clone https://github.com/open-format/subgraph.git`

### Install dependencies:

Install the required dependencies using either of the following package managers:

Using Yarn:

`yarn install`

Using NPM:

`npm install`

### Prepare the local subgraph

Prepare the local subgraph by running the following command:

`yarn prepare:local`

### Create the local subgraph

Create the local subgraph by running the following command:

`yarn create:local`

### Deploy the local subgraph

Finally, deploy the local subgraph by running the following command:

`yarn deploy:local`

## Contributing

Our bounty program provides developers with a chance to earn by contributing to the Open Format ecosystem through completing bounties for new features and templates on our product roadmap. If you're interested in getting involved, check out our [current bounties](https://github.com/orgs/open-format/projects) to see if there are any projects that match your skills and interests.

## Community

We're building a community of talented developers who are passionate about shaping the future of the internet. We believe that collaboration and shared knowledge are absolutely essential to creating amazing things that will impact people's lives in profound ways. If you share our vision, we invite you to come be a part of something amazing on [Discord](https://discord.gg/BgkbC7Dkuf).
