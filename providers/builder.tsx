"use client";
import { CommandsEnum } from "@/types/vn-engine/command-types";
import { Background, Character, Dialogue } from "@/types/vn-engine/main-types";
import * as React from "react";
export interface SpawnedCharacterType extends Character {
  xPos?: number;
}

export type Slides = {
  id: string;
  dialogue: Dialogue;
  activeBackground?: Background;
  spawnedCharacters: SpawnedCharacterType[];
};

type ContextType = {
  visualNovel: Slides[];
  setVisualNovel: (temp: Slides[]) => void;

  spawnedCharacters: SpawnedCharacterType[];
  setSpawnedCharacters: (temp: SpawnedCharacterType[]) => void;
  activeBackground: Background | undefined;
  setActiveBackground: (temp: Background | undefined) => void;

  // for toggle
  selectedCommand: { command: CommandsEnum; id: string } | undefined;
  setSelectedCommand: (
    temp: { command: CommandsEnum; id: string } | undefined
  ) => void;

  // for edit
  toggleEdits: boolean;
  setToggleEdits: (temp: boolean) => void;
};

const Context = React.createContext<ContextType>({
  visualNovel: [],
  setVisualNovel: (temp: Slides[]) => {},

  spawnedCharacters: [],
  setSpawnedCharacters: (temp: SpawnedCharacterType[]) => {},
  activeBackground: undefined,
  setActiveBackground: (temp: Background | undefined) => {},

  // for toggle
  selectedCommand: undefined,
  setSelectedCommand: (
    temp: { command: CommandsEnum; id: string } | undefined
  ) => {},

  // for edit
  toggleEdits: false,
  setToggleEdits: (temp: boolean) => {},
});

export const useBuilderContext = () => React.useContext(Context);

const BuilderProvider = ({ children }: { children: React.ReactNode }) => {
  const [spawnedCharacters, setSpawnedCharacters] = React.useState<
    SpawnedCharacterType[]
  >([]);
  const [activeBackground, setActiveBackground] = React.useState<
    Background | undefined
  >(undefined);
  const [visualNovel, setVisualNovel] = React.useState<Slides[]>([]);
  const [selectedCommand, setSelectedCommand] = React.useState<
    { command: CommandsEnum; id: string } | undefined
  >(undefined);
  const [toggleEdits, setToggleEdits] = React.useState<boolean>(false);

  return (
    <Context.Provider
      value={{
        visualNovel,
        setVisualNovel,

        spawnedCharacters,
        setSpawnedCharacters,
        activeBackground,
        setActiveBackground,

        // for toggle
        selectedCommand,
        setSelectedCommand,

        // for edit
        toggleEdits,
        setToggleEdits,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default BuilderProvider;
