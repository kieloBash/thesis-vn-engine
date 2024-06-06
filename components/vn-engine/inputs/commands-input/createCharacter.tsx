"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";

import { Character } from "@/types/vn-engine/main-types";
import React, { FormEvent, useEffect, useState } from "react";
import { CHARACTERS } from "@/constants";
import { useBuilderContext } from "@/providers/builder";
import Image from "next/image";
import {
  isCommand,
  isCreateCharacterCommand,
} from "@/types/vn-engine/command-types";

const CreateCharacterInput = () => {
  const {
    visualNovel,
    setVisualNovel,
    selectedCommand,
    setSelectedCommand,
    selectedSlide,
  } = useBuilderContext();

  const [speaker, setSpeaker] = useState<Character | undefined>(undefined);
  const [xPos, setxPos] = useState<number>(0.5);
  const [enabledOnSpawn, setEnabledOnSpawn] = useState<boolean>(false);
  const [immediate, setImmediate] = useState<boolean>(false);

  useEffect(() => {
    if (
      selectedSlide &&
      isCommand(selectedSlide.dialogue) &&
      isCreateCharacterCommand(selectedSlide.dialogue) &&
      !speaker
    ) {
      setSpeaker(selectedSlide.dialogue.speaker);
      if (
        selectedSlide.dialogue.startXpos === 0 ||
        selectedSlide.dialogue.startXpos === 0.5 ||
        selectedSlide.dialogue.startXpos === 1
      ) {
        setxPos(selectedSlide.dialogue.startXpos);
      }
      setImmediate(selectedSlide.dialogue.immediate);
      setEnabledOnSpawn(selectedSlide.dialogue.enabledOnSpawn);
    }
  }, [selectedCommand, selectedSlide, speaker]);

  // UTILITIES
  function resetForm() {
    setSpeaker(undefined);
  }
  // FUNCTIONS
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!speaker || !selectedCommand) return null;

    const selectedIdx = visualNovel.findIndex(
      (d) => d.id === selectedCommand.id
    );
    if (selectedIdx === -1) return;
    let newSlides = [...visualNovel];
    let newData = {
      ...newSlides[selectedIdx].dialogue,
      speaker,
      startXpos: xPos,
      enabledOnSpawn,
      immediate,
    };
    newSlides[selectedIdx] = { ...newSlides[selectedIdx], dialogue: newData };
    setVisualNovel(newSlides);
    setSelectedCommand(undefined);
    resetForm();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-screen flex flex-col gap-4 relative"
    >
      {/* HEADER */}
      <div className="absolute top-0 z-10 bg-white h-14 border-b w-full flex justify-between items-center p-4">
        <h3 className="font-medium text-lg">COMMAND: Create Character</h3>
        <div className="flex gap-2"></div>
      </div>

      {/* MAIN */}
      <ScrollArea className={"mt-14 h-full w-full flex flex-col gap-2 px-4"}>
        <div className="grid gap-0.5 mt-4 px-2">
          <Label className="uppercase font-medium">Character</Label>
          <Select
            value={speaker?.name!!}
            onValueChange={(e) => {
              const selSpeaker = CHARACTERS.find((d) => d.name === e);
              setSpeaker(selSpeaker);
            }}
          >
            <SelectTrigger className="w-[320px]">
              <SelectValue placeholder="Select a speaker" />
            </SelectTrigger>
            <SelectContent id="speaker">
              <SelectGroup>
                <SelectLabel>Speaker</SelectLabel>
                {CHARACTERS.map((data, idx) => {
                  return (
                    <SelectItem key={idx} value={data.name}>
                      <div className="flex gap-1 justify-center items-center">
                        {data.name !== "ME" && (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={data.image.src}
                                alt="Pic"
                                className="object-cover object-top bg-main-100 border"
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h4 className="font-semibold">{data.name}</h4>
                          </>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-0.5 mt-4 px-2">
          <Label htmlFor="dialogue" className="uppercase font-medium">
            Starting Position
          </Label>
          <Select
            value={`${
              xPos === 0.5 ? "0.5" : xPos === 0 ? "0" : xPos === 1 ? "1" : ""
            }`}
            onValueChange={(e) => {
              setxPos(e === "0.5" ? 0.5 : e === "0" ? 0 : 1);
            }}
          >
            <SelectTrigger className="w-[320px]">
              <SelectValue placeholder="Select a new position" />
            </SelectTrigger>
            <SelectContent id="xPos">
              <SelectGroup>
                <SelectLabel>Position</SelectLabel>
                <SelectItem value={"0"}>Left</SelectItem>
                <SelectItem value={"0.5"}>Center</SelectItem>
                <SelectItem value={"1"}>Right</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-0.5 mt-4 px-2">
          <Label htmlFor="dialogue" className="uppercase font-medium">
            Visibility
          </Label>
          <Select
            value={`${enabledOnSpawn ? "Visible" : "Hidden"}`}
            onValueChange={(e) => {
              setEnabledOnSpawn(e === "Visible" ? true : false);
            }}
          >
            <SelectTrigger className="w-[320px]">
              <SelectValue placeholder="Select a one" />
            </SelectTrigger>
            <SelectContent id="visibility">
              <SelectGroup>
                <SelectLabel>Visibility</SelectLabel>
                {["Visible", "Hidden"].map((d, index) => {
                  return (
                    <SelectItem key={index} value={d}>
                      {d}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-0.5 mt-4 px-2">
          <Label htmlFor="dialogue" className="uppercase font-medium">
            TRANSITION
          </Label>
          <Select
            value={`${immediate ? "Immediate" : "Fade In"}`}
            onValueChange={(e) => {
              setImmediate(e === "Immediate" ? true : false);
            }}
          >
            <SelectTrigger className="w-[320px]">
              <SelectValue placeholder="Select a one" />
            </SelectTrigger>
            <SelectContent id="Transition">
              <SelectGroup>
                <SelectLabel>Transition</SelectLabel>
                {["Immediate", "Fade In"].map((d, index) => {
                  return (
                    <SelectItem key={index} value={d}>
                      {d}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </ScrollArea>

      {/* PREVIEW */}
      {speaker && (
        <div className="w-full h-80 px-10 mb-14 relative overflow-hidden">
          <div className="w-full h-full overflow-hidden relative border rounded-lg shadow-sm bg-slate-800 grid grid-cols-3 divide-x divide-dashed">
            <div className="flex justify-center items-end">
              {speaker &&
                speaker.name !== "ME" &&
                xPos === 0 &&
                enabledOnSpawn && (
                  <Image
                    alt="speaker"
                    src={speaker.image.src}
                    width={85}
                    height={85}
                  />
                )}
            </div>
            <div className="flex justify-center items-end">
              {speaker &&
                speaker.name !== "ME" &&
                xPos === 0.5 &&
                enabledOnSpawn && (
                  <Image
                    alt="speaker"
                    src={speaker.image.src}
                    width={85}
                    height={85}
                  />
                )}
            </div>
            <div className="flex justify-center items-end">
              {speaker &&
                speaker.name !== "ME" &&
                xPos === 1 &&
                enabledOnSpawn && (
                  <Image
                    alt="speaker"
                    src={speaker.image?.src}
                    width={85}
                    height={85}
                  />
                )}
            </div>

            <div className="w-full absolute bottom-0 h-14 bg-black/50 p-4 flex flex-col justify-center items-start">
              <span className="text-[10px] text-white font-bold">
                {speaker.name.split(" ")[0]}
              </span>
              <p className="flex-1 flex-shrink-0 text-[10px] text-white text-wrap">
                Here is the sample dialogue for preview...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="absolute bottom-0 z-10 bg-white h-14 border-t w-full flex justify-between items-center p-4">
        <h3 className="font-bold text-xs"></h3>
        <div className="flex gap-2">
          <Button type="submit" size={"sm"} disabled={!speaker}>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateCharacterInput;
