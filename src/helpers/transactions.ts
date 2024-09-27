import { TypedMap } from "@graphprotocol/graph-ts";

// Event Types
export const ERC721_LAZY_MINT_TYPE            = "ERC721Lazy Mint";
export const ERC721_LAZY_BATCH_MINT_TYPE      = "ERC721Lazy Batch Mint";
export const ERC721_LAZY_MINT_LAZY_TYPE       = "ERC721Lazy Lazy Mint";
export const ERC721_LAZY_TRANSFER_TYPE        = "ERC721Lazy Transfer";
export const ERC721_LAZY_BURN_TYPE            = "ERC721Lazy Burn";

export const ERC721_BADGE_MINTED_TYPE         = "ERC721Badge Mint";
export const ERC721_BADGE_BATCH_MINTED_TYPE   = "ERC721Badge Batch Mint";
export const ERC721_BADGE_TRANSFER_TYPE       = "ERC721Badge Transfer";
export const ERC721_BADGE_BURN_TYPE           = "ERC721Badge Burn";
export const ERC721_BADGE_UPDATE_TYPE         = "ERC721Badge Update";

export const ERC721_MINTED_TYPE               = "ERC721 Mint";
export const ERC721_BATCH_MINTED_TYPE         = "ERC721 Batch Mint";
export const ERC721_TRANSFER_TYPE             = "ERC721 Transfer";
export const ERC721_BURN_TYPE                 = "ERC721 Burn";

export const ERC20_MINT_TYPE                  = "ERC20 Mint";
export const ERC20_BURN_TYPE                  = "ERC20 Burn";
export const ERC20_TRANSFER_TYPE              = "ERC20 Transfer";
export const ERC20_UPDATE_TYPE                = "ERC20 Update";

export const TOKEN_CREATE_TYPE                = "Token Create";
export const TOKEN_MINT_TYPE                  = "Token Reward";
export const TOKEN_TRANSFER_TYPE              = "Token Transfer";

export const BADGE_CREATE_TYPE                = "Badge Create";
export const BADGE_MINT_TYPE                  = "Badge Reward";
export const BADGE_TRANSFER_TYPE              = "Badge Transfer";

export const APP_CREATE_TYPE                  = "App Create";

// Transaction Types
// Keys are function selectors from transaction.input
const functionTypes = new TypedMap<string, string>();
functionTypes.set("0xb92bafd6", "Batch Mint Badge");
functionTypes.set("0xa6c130fc", "Mint Badge");
functionTypes.set("0x609512c9", "Mint ERC20");
functionTypes.set("0x97b4f6aa", "Mint ERC721");
functionTypes.set("0xac9650d8", "Multicall");
functionTypes.set("0xbdebfec5", "Transfer ERC20");
functionTypes.set("0x3996701d", "Transfer ERC721");
functionTypes.set("0x2d4105d1", "Create ERC20");
functionTypes.set("0xee4506f5", "Create ERC721");
functionTypes.set("0x4fc06be4", "Create ERC721 Token Uri");
functionTypes.set("0x851ba287", "Get ERC721 Factory Implementation");
functionTypes.set("0x0667aad5", "Calculate ERC721 Factory Deployment Address");
functionTypes.set("0x08721a2c", "Calculate ERC20 Factory Deployment Address");
functionTypes.set("0x3cb20d6c", "Get ERC20 Factory Implementation");
functionTypes.set("0x663ff5a9", "Create App");
export const TRANSACTION_TYPE_UNKNOWN = "Unknown";

// Global stats IDs
export const GLOBAL_TRANSACTION_STAT_ID = "TransactionStat";
export const GLOBAL_EVENT_STAT_ID = "EventStat";

export function getTransactionType(functionSelector: string): string {
    const result = functionTypes.get(functionSelector);
    return result ? result : TRANSACTION_TYPE_UNKNOWN;
}