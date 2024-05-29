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

export const generateRandomKey = (length: number = 10): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};