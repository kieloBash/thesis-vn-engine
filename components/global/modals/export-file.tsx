"use client";
import useGetStory from "@/components/hooks/useGetStory";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hasIncompleteChain } from "@/helpers";
import { useStoryContext } from "@/providers/story";
import { ArgumentTypeEnum } from "@/types/new-types";
import { useMemo, useState } from "react";

export function ExportModal() {
  const [fileName, setfileName] = useState("");
  const [open, setopen] = useState(false);
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

  const exportToTxtFile = (text: string, filename: string) => {
    // Step 1: Create a Blob from the string
    const blob = new Blob([text], { type: "text/plain" });

    // Step 2: Generate a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Step 3: Create a download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.txt`;

    // Step 4: Programmatically click the download link to start the download
    document.body.appendChild(link);
    link.click();

    // Clean up and remove the link
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
 
  const SAVE_STORY = useGetStory();

  const handleSaveChapter = () => {
    exportToTxtFile(SAVE_STORY, fileName.split(" ").join("_"));
  };

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogTrigger asChild>
        <Button type="button" size={"sm"}>
          Save Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finish chapter!</DialogTitle>
          <DialogDescription>
            Make sure that you have at least 5 arguments
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              Name of the Chapter
            </Label>
            <Input
              id="filename"
              placeholder=""
              value={fileName}
              onChange={(e) => setfileName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-1 mt-4">
            <div className="flex gap-2 items-center justify-center">
              <Label className="">COMPLETE ARGUMENTS:</Label>
              <span className="">{completed_args}</span>
            </div>
            <div className="flex gap-2 justify-center items-center">
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
        <DialogFooter>
          <Button
            type="button"
            disabled={fileName === ""}
            onClick={() => {
              if (fileName !== "") {
                handleSaveChapter();
                setopen(false);
              }
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
