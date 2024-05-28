import { BackgroundCommand, Command, CommandType } from "@/types";
import { FullArgument } from "@/types/new-types";

export const isBackgroundCommand = (
  command: Command
): command is BackgroundCommand => {
  return command.type === CommandType.Background;
};

export const hasChainWithGroundAndWarrant = (claim: FullArgument): boolean => {
  return claim.chain.some((chain) => chain.ground && chain.warrant);
};

export const hasIncompleteChain = (claim: FullArgument): boolean => {
  if (claim.chain.length === 0) return true;
  return claim.chain.some((chain) => !chain.warrant || !chain.ground);
};
