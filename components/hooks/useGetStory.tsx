"use client";
import { useStoryContext } from "@/providers/story";
import { useMemo } from "react";
import { getDisplayArgs, isBackgroundCommand } from "@/helpers";
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
        if (!charactersSpawned.includes(speakerName)) {
          charactersSpawned.push(speakerName);
          spawnCommand = `CreateCharacter(${speakerName} -e true), SetPosition(${speakerName} 1:0.5)`;
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
      }
    });
  }, [story, argumentLines]);

  return data.join("\n");
};

export default useGetStory;
