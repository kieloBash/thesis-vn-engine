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

import { Character, Conversation } from "@/types/vn-engine/main-types";
import React, { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { CHARACTERS } from "@/constants";
import { Info } from "lucide-react";
import { TooltipButton } from "@/components/global/tooltip-btn";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { useBuilderContext } from "@/providers/builder";
import { generateRandomKey, isSpawnedCharacter } from "@/helpers";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

const ConversationInput = () => {
  const {
    spawnedCharacters,
    setSpawnedCharacters,
    visualNovel,
    setVisualNovel,
    activeBackground,
  } = useBuilderContext();

  const [speaker, setSpeaker] = useState<Character | undefined>(undefined);
  const [altName, setAltName] = useState<string>("");
  const [currDialogue, setcurrDialogue] = useState("");
  const [xPos, setxPos] = useState(0.5);
  const [isHidden, setisHidden] = useState(false);

  const justSpawned = useMemo(() => {
    return isSpawnedCharacter({ speaker, arr: spawnedCharacters });
  }, [speaker, spawnedCharacters]);
  const wtPreviewClassName = clsx(
    "",
    justSpawned
      ? "my-14 h-full w-full flex flex-col gap-2 px-4 pb-4"
      : "mt-14 h-full w-full flex flex-col gap-2 px-4"
  );
  const flagForPreview = speaker && speaker.name !== "ME" && !justSpawned;
  const flagForDisplay = speaker;

  // UTILITIES
  function resetForm() {
    setcurrDialogue("");
    setAltName("");
    setxPos(0.5);
  }
  // FUNCTIONS
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      if (speaker && currDialogue !== "") {
        event.preventDefault();
        handleSubmit(
          new Event("submit", {
            cancelable: true,
            bubbles: true,
          }) as unknown as FormEvent
        );
      }
    }
  }
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!speaker || currDialogue === "") return null;
    const newData: Conversation = {
      id: generateRandomKey(),
      speaker,
      line: currDialogue,
      justSpawned: !justSpawned,

      altName,
      startXPos: xPos,
      dialogueType: "conversation",
      isHidden,
    };
    let newSpawnedCharacter;
    if (!justSpawned) {
      newSpawnedCharacter = [...spawnedCharacters, { ...speaker, xPos }];
      setSpawnedCharacters(newSpawnedCharacter);
    } else {
      newSpawnedCharacter = [...spawnedCharacters];
    }

    const newSlide = {
      id: generateRandomKey(16),
      dialogue: newData,
      // activeBackground,
      spawnedCharacters: newSpawnedCharacter,
    };

    setVisualNovel([...visualNovel, newSlide]);
    resetForm();
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-screen flex flex-col gap-4 relative"
    >
      {/* HEADER */}
      <div className="absolute top-0 z-10 bg-white h-14 border-b w-full flex justify-between items-center p-4">
        <h3 className="font-medium text-lg">Add Conversation</h3>
        <div className="flex gap-2"></div>
      </div>

      {/* MAIN */}
      <ScrollArea className={wtPreviewClassName}>
        <div className="grid gap-0.5 mt-4 px-2">
          <Label className="uppercase font-medium">Character</Label>
          <Select
            value={speaker?.name || ""}
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
        {speaker && speaker.name !== "ME" && (
          <div className="items-top flex space-x-2 mt-4 px-2">
            <Checkbox
              id="visible"
              checked={!isHidden}
              onCheckedChange={(e) => {
                if (e) {
                  setisHidden(false);
                } else {
                  setisHidden(true);
                }
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="visible"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Visible
              </label>
            </div>
          </div>
        )}
        <div className="grid gap-0.5 mt-4 px-2">
          <div className="flex gap-2 justify-start items-center">
            <Label className="uppercase font-medium">Alternative Name</Label>
            <TooltipButton tip="This is for hiding the names of the character when displayed on the novel">
              <div className="w-3 h-3 p-0 rounded-full">
                <Info className="w-full h-full text-gray-600" />
              </div>
            </TooltipButton>
          </div>
          <Input
            placeholder="Enter alternative name..."
            value={altName}
            onChange={(e) => setAltName(e.target.value)}
          />
        </div>
        <div className="grid gap-0.5 mt-4 px-2">
          <Label htmlFor="dialogue" className="uppercase font-medium">
            Dialogue
          </Label>
          <Textarea
            value={currDialogue}
            onChange={(e) => setcurrDialogue(e.target.value)}
            placeholder="Type your dialogue here"
            id="dialogue"
            className="resize-none"
            rows={3}
            onKeyDown={handleKeyDown}
            maxLength={100}
          />
        </div>
        {flagForPreview ? (
          <>
            <div className="grid gap-0.5 mt-4 px-2">
              <Label htmlFor="dialogue">SetXPosition()</Label>
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
          </>
        ) : null}
      </ScrollArea>

      {/* PREVIEW */}
      {flagForPreview && (
        <div className="w-full h-80 px-10 mb-14 relative overflow-hidden">
          <div className="w-full h-full overflow-hidden relative border rounded-lg shadow-sm bg-slate-800 grid grid-cols-3 divide-x divide-dashed">
            <div className="flex justify-center items-end">
              {speaker &&
                speaker.name !== "ME" &&
                xPos === 0 &&
                !isHidden &&
                !justSpawned && (
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
                !isHidden &&
                !justSpawned && (
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
                !isHidden &&
                !justSpawned && (
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
                {altName !== "" ? altName : speaker.name.split(" ")[0]}
              </span>
              <p className="flex-1 flex-shrink-0 text-[10px] text-white text-wrap">
                {currDialogue !== "" ? currDialogue : "Dialogue goes here..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="absolute bottom-0 z-10 bg-white h-14 border-t w-full flex justify-between items-center p-4">
        <h3 className="font-bold text-xs"></h3>
        <div className="flex gap-2">
          <Button
            type="submit"
            size={"sm"}
            disabled={!speaker || currDialogue === ""}
          >
            Add Dialogue
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ConversationInput;
