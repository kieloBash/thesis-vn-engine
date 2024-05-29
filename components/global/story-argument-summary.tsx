"use client";
import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { useStoryContext } from "@/providers/story";
import { Button } from "@/components/ui/button";
import { ArgumentSummaryModal } from "./argument-summary/argument-summary-modal";
import { hasIncompleteChain } from "@/helpers";
import { ArgumentTypeEnum } from "@/types/new-types";
import { ExportModal } from "./modals/export-file";

const StoryArgumentSummary = () => {
  const { argumentLines } = useStoryContext();

  const { completed_args, for_arg, against_arg, irrelevant_arg } =
    useMemo(() => {
      let completed_args = 0;
      let for_arg = 0;
      let against_arg = 0;
      let irrelevant_arg = 0;

      argumentLines.forEach((arg) => {
        if (!hasIncompleteChain(arg)) {
          completed_args++;
        }

        switch (arg.type) {
          case ArgumentTypeEnum.FOR:
            for_arg++;
            break;
          case ArgumentTypeEnum.AGAINST:
            against_arg++;
            break;
          case ArgumentTypeEnum.IRRELEVANT:
            irrelevant_arg++;
            break;
          default:
            break;
        }
      });

      return { completed_args, for_arg, against_arg, irrelevant_arg };
    }, [argumentLines]);

  return (
    <div className="bg-background/95 p-4 backdrop-blur flex justify-between items-center text-sm">
      <div className="flex gap-1 items-start justify-center flex-col">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center justify-start">
            <Label className="">COMPLETE ARGUMENTS:</Label>
            <span className="">{completed_args}</span>
          </div>
          <div className="flex gap-2">
            <p className="">
              For: <span className="font-bold">{for_arg}</span>
            </p>
            <p className="">
              Against: <span className="font-bold">{against_arg}</span>
            </p>
            <p className="">
              Irrelevant: <span className="font-bold">{irrelevant_arg}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-center items-center">
        <ArgumentSummaryModal />
        <ExportModal />
      </div>
    </div>
  );
};

export default StoryArgumentSummary;
