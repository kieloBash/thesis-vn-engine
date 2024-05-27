"use client";
import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useStoryContext } from "@/providers/story";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import StoryLineCard from "./story-line";

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
        <div className="bg-background/95 p-4 backdrop-blur flex justify-between items-center text-sm">
          <div className="flex gap-1 items-start justify-center flex-col">
            <div className="flex flex-col gap-1">
              <Label className="">ARGUMENTS</Label>
              <div className="flex gap-2">
                <p className="">
                  Claim:{" "}
                  <span className="font-bold">
                    {argumentLines.filter((d) => d.tax === "Claim")?.length}
                  </span>
                </p>
                <p className="">
                  Warrant:{" "}
                  <span className="font-bold">
                    {argumentLines.filter((d) => d.tax === "Warrant")?.length}
                  </span>
                </p>
                <p className="">
                  Ground:{" "}
                  <span className="font-bold">
                    {argumentLines.filter((d) => d.tax === "Ground")?.length}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <Button type="button" size={"sm"}>
              View
            </Button>
            <Button type="button" size={"sm"}>
              Create Story
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryList;
