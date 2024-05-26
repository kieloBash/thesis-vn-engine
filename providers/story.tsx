"use client";
import { Argument, Speaker, StoryLine } from "@/types";
import * as React from "react";

type ContextType = {
  speaker: Speaker | undefined;
  setSpeaker: (temp: Speaker | undefined) => void;
  story: StoryLine[];
  setStory: (temp: StoryLine[]) => void;
  argumentLines: Argument[];
  setArguments: (temp: Argument[]) => void;

  selectedLine: StoryLine | undefined;
  setSelectedLine: (temp: StoryLine | undefined) => void;
  selectedIndex: number;
  setSelectedIndex: (temp: number) => void;

  toggleModify: boolean;
  setToggleModify: (temp: boolean) => void;

  resetModify: () => void;
};

const Context = React.createContext<ContextType>({
  speaker: undefined,
  setSpeaker: (temp: Speaker | undefined) => {},
  story: [],
  setStory: (temp: StoryLine[]) => {},
  argumentLines: [],
  setArguments: (temp: Argument[]) => {},

  selectedLine: undefined,
  setSelectedLine: (temp: StoryLine | undefined) => {},
  selectedIndex: -1,
  setSelectedIndex: (temp: number) => {},

  toggleModify: false,
  setToggleModify: (temp: boolean) => {},

  resetModify: () => {},
});

export const useStoryContext = () => React.useContext(Context);

const StoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [speaker, setSpeaker] = React.useState<Speaker | undefined>();
  const [story, setStory] = React.useState<StoryLine[]>([]);
  const [argumentLines, setArguments] = React.useState<Argument[]>([]);

  const [selectedLine, setSelectedLine] = React.useState<
    StoryLine | undefined
  >();
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);
  const [toggleModify, setToggleModify] = React.useState<boolean>(false);

  function resetModify() {
    setSelectedIndex(-1);
    setSelectedLine(undefined);
    setToggleModify(false);
  }

  return (
    <Context.Provider
      value={{
        speaker,
        setSpeaker,
        story,
        setStory,
        argumentLines,
        setArguments,

        selectedLine,
        setSelectedLine,
        selectedIndex,
        setSelectedIndex,

        toggleModify,
        setToggleModify,

        resetModify,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default StoryProvider;
