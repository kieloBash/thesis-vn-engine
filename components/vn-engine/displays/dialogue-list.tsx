"use client";
import { useBuilderContext } from "@/providers/builder";
import { isConversation } from "@/types/vn-engine/main-types";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolsSummary from "../tools-summary/summary";
import {
  isAddBackgroundCommand,
  isCommand,
} from "@/types/vn-engine/command-types";

const DialogueList = () => {
  const { visualNovel } = useBuilderContext();
  return (
    <div className="col-span-4 overflow-hidden flex flex-col h-screen py-8 gap-8">
      <ScrollArea className="flex-1">
        {visualNovel.map((single) => {
          if (isConversation(single.dialogue)) {
            const conversation = single.dialogue;
            return (
              <div
                key={single.id}
                className="w-full mt-2 bg-white min-h-20 p-2 rounded-md shadow-sm flex flex-col justify-center items-start"
              >
                <div className="flex gap-4 justify-start items-center">
                  <Avatar>
                    <AvatarImage
                      src={conversation.speaker?.image?.src}
                      alt="Pic"
                      className="object-cover object-top bg-main-100 border"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h3 className="font-bold">
                      {conversation.speaker.name}{" "}
                      <span className="font-normal">
                        {conversation.altName !== "" && conversation.altName
                          ? `as ${conversation.altName}`
                          : ""}
                      </span>
                    </h3>
                    <p className="text-xs">{conversation.line}</p>
                  </div>
                </div>
                <div className=""></div>
              </div>
            );
          } else if (isCommand(single.dialogue)) {
            if (isAddBackgroundCommand(single.dialogue)) {
              const bgCommand = single.dialogue;
              return (
                <div
                  key={single.id}
                  className="w-full mt-2 bg-white min-h-20 p-2 rounded-md shadow-sm flex flex-col justify-center items-start"
                >
                  <div className="flex gap-2 justify-start items-center">
                    <Avatar>
                      <AvatarImage
                        src={bgCommand.background?.image?.src}
                        alt="BG"
                        className="object-cover object-top bg-main-100 border"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <span className="">Add Background Scene:</span>
                      <h3 className="font-bold">{bgCommand.background.name}</h3>
                    </div>
                  </div>
                </div>
              );
            }
          }
        })}
      </ScrollArea>
      <ToolsSummary />
    </div>
  );
};

export default DialogueList;
