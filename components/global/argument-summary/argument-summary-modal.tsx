"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useStoryContext } from "@/providers/story";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMemo } from "react";
import { Argument } from "@/types";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ArgumentSummaryCard from "./card";

export function ArgumentSummaryModal() {
  const { story } = useStoryContext();

  const groupedArguments = useMemo(() => {
    const argumentMap: { [id: string]: Argument[] } = {};

    story.forEach((dialogue) => {
      dialogue.arguments.forEach((argument) => {
        if (!argumentMap[argument.id]) {
          argumentMap[argument.id] = [];
        }
        argumentMap[argument.id].push(argument);
      });
    });

    return argumentMap;
  }, [story]);

  console.log(groupedArguments);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size={"sm"}>
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>Arguments</DialogTitle>
          <DialogDescription>
            Must have at least 10 Complete Arguments. A complete argument
            consists of a claim and multiple chain of grounds and warrants.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {Object.entries(groupedArguments).map((data) => {
              const key = data[0];
              const args = data[1];
              const claimArg = args.find((d) => d.tax === "Claim");
              return <ArgumentSummaryCard key={key} args={args} id={key}/>;
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
