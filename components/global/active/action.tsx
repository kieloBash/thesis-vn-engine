"use client";
import React, { FormEvent, KeyboardEvent, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AUDIOS, BACKGROUNDS, CHARACTERS, SFX } from "@/constants";
import {
  ActionCommand,
  Audio,
  AudioCommand,
  Background,
  BackgroundCommand,
  Command,
  CommandType,
  Dialogue,
  Speaker,
} from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipButton } from "../tooltip-btn";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useStoryContext } from "@/providers/story";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ActionCommandTemplate = ({ command }: { command: ActionCommand }) => {
  const {
    story,
    selectedIndex,
    setStory,
    resetModify,
    selectedLine,
    spawnedSpeakers,
  } = useStoryContext();
  const [currCom, setcurrCom] = useState<ActionCommand | undefined>(command);
  useEffect(() => {
    if (command) {
      setcurrCom(command);
    }
  }, [command]);

  const [xPos, setxPos] = useState<number>(command.xPos || 0.5);
  const [isInstant, setIsInstant] = useState<boolean>(
    command.isInstant || false
  );
  const [spd, setSPD] = useState<number>(command.speed_duration || 1);
  const [currSpeaker, setcurrSpeaker] = useState<Speaker | undefined>(
    command.speaker || undefined
  );

  function resetForm() {
    setcurrCom(undefined);
  }
  function handleDeleteDialogue() {
    let newStory = [...story];
    const index = newStory.findIndex((d) => d.lineNum === selectedIndex);
    if (index === -1) return;

    newStory.splice(index, 1);
    setStory(newStory);

    resetForm();
    resetModify();
  }
  function handleSubmitNewStoryLine(e: FormEvent) {
    e.preventDefault();
    ModifyChanges();
  }
  function ModifyChanges() {
    if (!selectedLine || !currCom || !currSpeaker) return null;

    let newDialogue: Dialogue = selectedLine;
    let newCommand: ActionCommand = {
      name: command.name,
      type: command.type,
      parameters: [
        currSpeaker.name.split(" ")[0],
        `${xPos}`,
        "0.5",
        `${spd}`,
        isInstant ? "true" : "false",
      ],
      speaker: currSpeaker,
      xPos,
      isInstant,
      speed_duration: spd,

      status: "ready",
    };
    newDialogue.commands[0] = newCommand;

    let newStory = [...story];
    const index = newStory.findIndex((d) => d.lineNum === selectedIndex);
    if (index === -1) return;

    newStory[index] = newDialogue;
    setStory(newStory);

    resetModify();
    resetForm();
  }

  return (
    <div className="col-span-3 flex flex-col h-full bg-white">
      <form
        onSubmit={handleSubmitNewStoryLine}
        className="w-full h-full flex flex-col"
      >
        <div className="w-full justify-between gap-1 items-center flex px-4 py-1">
          <h2 className="">{command.name}()</h2>
          <div className="flex gap-1">
            <TooltipButton tip="Delete">
              <Button
                onClick={handleDeleteDialogue}
                type="button"
                variant={"ghost"}
                size={"icon"}
              >
                <Trash2Icon />
              </Button>
            </TooltipButton>
            <TooltipButton tip="New">
              <Button
                onClick={resetModify}
                type="button"
                variant={"ghost"}
                size={"icon"}
              >
                <PlusIcon />
              </Button>
            </TooltipButton>
          </div>
        </div>
        <Separator className="mb-4" />

        {/* PARAMS */}
        <>
          <div className="grid gap-4 mt-4">
            {command.name === "MoveCharacter" ? (
              <>
                <div className="grid grid-cols-1 gap-1 px-4">
                  <Label className="font-bold">Character</Label>
                  <Select
                    value={currSpeaker?.name || ""}
                    onValueChange={(e) => {
                      const selSpeaker = spawnedSpeakers.find(
                        (d) => d.name === e
                      );
                      setcurrSpeaker(selSpeaker);
                    }}
                  >
                    <SelectTrigger className="w-[320px] h-8">
                      <SelectValue placeholder="Select a character" />
                    </SelectTrigger>
                    <SelectContent id="character">
                      <SelectGroup>
                        <SelectLabel>Speaker</SelectLabel>
                        {spawnedSpeakers.map((data, idx) => {
                          if (data.name !== "ME")
                            return (
                              <SelectItem key={idx} value={data.name}>
                                <div className="flex gap-1 justify-center items-center">
                                  {data.name !== "ME" && (
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage
                                        src={data.image.src}
                                        alt="Pic"
                                        className="object-cover object-top bg-main-100 border"
                                      />
                                      <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                  )}
                                  <h4 className="font-semibold">{data.name}</h4>
                                </div>
                              </SelectItem>
                            );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-1 px-4">
                  <Label className="font-bold">X Position</Label>
                  <Select
                    value={`${xPos === 0.5 ? "0.5" : xPos === 0 ? "0" : "1"}`}
                    onValueChange={(e) => {
                      setxPos(e === "0.5" ? 0.5 : e === "0" ? 0 : 1);
                    }}
                  >
                    <SelectTrigger className="w-[320px]">
                      <SelectValue placeholder="xPos" />
                    </SelectTrigger>
                    <SelectContent id="xPos">
                      <SelectGroup>
                        <SelectLabel>X Position</SelectLabel>
                        <SelectItem value={"0"}>Left</SelectItem>
                        <SelectItem value={"0.5"}>Center</SelectItem>
                        <SelectItem value={"1"}>Right</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-1 px-4">
                  <Label className="font-bold">Speed/Duration</Label>
                  <Input
                    type="number"
                    value={spd}
                    onChange={(e) => setSPD(e.target.valueAsNumber)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-1 px-4">
                  <Label className="font-bold">Instant</Label>
                  <Select
                    value={`${isInstant ? "true" : "false"}`}
                    onValueChange={(e) => {
                      setIsInstant(e === "true" ? true : false);
                    }}
                  >
                    <SelectTrigger className="w-[320px]">
                      <SelectValue placeholder="Loop" />
                    </SelectTrigger>
                    <SelectContent id="isInstant">
                      <SelectGroup>
                        <SelectLabel>Loop</SelectLabel>
                        <SelectItem value={"true"}>true</SelectItem>
                        <SelectItem value={"false"}>false</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : null}
          </div>
        </>
        <div className="flex-1">
          {/* DISPLAY */}
          <>
            {command.name === "MoveCharacter" && currSpeaker ? (
              <>
                <div className="h-56 relative overflow-hidden rounded-md mt-4 px-4">
                  <div className="w-full h-full border p-2 rounded-md  bg-slate-800 grid grid-cols-3 divide-x divide-dashed">
                    <div className="flex justify-center items-end">
                      {currSpeaker &&
                        currSpeaker.name !== "ME" &&
                        xPos === 0 && (
                          <Image
                            alt="speaker"
                            src={currSpeaker?.image.src}
                            width={70}
                            height={70}
                          />
                        )}
                    </div>
                    <div className="flex justify-center items-end">
                      {currSpeaker &&
                        currSpeaker.name !== "ME" &&
                        xPos === 0.5 && (
                          <Image
                            alt="speaker"
                            src={currSpeaker?.image.src}
                            width={70}
                            height={70}
                          />
                        )}
                    </div>
                    <div className="flex justify-center items-end">
                      {currSpeaker &&
                        currSpeaker.name !== "ME" &&
                        xPos === 1 && (
                          <Image
                            alt="speaker"
                            src={currSpeaker?.image?.src}
                            width={70}
                            height={70}
                          />
                        )}
                    </div>
                  </div>
                  <div className="w-full absolute bottom-0 h-12 bg-black/30 p-4 flex justify-center items-center"></div>
                </div>
              </>
            ) : null}
            <div className="p-2 flex w-full flex-1">
              <div className="flex-1 border rounded-md p-2">
                {selectedLine && currCom ? (
                  <p className="text-sm font-mono">
                    <span className="">{command.name}</span>
                    {command.name === "MoveCharacter" && currSpeaker ? (
                      <>
                        <span className="">
                          ({currSpeaker?.name.split(" ")[0]} {xPos}:0.5 {spd}{" "}
                          {isInstant ? "true" : "false"})
                        </span>
                      </>
                    ) : null}
                    {command.name === "playsoundeffect" ? (
                      <>
                        <span className=""></span>
                      </>
                    ) : null}
                  </p>
                ) : null}
              </div>
            </div>
          </>
        </div>
        <Separator className="mt-4" />
        <div className="w-full justify-end gap-1 items-center flex px-4 py-2">
          <Button size={"sm"} type="submit" disabled={!currCom}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ActionCommandTemplate;
