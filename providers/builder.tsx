"use client";
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
};

const Context = React.createContext<ContextType>({
  visualNovel: [],
  setVisualNovel: (temp: Slides[]) => {},

  spawnedCharacters: [],
  setSpawnedCharacters: (temp: SpawnedCharacterType[]) => {},
  activeBackground: undefined,
  setActiveBackground: (temp: Background | undefined) => {},
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

  return (
    <Context.Provider
      value={{
        visualNovel,
        setVisualNovel,

        spawnedCharacters,
        setSpawnedCharacters,
        activeBackground,
        setActiveBackground,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default BuilderProvider;
