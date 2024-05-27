"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

// CHARACTERS
import { useStoryContext } from "@/providers/story";
import clsx from "clsx";
import { BACKGROUNDS } from "@/constants";
import { BackgroundCommand, CommandType, Dialogue } from "@/types";

const MoreBackgrounds = () => {
  const { speaker, story, setStory } = useStoryContext();

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <h2 className="text-center text-2xl font-bold">Backgrounds</h2>
      <ScrollArea className="h-full w-full mt-4 px-2">
        <div className="w-full grid grid-cols-2 grid-flow-row gap-2">
          {BACKGROUNDS.map((bg, index) => {
            const activeSpeakerClassName = clsx(
              "group border h-40 shadow-sm relative overflow-hidden rounded-md p-0 transition-colors",
              speaker?.name === bg.name
                ? "bg-main-200"
                : "bg-white hover:bg-main-100"
            );
            return (
              <button
                type="button"
                className={activeSpeakerClassName}
                key={index}
                onClick={() => {
                  const newCommand: BackgroundCommand = {
                    name: "AddBackground",
                    type: CommandType.Background,
                    parameters: [bg.name],
                    bg,
                  };
                  const newBackground: Dialogue = {
                    lineNum: story.length,
                    commands: [newCommand],
                    arguments: [],
                    type: "CommandOnly",
                  };
                  setStory([...story, newBackground]);
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
