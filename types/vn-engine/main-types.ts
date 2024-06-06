import { Command } from "./command-types";

export type Dialogue = Conversation | Command;

export interface Conversation {
  id: string;
  speaker: Character;
  line: string;
  justSpawned: boolean;
  isHidden?: boolean;
  startXPos?: number;

  altName?: string;
  dialogueType: DialogueType;
}

export interface Character {
  name: string;
  image?: any;
}
export interface Background {
  name: string;
  image?: any;
}
export interface Audio {
  trackname: string;
  channel?: number;
  volume?: number;
  pitch?: number;
  starting_vol?: number;
  loop?: boolean;
}

export type DialogueType = "conversation" | "command";

// Type guard for Conversation
export function isConversation(dialogue: Dialogue): dialogue is Conversation {
  return (dialogue as Conversation).dialogueType === "conversation";
}
