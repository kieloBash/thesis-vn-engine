import { Speaker } from "..";
import { Audio, Background, Dialogue, DialogueType } from "./main-types";

// Define enums for command types and transition types
export enum CommandsEnum {
  AddBackground = "addBackground",
  RemoveBackground = "removeBackground",
  PlayMusic = "playMusic",
  StopMusic = "stopMusic",
  MoveCharacter = "MoveCharacter",
  HideCharacter = "HideCharacter",
  PlayLowerOrderGame = "PlayLowerOrderGame",
  PlayHigherOrderGame = "PlayHigherOrderGame",
}

export enum TransitionType {
  Fade = "fade",
  Feathers = "feathers",
}

// Type guard for Command
export function isCommand(dialogue: Dialogue): dialogue is Command {
  return (dialogue as Command).dialogueType === "command";
}

// Utility type for commands
interface BaseCommand {
  id: string;
  dialogueType: DialogueType;
}
interface BackgroundCommand extends BaseCommand {
  background: Background;
  timer?: number;
  transition?: TransitionType;
}
interface MusicCommand extends BaseCommand {
  audio: Audio;
}
interface CharacterCommand extends BaseCommand {
  speaker: Speaker;
}

// Specific command interfaces
export interface AddBackground extends BackgroundCommand {
  type: CommandsEnum.AddBackground;
}
export interface RemoveBackground extends BackgroundCommand {
  type: CommandsEnum.RemoveBackground;
}
export interface PlayMusic extends MusicCommand {
  type: CommandsEnum.PlayMusic;
}
export interface StopMusic extends MusicCommand {
  type: CommandsEnum.StopMusic;
}
export interface MoveCharacter extends CharacterCommand {
  type: CommandsEnum.MoveCharacter;
  xPos: number;
  speed_duration?: number;
  isInstant?: boolean;
}
export interface HideCharacter extends CharacterCommand {
  type: CommandsEnum.HideCharacter;

  transition: TransitionType;
  speed_duration?: number;
  isInstant?: boolean;
}
export interface PlayLowerOrderGame extends BaseCommand {
  type: CommandsEnum.PlayLowerOrderGame;
}
export interface PlayHigherOrderGame extends BaseCommand {
  type: CommandsEnum.PlayHigherOrderGame;
}

// Union type for all commands
export type Command =
  | AddBackground
  | RemoveBackground
  | PlayMusic
  | StopMusic
  | HideCharacter
  | PlayLowerOrderGame
  | PlayHigherOrderGame;
