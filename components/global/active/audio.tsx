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
import { AUDIOS, BACKGROUNDS, SFX } from "@/constants";
import {
  Audio,
  AudioCommand,
  Background,
  BackgroundCommand,
  CommandType,
  Dialogue,
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

const AudioCommandTemplate = ({ command }: { command: AudioCommand }) => {
  const { story, selectedIndex, setStory, resetModify, selectedLine } =
    useStoryContext();
  const [currAudio, setcurrAudio] = useState<Audio | undefined>(command?.audio);
  useEffect(() => {
    if (command) {
      setcurrAudio(command?.audio);
    }
  }, [command]);

  const [channel, setChannel] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.4);
  const [pitch, setPitch] = useState<number>(1);
  const [starting_vol, setStartingVol] = useState<number>(1);
  const [loop, setLoop] = useState<boolean>(false);

  function resetForm() {
    setcurrAudio(undefined);
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
    if (!selectedLine || !currAudio) return null;

    let newDialogue: Dialogue = selectedLine;
    let newCommand: AudioCommand = {
      name: command.name,
      type: command.type,
      parameters: [currAudio.trackname],
      audio: { ...currAudio, channel, volume, pitch, starting_vol, loop },
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
            {command.name === "playtrack" ? (
              <>
                <div className="grid grid-cols-1 gap-1 px-4">
                  <Label className="font-bold">Audio Track</Label>
                  <Select
                    value={currAudio?.trackname || ""}
                    onValueChange={(e) => {
                      const sel = AUDIOS.find(
                        (d) => d.trackname.toLowerCase() === e.toLowerCase()
                      );
                      setcurrAudio(sel);
                    }}
                  >
                    <SelectTrigger className="w-[320px]">
                      <SelectValue placeholder="Select an audio" />
                    </SelectTrigger>
                    <SelectContent id="audio">
                      <SelectGroup>
                        <SelectLabel>Audio</SelectLabel>
                        {AUDIOS.map((data, idx) => {
                          return (
                            <SelectItem key={idx} value={data.trackname}>
                              <div className="flex gap-1 justify-center items-center">
                                <h4 className="">{data.trackname}</h4>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-1 px-4">
                  <Label className="font-bold">Channel</Label>
                  <Input
                    type="number"
                    value={channel}
                    onChange={(e) => setChannel(e.target.valueAsNumber)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-1 px-4">
                  <Label className="font-bold">Volume</Label>
                  <Input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.valueAsNumber)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-1 px-4">
                  <Label className="font-bold">Pitch</Label>
                  <Input
                    type="number"
                    value={pitch}
                    onChange={(e) => setPitch(e.target.valueAsNumber)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-1 px-4">
                  <Label className="font-bold">Starting Volume</Label>
                  <Input
                    type="number"
                    value={starting_vol}
                    onChange={(e) => setStartingVol(e.target.valueAsNumber)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-1 px-4">
                  <Label className="font-bold">Loop</Label>
                  <Select
                    value={`${loop ? "true" : "false"}`}
                    onValueChange={(e) => {
                      setLoop(e === "true" ? true : false);
                    }}
                  >
                    <SelectTrigger className="w-[320px]">
                      <SelectValue placeholder="Loop" />
                    </SelectTrigger>
                    <SelectContent id="loop">
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

            {command.name === "playsoundeffect" ? (
              <>
                <div className="grid grid-cols-1 gap-1 px-4">
                  <Label className="font-bold">Sound Effect</Label>
                  <Select
                    value={currAudio?.trackname || ""}
                    onValueChange={(e) => {
                      const sel = SFX.find(
                        (d) => d.trackname.toLowerCase() === e.toLowerCase()
                      );
                      setcurrAudio(sel);
                    }}
                  >
                    <SelectTrigger className="w-[320px]">
                      <SelectValue placeholder="Select a sound effect" />
                    </SelectTrigger>
                    <SelectContent id="sfx">
                      <SelectGroup>
                        <SelectLabel>Sound Effect</SelectLabel>
                        {SFX.map((data, idx) => {
                          return (
                            <SelectItem key={idx} value={data.trackname}>
                              <div className="flex gap-1 justify-center items-center">
                                <h4 className="">{data.trackname}</h4>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-1 px-4">
                  <Label className="font-bold">Volume</Label>
                  <Input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.valueAsNumber)}
                  />
                </div>
              </>
            ) : null}
          </div>
        </>
        <div className="flex-1">
          {/* DISPLAY */}
          <>
            <div className="p-2 flex w-full flex-1">
              <div className="flex-1 border rounded-md p-2">
                {selectedLine && currAudio ? (
                  <p className="text-sm font-mono">
                    <span className="">{command.name}</span>
                    {command.name === "playtrack" ? (
                      <>
                        <span className="">
                          (&ldquo;{currAudio.trackname.split(" ")}&ldquo;{" "}
                          {channel} {volume} {pitch} {starting_vol}{" "}
                          {loop ? "true" : "false"})
                        </span>
                      </>
                    ) : null}
                    {command.name === "playsoundeffect" ? (
                      <>
                        <span className="">
                          (&ldquo;{currAudio.trackname.split(" ")}&ldquo;{" "}
                          {volume})
                        </span>
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
          <Button size={"sm"} type="submit" disabled={!currAudio}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AudioCommandTemplate;
