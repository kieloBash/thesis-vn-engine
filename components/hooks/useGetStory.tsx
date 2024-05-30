"use client";
import { useStoryContext } from "@/providers/story";
import { useMemo } from "react";
import {
  getDisplayArgs,
  isActionCommand,
  isAudioCommand,
  isBackgroundCommand,
} from "@/helpers";
import { ArgumentTaxEnum } from "@/types/new-types";

const useGetStory = () => {
  const { story, argumentLines } = useStoryContext();

  const data = useMemo(() => {
    const charactersSpawned: string[] = [];
    return story.map((dl, idx) => {
      if (dl.type === "FullDialogue" && dl.speaker) {
        let ARR_TO_DISPLAY: string[] = [];

        const speakerName = dl.speaker?.name.split(" ")[0];
        let spawnCommand = "";
        if (!charactersSpawned.includes(speakerName) && speakerName !== "ME") {
          charactersSpawned.push(speakerName);
          spawnCommand = `CreateCharacter(${speakerName} -e true), SetPosition(${speakerName} ${dl.speaker.xPos}:0.5)`;
          ARR_TO_DISPLAY.push(spawnCommand);
        }

        const speakerDialogue = dl.dialogue;

        let textToDisplay = `${speakerName} "${speakerDialogue}"`;
        ARR_TO_DISPLAY.push(textToDisplay);

        const args = getDisplayArgs({ args: argumentLines, key: dl.lineNum });

        const argsString = args
          .map((arg) => {
            const tax = arg.tax;
            if (tax === ArgumentTaxEnum.CLAIM) {
              return `AddClaimArgument("${arg.claimKey}" ${arg.type} "${arg.text}")`;
            } else {
              return `AddChainArgument("${arg.claimKey}" "${arg.connectorKey}" "${arg.text}" ${arg.tax})`;
            }
          })
          .join("\n");
        ARR_TO_DISPLAY.push(argsString);

        return ARR_TO_DISPLAY.join("\n");
      } else if (
        dl.type === "CommandOnly" &&
        dl.commands.length > 0 &&
        isBackgroundCommand(dl.commands[0])
      ) {
        const bgName = dl.commands[0].parameters[0];
        const textToDisplay = `setlayermedia(background 0 ${bgName
          .split(" ")
          .join("_")})`;
        return textToDisplay;
      } else if (
        dl.type === "CommandOnly" &&
        dl.commands.length > 0 &&
        isAudioCommand(dl.commands[0])
      ) {
        if (dl.commands[0].status === "ready") {
          const audioCom = dl.commands[0];

          if (audioCom.name === "playtrack" && audioCom.audio) {
            const textToDisplay = `${audioCom.name}("${
              audioCom.audio.trackname
            }" ${audioCom.audio.channel} ${audioCom.audio.volume} ${
              audioCom.audio.pitch
            } ${audioCom.audio.starting_vol} ${
              audioCom.audio.loop ? "true" : "false"
            })`;
            return textToDisplay;
          } else if (audioCom.name === "playsoundeffect" && audioCom.audio) {
            const textToDisplay = `${audioCom.name}("${audioCom.audio.trackname}" ${audioCom.audio.volume})`;
            return textToDisplay;
          }
        }
      } else if (
        dl.type === "CommandOnly" &&
        dl.commands.length > 0 &&
        isActionCommand(dl.commands[0])
      ) {
        const actCom = dl.commands[0];
        if (actCom.name === "MoveCharacter") {
          const textToDisplay = `${actCom.name}(${actCom.parameters[0]} ${actCom.parameters[1]}:${actCom.parameters[2]} ${actCom.parameters[3]} ${actCom.parameters[4]})`;
          return textToDisplay;
        }
      }
    });
  }, [story, argumentLines]);

  return data.join("\n");
};

export default useGetStory;
