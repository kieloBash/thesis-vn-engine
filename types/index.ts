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
export interface Command {
  name: string;
  type: CommandType;
}
export type CommandType = "Background" | "Action" | "Audio";

export interface Argument {
  lineRef: number;
  id: string; //CONNECT TO CLAIM

  type: ArgumentType;
  tax: ArgumentTax;
  argumentKey?: string;
  line: string;
}
export type ArgumentType = "For" | "Against" | "Irrelevant";
export type ArgumentTax = "Claim" | "Warrant" | "Ground";

export interface Dialogue {
  lineNum: number;
  speaker: Speaker;
  dialogue: string;
  commands: Command[];
  arguments: Argument[];
}
