"use client";
import React, { FormEvent, useState, KeyboardEvent } from "react";
import {
  Argument,
  ArgumentTax,
  ArgumentType,
  Command,
  Dialogue,
} from "@/types";

// UI
import { Separator } from "../ui/separator";
import { TooltipButton } from "./tooltip-btn";
import { Button } from "../ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStoryContext } from "@/providers/story";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
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

const ActiveDialogue = () => {
  const { speaker, story, selectedIndex, setStory, resetModify, selectedLine } =
    useStoryContext();

  const [currSpeaker, setcurrSpeaker] = useState(selectedLine?.speaker);

  const [currDialogue, setcurrDialogue] = useState(
    selectedLine?.dialogue || ""
  );
  const [currCommands, setcurrCommands] = useState<Command[]>(
    selectedLine?.commands || []
  );
  const [currArgs, setcurrArgs] = useState<Argument[]>(
    selectedLine?.arguments || []
  );

  const [arg_line, setArg_line] = useState("");
  const [arg_key, setArg_key] = useState("");
  const [arg_connectorkey, setArg_connectorkey] = useState("");
  const [arg_tax, setArg_tax] = useState<ArgumentTax | undefined | string>(
    undefined
  );
  const [arg_type, setArg_type] = useState<ArgumentType | undefined | string>(
    undefined
  );

  const [error, setError] = useState("");

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      if (speaker && currDialogue !== "") {
        event.preventDefault();
        handleSubmitNewStoryLine(
          new Event("submit", {
            cancelable: true,
            bubbles: true,
          }) as unknown as FormEvent
        );
      }
    }
  }
  function resetForm() {
    setcurrDialogue("");
    setcurrCommands([]);
    setcurrArgs([]);

    setArg_line("");
    setArg_key("");
    setArg_connectorkey("");
    setArg_tax(undefined);
    setArg_type(undefined);
  }

  function handleAddArgument() {
    if (arg_line === "") {
      setError("Please enter an argument");
    } else {
      if (
        currDialogue.toLocaleLowerCase().includes(arg_line.toLocaleLowerCase())
      ) {
        if (arg_key === "") {
          setError("Must have a claim key");
        } else if (!arg_type) {
          setError("Please select a type (For,Against,Irrelevant)");
        } else if (!arg_tax) {
          setError("Please select a taxonomy (Claim,Warrant,Ground)");
        } else if (arg_connectorkey === "" && arg_tax !== "Claim") {
          setError("Warrant/Ground arguments needs a connection key");
        } else if (!speaker) {
          setError("Please select a speaker");
        } else {
          AddArgument();
          setError("");
        }
      } else {
        setError("Argument must be in the dialogue");
      }
    }
  }
  function AddArgument() {
    const newArg: Argument = {
      lineRef: story.length,
      id: arg_key,
      line: arg_line,
      tax: arg_tax as ArgumentTax,
      type: arg_type as ArgumentType,
      argumentKey: arg_connectorkey,
    };

    setcurrArgs((prev) => [...prev, newArg]);
    setArg_line("");
    setArg_key("");
    setArg_connectorkey("");
    setArg_tax("");
    setArg_type("");
  }

  function AddNewDialogue() {
    if (!currSpeaker) return null;

    const newDialogue: Dialogue = {
      lineNum: story.length,
      speaker: currSpeaker,
      dialogue: currDialogue,
      commands: currCommands,
      arguments: currArgs,
    };

    let newStory = [...story];
    newStory[selectedIndex] = newDialogue;
    setStory(newStory);

    resetModify();
    resetForm();
  }

  function handleSubmitNewStoryLine(e: FormEvent) {
    e.preventDefault();
    AddNewDialogue();
  }

  function handleDeleteDialogue() {
    let newStory = [...story];
    newStory.splice(selectedIndex, 1);
    setStory(newStory);

    resetForm();
    resetModify();
  }

  return (
    <div className="col-span-3 flex flex-col h-full bg-white">
      <form
        onSubmit={handleSubmitNewStoryLine}
        className="w-full h-full flex flex-col"
      >
        <div className="w-full justify-between gap-1 items-center flex px-4 py-1">
          <Select
            value={currSpeaker?.name || ""}
            onValueChange={(e) => {
              const selSpeaker = CHARACTERS.find((d) => d.name === e);
              setcurrSpeaker(selSpeaker);
            }}
          >
            <SelectTrigger className="w-[320px] h-8">
              <SelectValue placeholder="Select a speaker" />
            </SelectTrigger>
            <SelectContent id="speaker">
              <SelectGroup>
                <SelectLabel>Speaker</SelectLabel>
                {CHARACTERS.map((data, idx) => {
                  return (
                    <SelectItem key={idx} value={data.name}>
                      <div className="flex gap-1 justify-center items-center">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={data.image.src}
                            alt="Pic"
                            className="object-cover object-top bg-main-100 border"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h4 className="font-semibold">{data.name}</h4>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <TooltipButton tip="Delete">
              <Button
                onClick={handleDeleteDialogue}
                type="button"
                variant={"ghost"}
                size={"icon"}
              >
                <Trash2Icon />
              </Button>
            </TooltipButton>
            <TooltipButton tip="New">
              <Button
                onClick={resetModify}
                type="button"
                variant={"ghost"}
                size={"icon"}
              >
                <PlusIcon />
              </Button>
            </TooltipButton>
          </div>
        </div>
        <Separator className="mb-4" />
        <div className="flex flex-col gap-2 px-4 flex-1">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="dialogue">Dialogue</Label>
            <Textarea
              value={currDialogue}
              onChange={(e) => setcurrDialogue(e.target.value)}
              placeholder="Type your dialogue here"
              id="dialogue"
              className="resize-none"
              rows={3}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* ARGUMENT */}
          <>
            <Label className="mt-2">ARGUMENT</Label>
            <Input
              placeholder="Enter argument here..."
              value={arg_line}
              onChange={(e) => setArg_line(e.target.value)}
            />
            <div className="w-full grid grid-cols-2 gap-2">
              <Input
                placeholder="Enter claim key..."
                value={arg_key}
                onChange={(e) => setArg_key(e.target.value)}
              />
              <Input
                placeholder="Enter connector key..."
                value={arg_connectorkey}
                onChange={(e) => setArg_connectorkey(e.target.value)}
              />
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <Select
                value={arg_type}
                onValueChange={(e) => {
                  setArg_type(e as ArgumentType);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Type" />
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Taxonomy" />
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
            <div className="w-full">
              <Button
                type="button"
                onClick={handleAddArgument}
                className="w-full h-10"
              >
                + Add Argument
              </Button>
            </div>
          </>

          {/* DISPLAY */}
          <>
            <div className="flex-1 border rounded-md p-2">
              {speaker && currDialogue !== "" ? (
                <p className="text-sm font-mono">
                  <span className="">{speaker?.name.split(" ")[0]}</span>{" "}
                  <span className="">&ldquo;{currDialogue}&ldquo;</span>
                  <div className="flex flex-wrap gap-0.5 text-xs">
                    {currArgs.map((arg, idx) => {
                      const textToDisplay = `${arg.lineRef},${arg.id},${
                        arg.tax
                      },${arg.type},"${arg.line}"${
                        arg.argumentKey !== "" ? `,${arg.argumentKey}` : ""
                      }`;
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            let newArgs = [...currArgs];
                            newArgs.splice(idx, 1);
                            setcurrArgs(newArgs);
                          }}
                          className="p-1 bg-slate-100 rounded-md hover:bg-slate-50 transition-colors"
                          key={idx}
                        >
                          AddArgument({textToDisplay})
                        </button>
                      );
                    })}
                  </div>
                </p>
              ) : null}
            </div>
          </>

          {/* ERROR */}
          <p className="w-full text-left text-sm font-bold text-red-400">
            {error}
          </p>
        </div>
        <Separator className="mt-4" />
        <div className="w-full justify-end gap-1 items-center flex px-4 py-2">
          <Button
            size={"sm"}
            type="submit"
            disabled={!speaker || currDialogue === ""}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ActiveDialogue;
