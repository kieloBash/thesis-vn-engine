"use client";
import { useStoryContext } from "@/providers/story";
import { BackgroundCommand, Command, CommandType, Dialogue } from "@/types";
import React from "react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import clsx from "clsx";
import { isBackgroundCommand } from "@/helpers";

const StoryLineCard = ({ line, idx }: { line: Dialogue; idx: number }) => {
  const { setToggleModify, setSelectedLine, setSelectedIndex, selectedIndex } =
    useStoryContext();
  const activeClassName = clsx(
    "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all ",
    selectedIndex === idx
      ? "bg-main-300 text-white"
      : "bg-white hover:bg-accent"
  );

  if (line.commands.length > 0 && isBackgroundCommand(line.commands[0]))
    return (
      <button
        className={activeClassName}
        onClick={() => {
          if (selectedIndex === idx) {
            setToggleModify(false);
            setSelectedLine(undefined);
            setSelectedIndex(-1);
          } else {
            setToggleModify(true);
            setSelectedLine(line);
            setSelectedIndex(idx);
          }
        }}
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex gap-2">
              {line.commands.length ? (
                <div className="flex items-center gap-2">
                  {line.commands.map((com, idx) => {
                    if (isBackgroundCommand(com))
                      return (
                        <div
                          key={idx}
                          className="px-2 py-1 rounded-full bg-slate-200 text-black"
                        >
                          <div className="flex gap-1 justify-center items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={com.bg.image.src}
                                alt="Pic"
                                className="object-cover object-top bg-main-100 border"
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h4 className="font-bold text-xs">
                              {com.name}({com.bg.name})
                            </h4>
                          </div>
                        </div>
                      );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </button>
    );

  //IF NOT COMMAND ONLY
  if (line.speaker && line.dialogue)
    return (
      <button
        className={activeClassName}
        onClick={() => {
          if (selectedIndex === idx) {
            setToggleModify(false);
            setSelectedLine(undefined);
            setSelectedIndex(-1);
          } else {
            setToggleModify(true);
            setSelectedLine(line);
            setSelectedIndex(idx);
          }
        }}
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{line.speaker.name}</div>
            </div>
          </div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">
          {line.dialogue.substring(0, 300)}
        </div>
        <div className="flex gap-2">
          {line.arguments.length ? (
            <div className="flex items-center gap-2">
              {line.arguments.map((arg, idx) => (
                <Badge key={idx} variant={"default"}>
                  {arg.tax}/{arg.type}: {arg.line.substring(0, 24)}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </button>
    );
};

export default StoryLineCard;
