"use client";
import { useStoryContext } from "@/providers/story";
import { BackgroundCommand, Command, CommandType, Dialogue } from "@/types";
import React from "react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import clsx from "clsx";
import {
  isActionCommand,
  isAudioCommand,
  isBackgroundCommand,
} from "@/helpers";
import useDisplayArg from "../hooks/useDisplayArg";
import { ArgumentTaxEnum } from "@/types/new-types";

const StoryLineCard = ({ line, idx }: { line: Dialogue; idx: string }) => {
  const {
    setToggleModify,
    setSelectedLine,
    setSelectedIndex,
    selectedIndex,
    argumentLines,
    story,
  } = useStoryContext();
  const activeClassName = clsx(
    "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all ",
    selectedIndex === idx
      ? "bg-main-300 text-white"
      : "bg-white hover:bg-accent"
  );

  const dialogue_arguments = useDisplayArg({
    args: argumentLines,
    key: idx,
  });

  // IF BACKGROUND COMMAND
  if (line.commands.length > 0 && isBackgroundCommand(line.commands[0]))
    return (
      <button
        className={activeClassName}
        onClick={() => {
          if (selectedIndex === idx) {
            setToggleModify(false);
            setSelectedLine(undefined);
            setSelectedIndex("");
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

  if (line.commands.length > 0 && isAudioCommand(line.commands[0]))
    return (
      <button
        className={activeClassName}
        onClick={() => {
          if (selectedIndex === idx) {
            setToggleModify(false);
            setSelectedLine(undefined);
            setSelectedIndex("");
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
                    if (isAudioCommand(com)) {
                      if (com.audio) {
                        return (
                          <div
                            key={idx}
                            className="px-2 py-1 rounded-full bg-slate-200 text-black"
                          >
                            <div className="flex gap-1 justify-center items-center">
                              <h4 className="font-bold text-xs">
                                {com.name}({com.audio.trackname})
                              </h4>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={idx}
                            className="px-2 py-1 rounded-full bg-red-200 text-black"
                          >
                            <div className="flex gap-1 justify-center items-center">
                              <h4 className="font-bold text-xs">
                                Click to select which audio to play
                              </h4>
                            </div>
                          </div>
                        );
                      }
                    }
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </button>
    );

  // IF ACTION COMMAND
  if (line.commands.length > 0 && isActionCommand(line.commands[0]))
    return (
      <button
        className={activeClassName}
        onClick={() => {
          if (selectedIndex === idx) {
            setToggleModify(false);
            setSelectedLine(undefined);
            setSelectedIndex("");
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
                    if (com.status === "ready") {
                      return (
                        <div
                          key={idx}
                          className="px-2 py-1 rounded-full bg-slate-200 text-black"
                        >
                          <div className="flex gap-1 justify-center items-center">
                            {com.name === "MoveCharacter" ? (
                              <>
                                <h4 className="font-bold text-xs">
                                  {com.name}({com.parameters[0]}{" "}
                                  {com.parameters[1]}:{com.parameters[2]}{" "}
                                  {com.parameters[3]} {com.parameters[4]})
                                </h4>
                              </>
                            ) : null}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={idx}
                          className="px-2 py-1 rounded-full bg-red-200 text-black"
                        >
                          <div className="flex gap-1 justify-center items-center">
                            <h4 className="font-bold text-xs">
                              Click to edit command
                            </h4>
                          </div>
                        </div>
                      );
                    }
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
            setSelectedIndex("");
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
              {line.speaker.name !== "ME" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={line.speaker.image.src}
                    alt="Pic"
                    className="object-cover object-top bg-main-100 border"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
              <div className="font-semibold">{line.speaker.name}</div>
            </div>
          </div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">
          {line.dialogue.substring(0, 300)}
        </div>
        <div className="flex flex-wrap gap-0.5 font-mono">
          {line.isSpawnSpeaker && line.speaker.name !== "ME" && (
            <span className="px-2 py-1 bg-main-500 text-white text-xs rounded-full">
              SpawnedCharacter({line.speaker.name.split(" ")[0]}{" "}
              {line.speaker.xPos}:0.5)
            </span>
          )}
          {dialogue_arguments.map((d, idx) => {
            if (d.tax === ArgumentTaxEnum.CLAIM)
              return (
                <span
                  className="px-2 py-1 bg-black text-white text-xs rounded-full"
                  key={idx}
                >
                  AddClaim(&ldquo;{d.claimKey}&ldquo;,&ldquo;{d.text}
                  &ldquo;,{d.type},{d.tax})
                </span>
              );
            else {
              return (
                <span
                  className="px-2 py-1 bg-black text-white text-xs rounded-full"
                  key={idx}
                >
                  AddChainArg(&ldquo;{d.claimKey}&ldquo;,&ldquo;
                  {d?.connectorKey}&ldquo;,&ldquo;{d.text}
                  &ldquo;,{d.tax})
                </span>
              );
            }
          })}
        </div>
      </button>
    );
};

export default StoryLineCard;
