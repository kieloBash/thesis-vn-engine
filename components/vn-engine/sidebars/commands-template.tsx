"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import clsx from "clsx";
import { generateRandomKey } from "@/helpers";
import {
  AddBackground,
  Command,
  CommandsEnum,
  CreateCharacter,
  MoveCharacter,
  RemoveBackground,
} from "@/types/vn-engine/command-types";
import { Slides, useBuilderContext } from "@/providers/builder";

const MoreCommands = () => {
  const commandKeys = Object.keys(CommandsEnum).map(
    (key) => key as keyof typeof CommandsEnum
  );
  const { visualNovel, setVisualNovel } = useBuilderContext();
  function handleCommandClick(command: CommandsEnum) {
    let newData: Command | undefined;
    switch (command) {
      case CommandsEnum.AddBackground:
        const addBG: AddBackground = {
          id: generateRandomKey(),
          type: CommandsEnum.AddBackground,
          dialogueType: "command",
        };
        newData = addBG;
        break;
      case CommandsEnum.RemoveBackground:
        const remBG: RemoveBackground = {
          id: generateRandomKey(),
          type: CommandsEnum.RemoveBackground,
          dialogueType: "command",
        };
        newData = remBG;
        break;
      case CommandsEnum.MoveCharacter:
        const moveChar: MoveCharacter = {
          id: generateRandomKey(),
          type: CommandsEnum.MoveCharacter,
          dialogueType: "command",
        };
        newData = moveChar;
        break;
      case CommandsEnum.CreateCharacter:
        const createChar: CreateCharacter = {
          id: generateRandomKey(),
          type: CommandsEnum.CreateCharacter,
          dialogueType: "command",
          enabledOnSpawn: true,
          immediate: false,
          startXpos: 0.5,
        };
        newData = createChar;
        break;
      default:
        break;
    }
    if (!newData) return;

    const newSlide: Slides = {
      id: generateRandomKey(16),
      dialogue: newData,
      spawnedCharacters: [],
    };
    setVisualNovel([...visualNovel, newSlide]);
  }

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <h2 className="text-center text-2xl font-bold">Commands</h2>
      <ScrollArea className="h-full w-full mt-4 px-2">
        <div className="w-full grid grid-flow-row gap-2">
          {commandKeys.map((com, index) => {
            const activeClassName = clsx(
              "border shadow-sm relative overflow-hidden rounded-md px-2 py-1 transition-colors bg-white hover:bg-main-100"
            );
            const commandValue = CommandsEnum[com];

            return (
              <button
                type="button"
                className={activeClassName}
                key={index}
                onClick={() => {
                  handleCommandClick(commandValue);
                }}
              >
                <div className="w-full">
                  <h3 className="font-semibold text-lg text-left">{com}()</h3>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MoreCommands;
