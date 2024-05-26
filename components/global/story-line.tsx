"use client";
import { useStoryContext } from "@/providers/story";
import { Argument, StoryLine } from "@/types";
import React from "react";
import { Badge } from "../ui/badge";

const StoryLineCard = ({
  line,
  idx,
  selArgument,
}: {
  line: StoryLine;
  idx: number;
  selArgument: Argument[];
}) => {
  const { setToggleModify, setSelectedLine, setSelectedIndex } =
    useStoryContext();
  return (
    <button
      className={
        "flex flex-col items-start gap-2 rounded-lg border p-3 bg-white text-left text-sm transition-all hover:bg-accent"
      }
      onClick={() => {
        setToggleModify(true);
        setSelectedLine(line);
        setSelectedIndex(idx);
      }}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{line.speaker.name}</div>
          </div>
        </div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        {line.dialogue.substring(0, 300)}
      </div>
      <div className="flex gap-2">
        {selArgument.length ? (
          <div className="flex items-center gap-2">
            {selArgument.map((arg, idx) => (
              <Badge key={idx} variant={"default"}>
                {arg.tax}/{arg.type}: {" "} {arg.line.substring(0, 24)}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </button>
  );
};

export default StoryLineCard;
