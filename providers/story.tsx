"use client";
import { Argument, Speaker, Dialogue } from "@/types";
import { FullArgument } from "@/types/new-types";
import * as React from "react";

type ContextType = {
  speaker: Speaker | undefined;
  setSpeaker: (temp: Speaker | undefined) => void;
  story: Dialogue[];
  setStory: (temp: Dialogue[]) => void;

  spawnedSpeakers: Speaker[];
  setspawnedSpeakers: (temp: Speaker[]) => void;

  argumentLines: FullArgument[];
  setArguments: (temp: FullArgument[]) => void;

  selectedLine: Dialogue | undefined;
  setSelectedLine: (temp: Dialogue | undefined) => void;
  selectedIndex: string;
  setSelectedIndex: (temp: string) => void;

  toggleModify: boolean;
  setToggleModify: (temp: boolean) => void;

  resetModify: () => void;
  AddDialogue: (newDialogue: Dialogue) => void;
};

const Context = React.createContext<ContextType>({
  speaker: undefined,
  setSpeaker: (temp: Speaker | undefined) => {},
  story: [],
  setStory: (temp: Dialogue[]) => {},

  spawnedSpeakers: [],
  setspawnedSpeakers: (temp: Speaker[]) => {},

  argumentLines: [],
  setArguments: (temp: FullArgument[]) => {},

  selectedLine: undefined,
  setSelectedLine: (temp: Dialogue | undefined) => {},
  selectedIndex: "",
  setSelectedIndex: (temp: string) => {},

  toggleModify: false,
  setToggleModify: (temp: boolean) => {},

  resetModify: () => {},
  AddDialogue: (newDialogue: Dialogue) => {},
});

export const useStoryContext = () => React.useContext(Context);

const StoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [speaker, setSpeaker] = React.useState<Speaker | undefined>();
  const [story, setStory] = React.useState<Dialogue[]>([]);
  const [argumentLines, setArguments] = React.useState<FullArgument[]>([]);

  const [selectedLine, setSelectedLine] = React.useState<
    Dialogue | undefined
  >();
  const [selectedIndex, setSelectedIndex] = React.useState<string>("");
  const [toggleModify, setToggleModify] = React.useState<boolean>(false);

  const [spawnedSpeakers, setspawnedSpeakers] = React.useState<Speaker[]>([]);

  const AddDialogue = (newDialogue: Dialogue) => {
    setStory((prev) => [...prev, newDialogue]);
  };

  function resetModify() {
    setSelectedIndex("");
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
        spawnedSpeakers,
        setspawnedSpeakers,
        argumentLines,
        setArguments,

        selectedLine,
        setSelectedLine,
        selectedIndex,
        setSelectedIndex,

        toggleModify,
        setToggleModify,

        resetModify,
        AddDialogue,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default StoryProvider;
