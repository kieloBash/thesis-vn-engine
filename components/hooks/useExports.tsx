import { SpawnedCharacterType, useBuilderContext } from "@/providers/builder";
import { Background, isConversation } from "@/types/vn-engine/main-types";
import React, { useMemo } from "react";
import useVisualNovel from "./useVisualNovel";
import {
  isAddBackgroundCommand,
  isCommand,
  isMoveCharacterCommand,
  isRemoveBackgroundCommand,
} from "@/types/vn-engine/command-types";

const useExports = () => {
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

          // Check if the character needs to be spawned
          if (
            !charactersSpawned.includes(speakerName) &&
            speakerName !== "ME"
          ) {
            let startXPos = conversation.startXPos;
            let isHidden = conversation.isHidden;

            charactersSpawned.push(speakerName);
            if (
              !spawnedCharacters.some(
                (d) => d.name === conversation.speaker.name
              )
            ) {
              spawnedCharacters = [
                ...spawnedCharacters,
                { ...conversation.speaker, xPos: conversation.startXPos },
              ];
            }

            spawnCommand = `CreateCharacter(${speakerName} -e ${
              isHidden ? "false" : "true"
            }), SetPosition(${speakerName} ${startXPos}:0.5) //createChar`;
            ARR_TO_DISPLAY.push(spawnCommand);
          }

          // Adding dialogue
          const speakerDialogue = conversation.line;
          let textToDisplay = "";
          if (conversation.altName !== "")
            textToDisplay = `${speakerName} as ${conversation.altName} "${speakerDialogue}" //conversation`;
          else
            textToDisplay = `${speakerName} "${speakerDialogue}" //conversation`;

          ARR_TO_DISPLAY.push(textToDisplay);

          return ARR_TO_DISPLAY.join("\n");
        } else if (isCommand(slide.dialogue)) {
          const command = slide.dialogue;
          if (isAddBackgroundCommand(command)) {
            if (activeBG) {
              activeBG = command.background;
              let textToDisplay = `setlayermedia(background ${
                command.timer
              } ${activeBG?.name.split(" ").join("_")}) //command(addbg)`;
              return `//Command to Remove previous background\n${textToDisplay}`;
            } else {
              activeBG = command.background;
              let textToDisplay = `setlayermedia(background ${
                command.timer
              } ${activeBG?.name.split(" ").join("_")}) //command(addbg)`;
              return textToDisplay;
            }
          } else if (isRemoveBackgroundCommand(command)) {
            activeBG = undefined;
            return "//Command to Remove previous background";
          } else if (isMoveCharacterCommand(command)) {
            const toMoveChar = command.speaker;
            const newPos = command.xPos;
            if (
              toMoveChar &&
              spawnedCharacters.some((d) => d.name === toMoveChar?.name)
            ) {
              spawnedCharacters = spawnedCharacters.map((char) =>
                char.name === toMoveChar?.name
                  ? { ...char, xPos: newPos }
                  : char
              );
              return `MoveCharacter(${
                toMoveChar.name.split(" ")[0]
              } ${newPos}:0.5 1 true) //command(moveChar)`;
            } else {
              return `//ERROR MOVING: ${toMoveChar?.name}`;
            }
          }
        }
        return null;
      })
      .filter(Boolean) // Remove null values
      .join("\n");
  }, [previewVisualNovel]);

  return SAVE_STORY;
};

export default useExports;
