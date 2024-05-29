import { FullArgument } from "./new-types";

export type SidebarButtonsType = "Characters" | "Background" | "Commands";
export interface StoryLine {
  speaker: Speaker;
  dialogue: string;
  commands: Command[];
}
export interface Speaker {
  name: string;
  image?: any;
}
export interface Background {
  name: string;
  image?: any;
}
export interface Command {
  name: string;
  type: CommandType;
  parameters: string[];
}
export enum CommandType {
  Background = "background",
  Action = "action",
  Audio = "audio",
}
export interface BackgroundCommand extends Command {
  type: CommandType.Background;
  bg: Background;
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

  type: DialogueType;
}

export type DialogueType = "CommandOnly" | "FullDialogue";
