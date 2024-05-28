"use client";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Argument } from "@/types";
import React, { useMemo } from "react";

const ArgumentSummaryCard = ({
  id,
  args,
}: {
  id: string;
  args: Argument[];
}) => {
  const claimArg = args.find((d) => d.tax === "Claim");

  const groupedArguments = useMemo(() => {
    const argumentMap: { [argumentKey: string]: Argument[] } = {};

    args.forEach((argument) => {
      if (argument.argumentKey) {
        if (!argumentMap[argument.argumentKey]) {
          argumentMap[argument.argumentKey] = [];
        }
        argumentMap[argument.argumentKey].push(argument);
      }
    });

    return argumentMap;
  }, [args]);

  return (
    <div className="w-60 h-80 bg-white border rounded-lg shadow-sm flex flex-col p-2">
      <div className="flex flex-col justify-center items-center">
        <h2 className="font-bold">{id}</h2>
        <Label className="text-xs">KEY</Label>
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col justify-center items-center flex-1">
        <Label className="text-xs">CLAIM</Label>
        <p className="text-xs font-mono px-2 py-1 bg-slate-200 rounded-full text-wrap">
          {claimArg?.line}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center flex-[2]">
        <Label className="text-xs">CHAINS</Label>
        <div className="flex-1">
          {Object.entries(groupedArguments).map((data) => {
            const key = data[0];
            const args = data[1];
            return (
              <div className="grid grid-cols-2 w-full" key={key}>
                {args.map((d, idx) => {
                  return (
                    <p
                      key={`${d.argumentKey}-${idx}`}
                      className="text-xs font-mono px-2 py-1 text-center bg-slate-200 rounded-full text-wrap"
                    >
                      {d.line}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ArgumentSummaryCard;
