"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useMemo, useState } from "react";
import { PreviewModal } from "./preview";
import { Slides, useBuilderContext } from "@/providers/builder";
import { ExportModal } from "./components/export-file";
import { useLocalStorage } from "@/components/hooks/useLocalStorage";
import { Conversation } from "@/types/vn-engine/main-types";
import { generateRandomKey } from "@/helpers";
import { extractConversation } from "@/helpers/parse";
import { CHARACTERS } from "@/constants";
import useExports from "@/components/hooks/useExports";

const ToolsSummary = () => {
  const {
    toggleEdits,
    setToggleEdits,
    setSelectedCommand,
    setVisualNovel,
    visualNovel,
  } = useBuilderContext();

  const [initial, setinitial] = useState<Slides[]>([]);

  const { setItem, getItem } = useLocalStorage("value");
  const lines = getItem();
  const temp = useMemo(() => {
    let toParseLines;
    if (lines) {
      toParseLines = lines.split("\n");
    }
    let newSlides: Slides[] = [];

    toParseLines?.map((line: string) => {
      console.log(line);
      if (line.includes("//conversation")) {
        const {
          speaker: speakerName,
          dialogue,
          altName,
        } = extractConversation(line);
        const speaker = CHARACTERS.find((d) => d.name.includes(speakerName));
        if (speaker) {
          const newData: Conversation = {
            id: generateRandomKey(),
            speaker,
            line: dialogue,
            justSpawned: false,

            altName,
            startXPos: 0,
            dialogueType: "conversation",
          };
          const newSlide = {
            id: generateRandomKey(16),
            dialogue: newData,
            // activeBackground,
            spawnedCharacters: [],
          };
          newSlides.push(newSlide);
        }
      }
    });
    return newSlides;
  }, [lines]);
  console.log(temp);

  const SAVE = useExports();
  console.log(SAVE);

  useEffect(() => {
    if (temp.length) setVisualNovel(temp);
  }, [temp, setVisualNovel]);

  console.log(temp);

  return (
    <div className="h-20 bg-white flex justify-between items-center px-4">
      {toggleEdits ? (
        <>
          <div className="font-mono">Editting...</div>
          <div className="flex gap-1 items-center justify-center">
            <Button
              size={"sm"}
              variant={"destructive"}
              onClick={() => {
                setToggleEdits(false);
                setSelectedCommand(undefined);
              }}
            >
              Done Edit
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className=""></div>
          <div className="flex gap-1 items-center justify-center">
            <Button
              size={"sm"}
              onClick={() => {
                setToggleEdits(true);
              }}
            >
              Edit
            </Button>
            {/* <PreviewModal /> */}
            <Button
              size={"sm"}
              onClick={() => {
                if (SAVE) {
                  setItem(SAVE);
                }
              }}
            >
              Save
            </Button>
            <ExportModal />
          </div>
        </>
      )}
    </div>
  );
};

export default ToolsSummary;
