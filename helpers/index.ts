import { BackgroundCommand, Command, CommandType } from "@/types";

export const isBackgroundCommand = (
  command: Command
): command is BackgroundCommand => {
  return command.type === CommandType.Background;
};
