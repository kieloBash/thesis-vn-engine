"use client";
import { CommandsEnum } from "@/types/vn-engine/command-types";
import { Background, Character, Dialogue } from "@/types/vn-engine/main-types";
import * as React from "react";
export interface SpawnedCharacterType extends Character {
  xPos?: number;
  isHidden: boolean;
  isFlipped: boolean;
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
  selectedSlide: Slides | undefined;
  selectedCommand:
    | { command?: CommandsEnum; id: string; isConvo?: boolean }
    | undefined;
  setSelectedCommand: (
    temp: { command?: CommandsEnum; id: string; isConvo?: boolean } | undefined
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
  selectedSlide: undefined,
  selectedCommand: undefined,
  setSelectedCommand: (
    temp: { command?: CommandsEnum; id: string; isConvo?: boolean } | undefined
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
    { command?: CommandsEnum; id: string; isConvo?: boolean } | undefined
  >(undefined);
  const [toggleEdits, setToggleEdits] = React.useState<boolean>(false);

  const selectedSlide = React.useMemo(() => {
    return visualNovel.find((d) => d.id === selectedCommand?.id);
  }, [visualNovel, selectedCommand]);

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
        selectedSlide,
        toggleEdits,
        setToggleEdits,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default BuilderProvider;
