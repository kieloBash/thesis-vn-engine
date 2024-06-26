"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import clsx from "clsx";
import { COMMANDS } from "@/constants";
import { ActionCommand, AudioCommand, Command, CommandType, Dialogue } from "@/types";
import { generateRandomKey } from "@/helpers";
import { useStoryContext } from "@/providers/story";

const MoreCommands = () => {
  const { story, setStory } = useStoryContext();
  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <h2 className="text-center text-2xl font-bold">Commands</h2>
      <ScrollArea className="h-full w-full mt-4 px-2">
        <div className="w-full grid grid-flow-row gap-2">
          {COMMANDS.map((com, index) => {
            const activeClassName = clsx(
              "border shadow-sm relative overflow-hidden rounded-md px-2 py-1 transition-colors bg-white hover:bg-main-100"
            );
            return (
              <button
                type="button"
                className={activeClassName}
                key={index}
                onClick={() => {
                  if (com.type === CommandType.Audio) {
                    const newCommand: AudioCommand = {
                      name: com.name,
                      type: CommandType.Audio,
                      parameters: [],
                      status: "disabled",
                    };
                    const newAudioCommand: Dialogue = {
                      lineNum: generateRandomKey(),
                      commands: [newCommand],
                      arguments: [],
                      type: "CommandOnly",
                    };
                    setStory([...story, newAudioCommand]);
                  } else if (com.type === CommandType.Action) {
                    const newCommand: ActionCommand = {
                      name: com.name,
                      type: CommandType.Action,
                      parameters: [],
                      status: "disabled",
                    };

                    const newActionCommand: Dialogue = {
                      lineNum: generateRandomKey(),
                      commands: [newCommand],
                      arguments: [],
                      type: "CommandOnly",
                    };
                    setStory([...story, newActionCommand]);
                  }
                }}
              >
                <div className="w-full">
                  <h3 className="font-semibold text-lg text-left">
                    {com.name}()
                  </h3>
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
