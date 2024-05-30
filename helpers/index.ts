import {
  AudioCommand,
  BackgroundCommand,
  Command,
  CommandType,
  Speaker,
} from "@/types";
import { ArgumentTaxEnum, DisplayArg, FullArgument } from "@/types/new-types";

export const isBackgroundCommand = (
  command: Command
): command is BackgroundCommand => {
  return command.type === CommandType.Background;
};

export const isAudioCommand = (command: Command): command is AudioCommand => {
  return command.type === CommandType.Audio;
};

export const hasChainWithGroundAndWarrant = (claim: FullArgument): boolean => {
  return claim.chain.some((chain) => chain.ground && chain.warrant);
};

export const hasIncompleteChain = (claim: FullArgument): boolean => {
  if (claim.chain.length === 0) return true;
  return claim.chain.some((chain) => !chain.warrant || !chain.ground);
};

export const generateRandomKey = (length: number = 10): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getDisplayArgs = ({
  args,
  key,
}: {
  args: FullArgument[];
  key: string;
}): DisplayArg[] => {
  let data: DisplayArg[] = [];
  args.forEach((arg) => {
    if (arg.lineRef === key) {
      data.push({
        tax: arg.tax,
        type: arg.type,
        claimKey: arg.claimKey,
        text: arg.claimText,
      });
    }
    arg.chain.forEach((ch) => {
      if (ch.ground?.lineRef === key) {
        data.push({
          tax: ArgumentTaxEnum.GROUND,
          claimKey: arg.claimKey,
          text: ch.ground.text,
          connectorKey: ch.connectorKey,
        });
      }
      if (ch.warrant?.lineRef === key) {
        data.push({
          tax: ArgumentTaxEnum.WARRANT,
          claimKey: arg.claimKey,
          text: ch.warrant.text,
          connectorKey: ch.connectorKey,
        });
      }
    });
  });
  return data;
};

export function isSpawnedSpeaker({
  speaker,
  arr,
}: {
  speaker: Speaker;
  arr: Speaker[];
}) {
  const temp = arr.find((s) => s.name === speaker.name);
  if (temp) return true;
  else false;
}
