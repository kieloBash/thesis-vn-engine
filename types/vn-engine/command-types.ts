import { Speaker } from "..";
import { Audio, Background, Dialogue, DialogueType } from "./main-types";

// Define enums for command types and transition types
export enum CommandsEnum {
  CreateCharacter = "CreateCharacter",
  AddBackground = "addBackground",
  RemoveBackground = "removeBackground",
  PlayMusic = "playMusic",
  StopMusic = "stopMusic",
  MoveCharacter = "MoveCharacter",
  HideCharacter = "HideCharacter",
  PlayLowerOrderGame = "PlayLowerOrderGame",
  PlayHigherOrderGame = "PlayHigherOrderGame",
}

export type TransitionType = "fade" | "feathers";
export const TRANSITIONS: TransitionType[] = ["fade", "feathers"];

// Type guard for Command
export function isCommand(dialogue: Dialogue): dialogue is Command {
  return (dialogue as Command).dialogueType === "command";
}

// Utility type for commands
interface BaseCommand {
  id: string;
  dialogueType: DialogueType;
  blank?: boolean;
}
interface BackgroundCommand extends BaseCommand {
  background?: Background;
  timer?: number;
  transition?: TransitionType;
}
interface MusicCommand extends BaseCommand {
  audio: Audio;
}
interface CharacterCommand extends BaseCommand {
  speaker?: Speaker;
}

// Specific command interfaces
export interface AddBackground extends BackgroundCommand {
  type: CommandsEnum.AddBackground;
}
export function isAddBackgroundCommand(
  command: Command
): command is AddBackground {
  return command.type === CommandsEnum.AddBackground;
}

export interface RemoveBackground extends BackgroundCommand {
  type: CommandsEnum.RemoveBackground;
}
export function isRemoveBackgroundCommand(
  command: Command
): command is RemoveBackground {
  return command.type === CommandsEnum.RemoveBackground;
}

export interface PlayMusic extends MusicCommand {
  type: CommandsEnum.PlayMusic;
}
export interface StopMusic extends MusicCommand {
  type: CommandsEnum.StopMusic;
}
export interface MoveCharacter extends CharacterCommand {
  type: CommandsEnum.MoveCharacter;
  xPos?: number;
  speed_duration?: number;
  isInstant?: boolean;
}
export function isMoveCharacterCommand(
  command: Command
): command is MoveCharacter {
  return command.type === CommandsEnum.MoveCharacter;
}
export interface CreateCharacter extends CharacterCommand {
  type: CommandsEnum.CreateCharacter;
  enabledOnSpawn: boolean;
  immediate: boolean;
  startXpos: number;
}
export function isCreateCharacterCommand(
  command: Command
): command is CreateCharacter {
  return command.type === CommandsEnum.CreateCharacter;
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
  | CreateCharacter
  | AddBackground
  | RemoveBackground
  | PlayMusic
  | StopMusic
  | MoveCharacter
  | HideCharacter
  | PlayLowerOrderGame
  | PlayHigherOrderGame;
