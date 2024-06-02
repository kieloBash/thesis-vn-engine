import { FullArgument } from "./new-types";

export type SidebarButtonsType = "Characters" | "Background" | "Commands" | "Preview";
export interface StoryLine {
  speaker: Speaker;
  dialogue: string;
  commands: Command[];
}
export interface Speaker {
  name: string;
  image?: any;
  xPos?: number;
  yPos?: number;
}
export interface Background {
  name: string;
  image?: any;
}
export interface Command {
  name: string;
  type: CommandType;
  parameters: string[];
  status?: CommandStatus;
}
export type CommandStatus = "ready" | "disabled";

export enum CommandType {
  Background = "background",
  Action = "action",
  Audio = "audio",
}
export interface BackgroundCommand extends Command {
  type: CommandType.Background;
  bg: Background;
}
export interface AudioCommand extends Command {
  type: CommandType.Audio;
  audio?: Audio;
}
export interface ActionCommand extends Command {
  type: CommandType.Action;
  speaker?: Speaker;
  xPos?: number;
  speed_duration?: number;
  isInstant?: boolean;
}

// Usage: -t trackname -c channel -v volume -p pitch -sv startingvolume -l loop
export interface Audio {
  trackname: string;
  channel?: number;
  volume?: number;
  pitch?: number;
  starting_vol?: number;
  loop?: boolean;
}

// export type CommandType = "Background" | "Action" | "Audio";

export interface Argument {
  lineRef: number;
  id: string; //CONNECT TO CLAIM

  type?: ArgumentType;
  tax: ArgumentTax;
  argumentKey?: string;
  line: string;
}
export type ArgumentType = "For" | "Against" | "Irrelevant";
export type ArgumentTax = "Claim" | "Warrant" | "Ground";

export interface Dialogue {
  lineNum: string;
  speaker?: Speaker;
  dialogue?: string;
  commands: Command[];
  arguments: FullArgument[];

  isSpawnSpeaker?: boolean;

  type: DialogueType;
}

export type DialogueType = "CommandOnly" | "FullDialogue";
