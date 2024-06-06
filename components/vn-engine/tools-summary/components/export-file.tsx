"use client";
import useGetStory from "@/components/hooks/useGetStory";
import usePreview from "@/components/hooks/usePreview";
import useVisualNovel from "@/components/hooks/useVisualNovel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hasIncompleteChain } from "@/helpers";
import { SpawnedCharacterType, useBuilderContext } from "@/providers/builder";
import { useStoryContext } from "@/providers/story";
import { ArgumentTypeEnum } from "@/types/new-types";
import {
  isAddBackgroundCommand,
  isCommand,
  isCreateCharacterCommand,
  isMoveCharacterCommand,
  isRemoveBackgroundCommand,
} from "@/types/vn-engine/command-types";
import { Background, isConversation } from "@/types/vn-engine/main-types";
import { useMemo, useState } from "react";

export function ExportModal() {
  const [fileName, setfileName] = useState("");
  const [open, setopen] = useState(false);

  const exportToTxtFile = (text: string, filename: string) => {
    // Step 1: Create a Blob from the string
    const blob = new Blob([text], { type: "text/plain" });

    // Step 2: Generate a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Step 3: Create a download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.txt`;

    // Step 4: Programmatically click the download link to start the download
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const { visualNovel } = useBuilderContext();
  const previewVisualNovel = useVisualNovel({ slides: visualNovel });
  const SAVE_STORY = useMemo(() => {
    const charactersSpawned: string[] = [];
    let activeBG: Background | undefined = undefined;
    let spawnedCharacters: SpawnedCharacterType[] = [];
    return previewVisualNovel
      .map((slide) => {
        if (isConversation(slide.dialogue)) {
          const conversation = slide.dialogue;

          let ARR_TO_DISPLAY: string[] = [];
          const speakerName = conversation.speaker.name.split(" ")[0];
          let spawnCommand = "";

          // CHECKING IF WE NEED TO SPAWN THE NEW CHARACTER
          if (
            !charactersSpawned.includes(speakerName) &&
            speakerName !== "ME"
          ) {
            let startXPos = conversation.startXPos;
            let isHidden = conversation.isHidden || false;

            charactersSpawned.push(speakerName);
            if (
              !spawnedCharacters.some(
                (d) => d.name === conversation.speaker.name
              )
            ) {
              spawnedCharacters = [
                ...spawnedCharacters,
                {
                  ...conversation.speaker,
                  xPos: conversation.startXPos,
                  isHidden,
                },
              ];
            }

            spawnCommand = `CreateCharacter(${speakerName} -e ${
              isHidden ? "false" : "true"
            } -i false) , SetPosition(${speakerName} ${startXPos}:0.5)`;
            ARR_TO_DISPLAY.push(spawnCommand);
          }

          // ADDING DIALOGUE
          const speakerDialogue = conversation.line;
          let textToDisplay = "";
          if (conversation.altName !== "")
            textToDisplay = `${speakerName} as ${conversation.altName} "${speakerDialogue}"`;
          else textToDisplay = `${speakerName} "${speakerDialogue}"`;

          ARR_TO_DISPLAY.push(textToDisplay);

          return ARR_TO_DISPLAY.join("\n");
        } else {
          if (isCommand(slide.dialogue)) {
            const command = slide.dialogue;
            if (isAddBackgroundCommand(command)) {
              if (activeBG) {
                // SHOULD REMOVE AND THEN ADD ANOTHER LAYER
                activeBG = command.background;
                let textToDisplay = `setlayermedia(background ${
                  command.timer
                } ${activeBG?.name.split(" ").join("_")})`;
                return [
                  "//Command to Remove previous background",
                  textToDisplay,
                ].join("\n");
              } else {
                activeBG = command.background;
                let textToDisplay = `setlayermedia(background ${
                  command.timer
                } ${activeBG?.name.split(" ").join("_")})`;
                return textToDisplay;
              }
            } else if (isRemoveBackgroundCommand(command)) {
              activeBG = undefined;
              // SHOULD REMOVE THE BACKGROUND
              return "//Command to Remove previous background";
            } else if (isMoveCharacterCommand(command)) {
              const toMoveChar = command.speaker;
              const newPos = command.xPos;
              if (
                toMoveChar &&
                spawnedCharacters.some((d) => d.name === toMoveChar?.name)
              ) {
                // Update the xPos of the speaker if already spawned in the spawnedCharacters
                spawnedCharacters = spawnedCharacters.map((char) =>
                  char.name === toMoveChar?.name
                    ? { ...char, xPos: newPos }
                    : char
                );
                return `MoveCharacter(${
                  toMoveChar.name.split(" ")[0]
                } ${newPos}:0.5 1 true)`;
              } else {
                return `//ERROR MOVING: ${toMoveChar?.name}`;
              }
            } else if (isCreateCharacterCommand(command)) {
              const toMoveChar = command.speaker;
              const startXPos = command.startXpos;
              const enabledOnSpawn = command.enabledOnSpawn;
              const immediate = command.immediate;

              if (
                toMoveChar &&
                !spawnedCharacters.some((d) => d.name === toMoveChar?.name)
              ) {
                // Update the xPos of the speaker if already spawned in the spawnedCharacters
                spawnedCharacters = [
                  ...spawnedCharacters,
                  {
                    ...toMoveChar,
                    xPos: startXPos,
                    isHidden: !enabledOnSpawn,
                  },
                ];
                return `CreateCharacter(${toMoveChar.name.split(" ")[0]} -e ${
                  enabledOnSpawn ? "true" : "false"
                } -i ${immediate ? "true" : "false"}), SetPosition(${
                  toMoveChar.name.split(" ")[0]
                } ${startXPos}:0.5)`;
              } else {
                return `//ERROR Creating Character: ${toMoveChar?.name}`;
              }
            }
          }
        }
      })
      .join("\n");
  }, [previewVisualNovel]);

  const handleSaveChapter = () => {
    exportToTxtFile(SAVE_STORY, fileName.split(" ").join("_"));
  };

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogTrigger asChild>
        <Button type="button" size={"sm"}>
          Download
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finish chapter!</DialogTitle>
          <DialogDescription>
            Make sure that you have at least 5 arguments
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              Name of the Chapter
            </Label>
            <Input
              id="filename"
              placeholder=""
              value={fileName}
              onChange={(e) => setfileName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <div className="flex gap-2 items-center justify-center">
              <Label className="">COMPLETE ARGUMENTS:</Label>
              <span className="">{0}</span>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <p className="">
                For: <span className="font-bold">{0}</span>
              </p>
              <p className="">
                Against: <span className="font-bold">{0}</span>
              </p>
              <p className="">
                Irrelevant: <span className="font-bold">{0}</span>
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            disabled={fileName === ""}
            onClick={() => {
              if (fileName !== "") {
                handleSaveChapter();
                setopen(false);
              }
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
