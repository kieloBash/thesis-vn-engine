"use client";
import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { useStoryContext } from "@/providers/story";
import { Button } from "@/components/ui/button";

const StoryArgumentSummary = () => {
  const { story } = useStoryContext();
  const claimArguments = useMemo(() => {
    return story.flatMap((dialogue) =>
      dialogue.arguments.filter((argument) => argument.tax === "Claim")
    );
  }, [story]);
  const warrantArguments = useMemo(() => {
    return story.flatMap((dialogue) =>
      dialogue.arguments.filter((argument) => argument.tax === "Warrant")
    );
  }, [story]);
  const groundArguments = useMemo(() => {
    return story.flatMap((dialogue) =>
      dialogue.arguments.filter((argument) => argument.tax === "Ground")
    );
  }, [story]);
  console.log(claimArguments)
  console.log(warrantArguments)
  console.log(groundArguments)

  return (
    <div className="bg-background/95 p-4 backdrop-blur flex justify-between items-center text-sm">
      <div className="flex gap-1 items-start justify-center flex-col">
        <div className="flex flex-col gap-1">
          <Label className="">ARGUMENTS</Label>
          <div className="flex gap-2">
            <p className="">
              Claim: <span className="font-bold">{claimArguments?.length}</span>
            </p>
            <p className="">
              Warrant:{" "}
              <span className="font-bold">{warrantArguments?.length}</span>
            </p>
            <p className="">
              Ground:{" "}
              <span className="font-bold">{groundArguments?.length}</span>
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
  );
};

export default StoryArgumentSummary;
