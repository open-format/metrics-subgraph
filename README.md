# Metrics Subgraph

The metrics subgraph aggregates all transactions using open format contracts into easily filterable by dimensions.

## Deployments
| Chain                      | subgraph                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------ |
| Arbitrum Sepolia (testnet) | https://api.studio.thegraph.com/proxy/82634/metrics-arbitrum-sepolia/version/latest/ |

## Querying

### Dimensions

The schema uses the following pattern **TransactionDimension1Dimension2...Stat**.
`TransactionStat` will give aggregations across open format ecosystem.
If we want aggregation by Transaction Type, User and App we should query aggregation `TransactionTypeUserAppStat`.

```
TransactionStat
TransactionTypeStat
TransactionTypeAppStat
TransactionTypeUserStat
TransactionTypeUserAppStat
TransactionAppStat
TransactionUserStat
TransactionUserAppStat
```

See [schema.graphql](/schema.graphql) for different properties available in each dimension

### Totals

#### Total count of apps created

[Live example ->](https://api.studio.thegraph.com/proxy/82634/metrics-arbitrum-sepolia/version/latest/graphql?query=%7B%0A++transactionTypeStats%28interval%3A+hour%2C+first%3A1%2C+where%3A+%7B%0A+++type%3A%22App+Create%22%0A++%7D%29%7B%0A++++id%0A++++totalCount%0A++++transactionCount%0A++++timestamp%0A++++gasUsed%0A++++totalGasUsed%0A++%7D%0A%7D)

```graphql
{
  transactionTypeStats(interval: hour, first:1, where: {
   type:"App Create"
  }){
    totalCount
  }
}
```

#### Total transactions
```graphql
{
  transactionStats(interval: hour, first:1){
    totalCount
  }
}
```

#### Total transactions for a given app
```graphql
{
  transactionAppStats(interval: hour, first:1 , where: {
    appId: "0xad2143d3944d31143cbb46a79f2b56b45754119c"
  }){
    totalCount
  }
}
```

#### Total transactions for a given user
```graphql
{
  transactionUserStats(interval: hour, first:1 , where: {
    userId: "0xad2143d3944d31143cbb46a79f2b56b45754119c"
  }){
    totalCount
  }
}
```

#### Total transactions of type "Reward XP" for a given app
```graphql
{
  transactionTypeAppStats(interval: hour, first:1 , where: {
    appId: "0xad2143d3944d31143cbb46a79f2b56b45754119c"
    type: "Reward XP"
  }){
    totalCount
  }
}
```
See the [list of transaction types](#transaction-types) for different options.

## Time Aggregation

Time aggregations happen hourly or daily. By setting the `interval` to `day` or `hour`. The same logic can be applied across all dimensions.

Lets use apps created as an example

### Apps created over time
The following query will return a list of the 100 latest aggregated days where apps where created.

> Note: Days where the transaction count is zero are skipped.

```graphql
{
  transactionTypeStats(interval: day, first:100, where: {
   type:"App Create"
  }){
    totalCount
    transactionCount
    timestamp
  }
}
```
For this query the results can be understood as:
- `totalCount`: The total number of apps created.
- `transactionCount`: The number of apps created that day.
- `timestamp`: UNIX time in microseconds when the stats were aggregated

### Apps created between two dates
To get specific data between dates timestamps in microseconds can be given using `timestamp_lte` (<=) and `timestamp_gte` (>=)

For example:
1720828800000000 - Saturday, 13 July 2024 00:00:00
1719705600000000 - Sunday, 30 June 2024 00:00:00
```graphql
{
  transactionTypeStats(interval: day, first:100, where: {
   type:"App Create"
   timestamp_lte: "1720828800000000"
   timestamp_gte: "1719705600000000"
  }){
    totalCount
    transactionCount
  }
}
```

### Apps created in the last hour
Because the data is aggregated at most every hour, on the hour, we need to manually aggregate the most recent transactions if we want a faster frequency. To do so we can query `transactions` manually with the appropriate filters to include the latest hour

For example lets use the date `Sat Jul 13 2024` and imagine the time is between 20:00 and 21:00 GMT to get all "App Create" transactions we need to add the aggregated data to the current hour.

```graphql
{
  transactions(
    orderBy:timestamp,
    orderDirection: desc,
    where: {
     	type:"App Create",
     	timestamp_gt: "1720900800000000",
    	timestamp_lt: "1720904400000000",
    }
  ){
    id
    type
    timestamp
  }
  transactionTypeStats(interval: hour, first:1, where: {
   type:"App Create"
   timestamp_lte: "1720900800000000"
  }){
    totalCount
  }
}
```

Will give us the following result:
```JSON
{
  "data": {
    "transactions": [
      {
        "id": "273273466076004352",
        "type": "App Create",
        "timestamp": "1720903142000000"
      }
    ],
    "transactionTypeStats": [
      {
        "totalCount": "379",
        "transactionCount": "1"
      }
    ]
  }
}
```
We then can add `data.transactions.length` to `data.transactionTypeStats[0].totalCount` to get the most up to date count.

## Gas

`gasUsed` can be added to queries to get total gas used in wei within that aggregation interval. `totalGasUsed` will give you the total cumulative gas used. Just like `count` and `transactionCount` this works across all dimensions.

For example if we use the total apps created query
- `totalCount`: The total number of apps created
- `totalGasUsed` : The total gas used creating apps
- `gasUsed`: The total gas used within the latest aggregated hour
```
{
  transactionTypeStats(interval: hour, first:1, where: {
   type:"App Create"
  }){
    totalCount
    gasUsed
    totalGasUsed
  }
}
```

## Transaction Types
```
// ERC721 Badge
"ERC721Badge Minted"
"ERC721Badge Batch Minted"
"ERC721Badge Transfer"
"ERC721Badge Burn"
"ERC721Badge Update"

// ERC721 Base
"ERC721 Minted"
"ERC721 Batch Minted"
"ERC721 Transfer"
"ERC721 Burn"

// ERC721 Lazy Mint
"ERC721Lazy Mint"
"ERC721Lazy Batch Mint"
"ERC721Lazy Lazy Mint"
"ERC721Lazy Transfer"
"ERC721Lazy Burn"

// Credits
"ERC20 Create"
"ERC20 Mint"
"ERC20 Burn"
"ERC20 Transfer"
"ERC20 Update"

// Rewarding
"Reward XP"
"Transfer Token"
"Badge Create"
"Reward Badge"
"Transfer Badge"

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
