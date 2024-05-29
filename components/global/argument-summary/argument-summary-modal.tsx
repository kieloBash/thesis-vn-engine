"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useStoryContext } from "@/providers/story";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import { hasIncompleteChain } from "@/helpers";

export function ArgumentSummaryModal() {
  const { argumentLines } = useStoryContext();
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
            Must have at least 5 Complete Arguments. A complete argument
            consists of a claim and multiple chain of grounds and warrants.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {argumentLines.map((arg, idx) => {
              const completeClassName = clsx(
                "w-60 h-80 border rounded-lg shadow-sm flex flex-col p-2",
                hasIncompleteChain(arg) ? "bg-main-50" : "bg-white"
              );

              return (
                <div key={idx} className={completeClassName}>
                  <div className="flex flex-col justify-center items-center">
                    <h2 className="font-bold">{arg.claimKey}</h2>
                    <Label className="text-xs">KEY</Label>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex flex-col justify-center items-center flex-1">
                    <Label className="text-xs">CLAIM</Label>
                    <p className="text-xs font-mono px-2 py-1 bg-slate-200 rounded-full text-wrap">
                      {arg.claimText}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-center flex-[2]">
                    <Label className="text-xs">CHAINS</Label>
                    <div className="w-full grid grid-cols-2">
                      <span className="text-xs font-mono text-center">
                        WARRANT
                      </span>
                      <span className="text-xs font-mono text-center">
                        GROUND
                      </span>
                    </div>
                    <ScrollArea className="w-full h-[120px]">
                      <div className="w-full">
                        {arg.chain.map((ch, idx2) => {
                          return (
                            <div
                              key={`${ch.connectorKey}-${idx2}`}
                              className="grid w-full grid-cols-2 bg-slate-50 p-0.5 rounded-full"
                            >
                              <p className="text-xs font-mono px-2 py-1 text-center border rounded-full text-wrap">
                                {ch.warrant?.text}
                              </p>
                              <p className="text-xs font-mono px-2 py-1 text-center border rounded-full text-wrap">
                                {ch.ground?.text}
                              </p>
                              <p className="col-span-2 text-xs text-center font-bold">
                                Connector: {ch.connectorKey}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              );
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
