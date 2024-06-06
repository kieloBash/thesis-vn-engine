"use client";
import { useMemo } from "react";

import { Slides, SpawnedCharacterType } from "@/providers/builder";
import { Background, isConversation } from "@/types/vn-engine/main-types";
import {
  isAddBackgroundCommand,
  isCommand,
  isCreateCharacterCommand,
  isMoveCharacterCommand,
  isRemoveBackgroundCommand,
} from "@/types/vn-engine/command-types";

const usePreview = ({ slides }: { slides: Slides[] }) => {
  const previewSlides = useMemo(() => {
    let newSlides: Slides[] = [];
    let activeBG: Background | undefined = undefined;
    let spawnedCharacters: SpawnedCharacterType[] = [];
    slides.forEach((slide) => {
      let newSlide: Slides;
      if (isConversation(slide.dialogue)) {
        const lineSpeaker = slide.dialogue.speaker;
        const xPosSpeaker = slide.dialogue.startXPos;

        // SPAWN SPEAKER IF NOT YET SPAWNED
        if (!spawnedCharacters.some((d) => d.name === lineSpeaker.name)) {
          spawnedCharacters = [
            ...spawnedCharacters,
            { ...lineSpeaker, xPos: xPosSpeaker, isHidden: false },
          ];
        }

        newSlide = {
          ...slide,
          activeBackground: activeBG,
          spawnedCharacters: [...spawnedCharacters],
        };

        newSlides.push(newSlide);
      } else if (isCommand(slide.dialogue)) {
        if (isAddBackgroundCommand(slide.dialogue)) {
          activeBG = slide.dialogue.background;
        } else if (isRemoveBackgroundCommand(slide.dialogue)) {
          activeBG = undefined;
        } else if (isMoveCharacterCommand(slide.dialogue)) {
          const toMoveChar = slide.dialogue.speaker;
          const newPos = slide.dialogue.xPos;
          if (
            slide.dialogue.speaker &&
            spawnedCharacters.some((d) => d.name === toMoveChar?.name)
          ) {
            // Update the xPos of the speaker if already spawned in the spawnedCharacters
            spawnedCharacters = spawnedCharacters.map((char) =>
              char.name === toMoveChar?.name ? { ...char, xPos: newPos } : char
            );
          } else {
            console.log(`ERROR MOVING: ${toMoveChar?.name}`);
          }
        } else if (isCreateCharacterCommand(slide.dialogue)) {
          const command = slide.dialogue;
          const speaker = slide.dialogue.speaker;
          if (speaker) {
            if (!spawnedCharacters.some((d) => d.name === speaker.name)) {
              spawnedCharacters = [
                ...spawnedCharacters,
                {
                  ...speaker,
                  xPos: command.startXpos,
                  isHidden: !command.enabledOnSpawn,
                },
              ];
            } else {
            }
          }
        }
      }
    });

    return newSlides;
  }, [slides]);

  return previewSlides;
};

export default usePreview;
