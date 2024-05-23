import {Created} from "../../generated/templates/ERC20FactoryFacet/ERC20FactoryFacet";
import {One, loadOrCreateStats, loadOrCreateTransaction} from "../helpers";

export function handleCreated(event: Created): void {
  // Increment ERC20 Count
  let stats = loadOrCreateStats();
  stats.ERC20Count = stats.ERC20Count.plus(One);
  stats.save();
}
