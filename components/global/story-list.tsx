"use client";
import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useStoryContext } from "@/providers/story";
import StoryLineCard from "./story-line";
import StoryArgumentSummary from "./story-argument-summary";

const StoryList = () => {
  const { story, argumentLines } = useStoryContext();
  return (
    <>
      <div className="col-span-4 flex flex-col h-screen py-6">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2 pt-0">
            {story.map((line, idx) => {
              return <StoryLineCard key={idx} line={line} idx={idx} />;
            })}
          </div>
        </ScrollArea>
        <StoryArgumentSummary />
      </div>
    </>
  );
};

export default StoryList;
