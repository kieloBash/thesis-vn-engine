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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStoryContext } from "@/providers/story";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ARG_TAX, ARG_TYPE, CHARACTERS } from "@/constants";
import { Textarea } from "../ui/textarea";
import { Argument, ArgumentTax, ArgumentType, StoryLine } from "@/types";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

export function ModifyLine() {
  const {
    toggleModify,
    setToggleModify,

    selectedLine,
    story,
    argumentLines,
    setArguments,
    selectedIndex,
    setStory,

    resetModify,
  } = useStoryContext();

  //   VALUES
  const [speaker, setSpeaker] = useState(selectedLine?.speaker);
  const [dialogue, setDialogue] = useState(selectedLine?.dialogue || "");

  const [arg_line, setArg_line] = useState("");
  const [arg_key, setArg_key] = useState("");
  const [arg_connectorkey, setArg_connectorkey] = useState("");
  const [arg_tax, setArg_tax] = useState<ArgumentTax | undefined>(undefined);
  const [arg_type, setArg_type] = useState<ArgumentType | undefined>(undefined);

  const [error, setError] = useState("");

  function handleDeleteLine() {
    let storyCopy = [...story];
    storyCopy.splice(selectedIndex, 1);
    let newArgumentLines = argumentLines.filter(
      (d) => d.lineRef != selectedIndex
    );

    setArguments(newArgumentLines);
    setStory(storyCopy);

    resetModify();
    setError("");
  }

  function handleSaveChanges() {
    if (!speaker || dialogue === "") return;
    setError("");
    let newStory = [...story];
    let newStoryLine: StoryLine = {
      speaker,
      dialogue,
      commands: [],
    };
    newStory[selectedIndex] = newStoryLine;

    if (arg_line !== "") {
      const checker = handleArgument();
      if (checker) {
        setStory(newStory);
        resetModify();
      }
    } else {
      setStory(newStory);
      resetModify();
    }
  }

  function handleArgument() {
    let bool = false;
    if (dialogue.toLocaleLowerCase().includes(arg_line.toLocaleLowerCase())) {
      if (arg_key === "") setError("The argument needs a claim key");
      else if (!arg_tax)
        setError("The argument needs a taxonomy type (CLAIM,WARRANT,GROUND)");
      else if (!arg_type)
        setError(
          "The argument needs an argument type (FOR,AGAINST,IRRELEVANT)"
        );
      else if (arg_tax !== "Claim" && arg_connectorkey === "") {
        setError("The warrant/ground argument needs a connection key");
      } else {
        //add argument
        const newArgument: Argument = {
          lineRef: selectedIndex,
          id: arg_key.toLocaleLowerCase(),
          line: arg_line,
          tax: arg_tax,
          type: arg_type,
          argumentKey: arg_connectorkey.toLocaleLowerCase(),
        };
        setArguments([...argumentLines, newArgument]);
        bool = true;
        return bool;
      }
    } else {
      setError("The argument isn't found on the dialogue!");
    }
    return bool;
  }

  const selArgument = argumentLines.filter((d) => d.lineRef === selectedIndex);

  return (
    <Dialog open={toggleModify} onOpenChange={setToggleModify}>
      <DialogContent className="sm:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>Modify Line</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="speaker">Speaker</Label>
            <Select
              value={speaker?.name || ""}
              onValueChange={(e) => {
                const selSpeaker = CHARACTERS.find((d) => d.name === e);
                setSpeaker(selSpeaker);
              }}
            >
              <SelectTrigger className="w-[320px]">
                <SelectValue placeholder="Select a speaker" />
              </SelectTrigger>
              <SelectContent id="speaker">
                <SelectGroup>
                  <SelectLabel>Speaker</SelectLabel>
                  {CHARACTERS.map((data, idx) => {
                    return (
                      <SelectItem key={idx} value={data.name}>
                        {data.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md p-2 flex flex-wrap">
            {selArgument.length ? (
              <div className="flex items-center gap-2">
                {selArgument.map((arg, idx) => (
                  <button
                    type="button"
                    onClick={() => {
                      let newArgumentLines = [...argumentLines];
                      newArgumentLines = newArgumentLines.filter(
                        (d) =>
                          d.lineRef === arg.lineRef &&
                          d.tax !== arg.tax &&
                          d.type !== arg.type
                      );
                      setArguments(newArgumentLines);
                    }}
                    key={idx}
                    className="flex flex-col text-xs p-1.5 rounded-md border font-semibold hover:bg-slate-100 transition-colors"
                  >
                    <div className="">
                      {arg.tax}/{arg.type}: {arg.line.substring(0, 24)}
                    </div>
                    <div className="">Line: {arg.lineRef}</div>
                    <div className="">Key: {arg.id}</div>
                    {arg.argumentKey && (
                      <div className="">Connector: {arg.argumentKey}</div>
                    )}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid w-full gap-1.5">
          <Label htmlFor="dialogue">Dialogue</Label>
          <Textarea
            id="dialogue"
            placeholder=""
            value={dialogue}
            className="resize-none"
            onChange={(e) => setDialogue(e.target.value)}
          />
        </div>

        <Separator />
        <Label>ARGUMENT</Label>
        <div className="grid w-full gap-1.5">
          <div className="w-full flex items-center justify-between">
            <Label htmlFor="arg_line">Argument Line</Label>

            <div className="flex gap-2">
              <Input
                placeholder="Enter Claim Key..."
                className="h-8 w-[160px]"
                value={arg_key}
                onChange={(e) => setArg_key(e.target.value)}
              />
              <Input
                placeholder="Enter Connector Key..."
                className="h-8 w-[160px]"
                value={arg_connectorkey}
                onChange={(e) => setArg_connectorkey(e.target.value)}
              />
              <Select
                value={arg_type}
                onValueChange={(e) => {
                  setArg_type(e as ArgumentType);
                }}
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent id="type">
                  <SelectGroup>
                    <SelectLabel>TYPE</SelectLabel>
                    {ARG_TYPE.map((data, idx) => {
                      return (
                        <SelectItem key={idx} value={data}>
                          {data}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select
                value={arg_tax}
                onValueChange={(e) => {
                  setArg_tax(e as ArgumentTax);
                }}
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue placeholder="Taxonomy" />
                </SelectTrigger>
                <SelectContent id="tax">
                  <SelectGroup>
                    <SelectLabel>TAXONOMY</SelectLabel>
                    {ARG_TAX.map((data, idx) => {
                      return (
                        <SelectItem key={idx} value={data}>
                          {data}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Textarea
            id="arg_line"
            placeholder="Should be from the dialogue..."
            value={arg_line}
            onChange={(e) => setArg_line(e.target.value)}
            rows={1}
            className="resize-none"
          />
          <p className="text-xs font-light">
            The argument line should be taken from the dialogue*{" "}
          </p>
        </div>
        <DialogFooter className="flex w-full items-center justify-between">
          {error !== "" && (
            <div className="font-bold text-sm text-red-400 w-full">{error}</div>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              className="bg-red-400 hover:bg-red-300"
              onClick={handleDeleteLine}
            >
              Delete
            </Button>
            <Button type="button" onClick={handleSaveChanges}>
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
