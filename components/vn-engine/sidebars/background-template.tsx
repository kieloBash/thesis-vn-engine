"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

// CHARACTERS
import { useStoryContext } from "@/providers/story";
import clsx from "clsx";
import { BACKGROUNDS } from "@/constants";
import { CommandType, Dialogue } from "@/types";
import { generateRandomKey } from "@/helpers";
import { Slides, useBuilderContext } from "@/providers/builder";
import {
  AddBackground,
  Command,
  CommandsEnum,
} from "@/types/vn-engine/command-types";

const MoreBackgrounds = () => {
  const {
    visualNovel,
    setVisualNovel,
    setActiveBackground,
    spawnedCharacters,
  } = useBuilderContext();

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <h2 className="text-center text-2xl font-bold">Backgrounds</h2>
      <ScrollArea className="h-full w-full mt-4 px-2">
        <div className="w-full grid grid-cols-2 grid-flow-row gap-2">
          {BACKGROUNDS.map((bg, index) => {
            const activeSpeakerClassName = clsx(
              "group border h-40 shadow-sm relative overflow-hidden rounded-md p-0 transition-colors"
            );
            return (
              <button
                type="button"
                className={activeSpeakerClassName}
                key={index}
                onClick={() => {
                  const newData: AddBackground = {
                    id: generateRandomKey(),
                    dialogueType: "command",
                    background: bg,
                    type: CommandsEnum.AddBackground,
                  };
                  const newSlide: Slides = {
                    id: generateRandomKey(16),
                    dialogue: newData,
                    // activeBackground: bg,
                    spawnedCharacters,
                  };
                  setVisualNovel([...visualNovel, newSlide]);
                  setActiveBackground(bg);
                }}
              >
                <Image
                  src={bg?.image || ""}
                  alt={bg?.name}
                  fill
                  className="object-cover object-top group-hover:scale-110 transition-all peer"
                />
                <div className="w-full h-full absolute top-0 bg-transparent group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 left-0 w-full bg-white/50">
                  <h3 className="text-sm font-bold text-center">{bg.name}</h3>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MoreBackgrounds;
