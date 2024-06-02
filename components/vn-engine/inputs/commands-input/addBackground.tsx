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

import { Background, Character } from "@/types/vn-engine/main-types";
import React, { FormEvent, useEffect, useState } from "react";
import { BACKGROUNDS, CHARACTERS } from "@/constants";
import { useBuilderContext } from "@/providers/builder";
import Image from "next/image";
import {
  AddBackground,
  CommandsEnum,
  isAddBackgroundCommand,
  isCommand,
  isMoveCharacterCommand,
  MoveCharacter,
  TRANSITIONS,
  TransitionType,
} from "@/types/vn-engine/command-types";

const AddBackgroundInput = () => {
  const {
    visualNovel,
    setVisualNovel,
    selectedCommand,
    setSelectedCommand,
    selectedSlide,
  } = useBuilderContext();

  const [timer, setTimer] = useState<number>(1);
  const [transition, setTransition] = useState<TransitionType | undefined>();
  const [currBackground, setcurrBackground] = useState<
    Background | undefined
  >();

  useEffect(() => {
    if (
      selectedSlide &&
      isCommand(selectedSlide.dialogue) &&
      isAddBackgroundCommand(selectedSlide.dialogue) &&
      !currBackground
    ) {
      setcurrBackground(selectedSlide.dialogue.background);
      setTimer(selectedSlide.dialogue.timer || 1);
      setTransition(selectedSlide.dialogue.transition);
    }
  }, [selectedCommand, selectedSlide, currBackground]);

  // UTILITIES
  function resetForm() {
    setcurrBackground(undefined);
    setTimer(1);
    setTransition(undefined);
  }
  // FUNCTIONS
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!currBackground || !selectedCommand) return null;

    const selectedIdx = visualNovel.findIndex(
      (d) => d.id === selectedCommand.id
    );
    if (selectedIdx === -1) return;
    let newSlides = [...visualNovel];
    let newData: AddBackground = {
      ...newSlides[selectedIdx].dialogue,
      background: currBackground,
      timer,
      transition,
      type: CommandsEnum.AddBackground,
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
        <h3 className="font-medium text-lg">COMMAND: Add Background</h3>
        <div className="flex gap-2"></div>
      </div>

      {/* MAIN */}
      <ScrollArea className={"mt-14 h-full w-full flex flex-col gap-2 px-4"}>
        <div className="grid gap-0.5 mt-4 px-2">
          <Label className="uppercase font-medium">Background</Label>
          <Select
            value={currBackground?.name || ""}
            onValueChange={(e) => {
              const sel = BACKGROUNDS.find((d) => d.name === e);
              setcurrBackground(sel);
            }}
          >
            <SelectTrigger className="w-[320px]">
              <SelectValue placeholder="Select a background" />
            </SelectTrigger>
            <SelectContent id="background">
              <SelectGroup>
                <SelectLabel>Background</SelectLabel>
                {BACKGROUNDS.map((data, idx) => {
                  return (
                    <SelectItem key={idx} value={data.name}>
                      <div className="flex gap-1 justify-center items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={data.image.src}
                            alt="Pic"
                            className="object-cover object-top bg-main-100 border"
                          />
                          <AvatarFallback>BG</AvatarFallback>
                        </Avatar>
                        <h4 className="font-semibold">{data.name}</h4>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-0.5 mt-4 px-2">
          <Label className="uppercase font-medium">Transitions</Label>
          <Select
            value={transition}
            onValueChange={(e) => {
              setTransition(e as TransitionType);
            }}
          >
            <SelectTrigger className="w-[320px]">
              <SelectValue placeholder="Select a transition" />
            </SelectTrigger>
            <SelectContent id="transitions">
              <SelectGroup>
                <SelectLabel>Transitions</SelectLabel>
                {TRANSITIONS.map((data, idx) => {
                  return (
                    <SelectItem key={idx} value={data}>
                      <h4 className="">{data}</h4>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-0.5 mt-4 px-2">
          <Label className="uppercase font-medium">Timer (seconds)</Label>
          <Input
            value={timer}
            onChange={(e) => setTimer(e.target.valueAsNumber)}
            type="number"
            placeholder="Enter timer"
            className="w-[320px]"
          />
        </div>
      </ScrollArea>

      {/* PREVIEW */}
      {currBackground && (
        <div className="w-full h-80 px-10 mb-14 relative overflow-hidden">
          <div className="w-full h-full overflow-hidden relative border rounded-lg shadow-sm bg-slate-800 grid grid-cols-3 divide-x divide-dashed">
            <div className="absolute left-0 top-0 w-full h-full z-10">
              <Image src={currBackground.image?.src} alt="BG" fill />
            </div>
            <div className="w-full absolute bottom-0 z-[10] h-14 bg-black/50 p-4 flex flex-col justify-center items-start">
              <span className="text-[10px] text-white font-bold">
                Name goes here
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
          <Button type="submit" size={"sm"} disabled={!currBackground}>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddBackgroundInput;
