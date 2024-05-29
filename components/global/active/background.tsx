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
import { BACKGROUNDS } from "@/constants";
import { Background, BackgroundCommand, CommandType, Dialogue } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipButton } from "../tooltip-btn";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useStoryContext } from "@/providers/story";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const BackgroundCommandTemplate = ({
  command,
}: {
  command: BackgroundCommand;
}) => {
  const { story, selectedIndex, setStory, resetModify, selectedLine } =
    useStoryContext();
  const [currBackground, setcurrBackground] = useState<Background | undefined>(
    command.bg
  );
  useEffect(() => {
    if (command) {
      setcurrBackground(command.bg);
    }
  }, [command]);
  function resetForm() {
    setcurrBackground(undefined);
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
    if (!selectedLine || !currBackground) return null;

    let newDialogue: Dialogue = selectedLine;
    let newBackgroundCommand: BackgroundCommand = {
      name: "AddBackground",
      type: CommandType.Background,
      parameters: [currBackground.name],
      bg: currBackground,
    };
    newDialogue.commands[0] = newBackgroundCommand;

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
                <SelectLabel>Speaker</SelectLabel>
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
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h4 className="font-semibold">{data.name}</h4>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
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
        <div className="flex-1">
          <div className="w-full aspect-square relative">
            <Image
              src={currBackground?.image.src || ""}
              alt="bg"
              fill
              className="object-fit"
            />
          </div>
          {/* DISPLAY */}
          <>
            <div className="p-2 flex w-full flex-1">
              <div className="flex-1 border rounded-md p-2">
                {selectedLine && currBackground ? (
                  <p className="text-sm font-mono">
                    <span className="">AddBackground</span>
                    <span className="">
                      (&ldquo;{currBackground.name.split(" ")}&ldquo;)
                    </span>
                  </p>
                ) : null}
              </div>
            </div>
          </>
        </div>
        <Separator className="mt-4" />
        <div className="w-full justify-end gap-1 items-center flex px-4 py-2">
          <Button size={"sm"} type="submit" disabled={!currBackground}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BackgroundCommandTemplate;
