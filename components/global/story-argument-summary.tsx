"use client";
import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { useStoryContext } from "@/providers/story";
import { Button } from "@/components/ui/button";
import { ArgumentSummaryModal } from "./argument-summary/argument-summary-modal";
import { Argument } from "@/types";

const StoryArgumentSummary = () => {
  const { story } = useStoryContext();
  const { claimArguments, warrantArguments, groundArguments } = useMemo(() => {
    const claims: Argument[] = [];
    const warrants: Argument[] = [];
    const grounds: Argument[] = [];

    story.forEach((dialogue) => {
      dialogue.arguments.forEach((argument) => {
        switch (argument.tax) {
          case "Claim":
            claims.push(argument);
            break;
          case "Warrant":
            warrants.push(argument);
            break;
          case "Ground":
            grounds.push(argument);
            break;
          default:
            break;
        }
      });
    });

    return {
      claimArguments: claims,
      warrantArguments: warrants,
      groundArguments: grounds,
    };
  }, [story]);

  return (
    <div className="bg-background/95 p-4 backdrop-blur flex justify-between items-center text-sm">
      <div className="flex gap-1 items-start justify-center flex-col">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center justify-start">
            <Label className="">COMPLETE ARGUMENTS</Label>
            <span className="">0/10</span>
          </div>
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
        <ArgumentSummaryModal />
        <Button type="button" size={"sm"}>
          Create Story
        </Button>
      </div>
    </div>
  );
};

export default StoryArgumentSummary;
