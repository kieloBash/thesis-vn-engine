"use client";
import { useStoryContext } from "@/providers/story";
import { Dialogue } from "@/types";
import React from "react";
import { Badge } from "../ui/badge";
import clsx from "clsx";

const StoryLineCard = ({ line, idx }: { line: Dialogue; idx: number }) => {
  const { setToggleModify, setSelectedLine, setSelectedIndex, selectedIndex } =
    useStoryContext();
  const activeClassName = clsx(
    "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all ",
    selectedIndex === idx
      ? "bg-main-300 text-white"
      : "bg-white hover:bg-accent"
  );
  return (
    <button
      className={activeClassName}
      onClick={() => {
        if (selectedIndex === idx) {
          setToggleModify(false);
          setSelectedLine(undefined);
          setSelectedIndex(-1);
        } else {
          setToggleModify(true);
          setSelectedLine(line);
          setSelectedIndex(idx);
        }
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
        {line.arguments.length ? (
          <div className="flex items-center gap-2">
            {line.arguments.map((arg, idx) => (
              <Badge key={idx} variant={"default"}>
                {arg.tax}/{arg.type}: {arg.line.substring(0, 24)}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </button>
  );
};

export default StoryLineCard;
