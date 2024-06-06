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
  isFlipCharacterCommand,
  isHideCharacterCommand,
  isShowCharacterCommand,
} from "@/types/vn-engine/command-types";
import { Plus, Trash } from "lucide-react";

const ShowCharacterInput = () => {
  const {
    visualNovel,
    setVisualNovel,
    selectedCommand,
    setSelectedCommand,
    selectedSlide,
  } = useBuilderContext();

  const [currSpeaker, setCurrSpeaker] = useState<Character | undefined>(
    undefined
  );
  const [immediate, setImmediate] = useState<boolean>(false);
  const [speakers, setSpeakers] = useState<Character[]>([]);
  useEffect(() => {
    if (
      selectedSlide &&
      isCommand(selectedSlide.dialogue) &&
      isShowCharacterCommand(selectedSlide.dialogue)
    ) {
      setSpeakers(selectedSlide.dialogue.speakers);
      setImmediate(selectedSlide.dialogue.isInstant);
    }
  }, [selectedCommand, selectedSlide]);

  // UTILITIES
  function resetForm() {
    setSpeakers([]);
  }
  // FUNCTIONS
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (speakers.length <= 0 || !selectedCommand) return null;

    const selectedIdx = visualNovel.findIndex(
      (d) => d.id === selectedCommand.id
    );
    if (selectedIdx === -1) return;
    let newSlides = [...visualNovel];
    if (
      newSlides[selectedIdx].dialogue &&
      isCommand(newSlides[selectedIdx].dialogue) &&
      isShowCharacterCommand(newSlides[selectedIdx].dialogue)
    ) {
      let newData = {
        ...newSlides[selectedIdx].dialogue,
        speakers,
        isInstant: immediate,
      };
      newSlides[selectedIdx] = { ...newSlides[selectedIdx], dialogue: newData };
      setVisualNovel(newSlides);
      setSelectedCommand(undefined);
      resetForm();
    }
  }

  // const flippedClassName = clsx("opacity-80", flipped ? "scale-x-[-1]" : "");
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-screen flex flex-col gap-4 relative"
    >
      {/* HEADER */}
      <div className="absolute top-0 z-10 bg-white h-14 border-b w-full flex justify-between items-center p-4">
        <h3 className="font-medium text-lg">COMMAND: Show Characters</h3>
        <div className="flex gap-2"></div>
      </div>

      {/* MAIN */}
      <ScrollArea className={"mt-14 h-full w-full flex flex-col gap-2 px-4"}>
        <div className="grid gap-0.5 mt-4 px-2">
          <Label className="uppercase font-medium">Character</Label>
          <div className="flex gap-2 justify-start items-center">
            <Select
              value={currSpeaker?.name!!}
              onValueChange={(e) => {
                const selSpeaker = CHARACTERS.find((d) => d.name === e);
                setCurrSpeaker(selSpeaker);
              }}
            >
              <SelectTrigger className="w-[320px]">
                <SelectValue placeholder="Select a speaker" />
              </SelectTrigger>
              <SelectContent id="currSpeaker">
                <SelectGroup>
                  <SelectLabel>Speaker</SelectLabel>
                  {CHARACTERS.filter(
                    (character) =>
                      !speakers.includes(character) && character.name !== "ME"
                  ).map((data, idx) => {
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
            <Button
              onClick={() => {
                if (currSpeaker) {
                  const newSpeakers = [...speakers];
                  newSpeakers.push(currSpeaker);
                  setSpeakers(newSpeakers);
                  setCurrSpeaker(undefined);
                }
              }}
              size={"icon"}
              type="button"
            >
              <Plus />
            </Button>
          </div>
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

        <div className="grid gap-0.5 mt-4 px-2">
          <Label htmlFor="" className="uppercase font-medium">
            Speakers to Show
          </Label>
          <ul className="">
            {speakers.map((char, idx) => {
              return (
                <li
                  className="flex w-full justify-between items-center py-1 transition-colors hover:bg-slate-100 pl-4 rounded-sm"
                  key={idx}
                >
                  <span className="">{char.name}</span>
                  <Button
                    className="w-6 h-6 p-1"
                    type="button"
                    onClick={() => {
                      let newSpeakers = [...speakers];
                      newSpeakers = newSpeakers.filter(
                        (s) => s.name !== char.name
                      );
                      setSpeakers(newSpeakers);
                    }}
                  >
                    <Trash className="w-full h-full" />
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </ScrollArea>

      {/* FOOTER */}
      <div className="absolute bottom-0 z-10 bg-white h-14 border-t w-full flex justify-between items-center p-4">
        <h3 className="font-bold text-xs"></h3>
        <div className="flex gap-2">
          <Button type="submit" size={"sm"} disabled={speakers.length <= 0}>
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ShowCharacterInput;
