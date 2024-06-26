"use client";
import React, {
  FormEvent,
  useState,
  KeyboardEvent,
  useMemo,
  useEffect,
} from "react";
import {
  Argument,
  ArgumentTax,
  ArgumentType,
  Command,
  Dialogue,
} from "@/types";

// UI
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStoryContext } from "@/providers/story";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import {
  ArgumentChain,
  ArgumentTaxEnum,
  ArgumentTypeEnum,
  DisplayArg,
  FullArgument,
} from "@/types/new-types";
import useDisplayArg from "@/components/hooks/useDisplayArg";
import { TooltipButton } from "../tooltip-btn";
import { PlusIcon, Trash2Icon } from "lucide-react";
import BackgroundCommandTemplate from "../active/background";
import {
  isActionCommand,
  isAudioCommand,
  isBackgroundCommand,
  isSpawnedSpeaker,
} from "@/helpers";
import AudioCommandTemplate from "../active/audio";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActionCommandTemplate from "../active/action";

const ActiveDialogue = () => {
  const {
    speaker,
    story,
    resetModify,
    argumentLines,
    setArguments,
    selectedIndex,
    selectedLine,
    setStory,

    spawnedSpeakers,
    setspawnedSpeakers,
  } = useStoryContext();

  const [currDialogue, setcurrDialogue] = useState(
    selectedLine?.dialogue || ""
  );
  const [currCommands, setcurrCommands] = useState<Command[]>(
    selectedLine?.commands || []
  );
  const [currSpeaker, setcurrSpeaker] = useState(selectedLine?.speaker);

  const [arg_line, setArg_line] = useState("");
  const [arg_key, setArg_key] = useState("");
  const [arg_connectorkey, setArg_connectorkey] = useState("");
  const [arg_tax, setArg_tax] = useState<ArgumentTax | undefined | string>(
    undefined
  );
  const [arg_type, setArg_type] = useState<ArgumentType | undefined | string>(
    undefined
  );
  const [xPos, setxPos] = useState(selectedLine?.speaker?.xPos);

  const [fullArguments, setfullArguments] =
    useState<FullArgument[]>(argumentLines);
  useEffect(() => {
    setfullArguments(argumentLines);
  }, [argumentLines]);

  useEffect(() => {
    if (selectedLine) {
      setcurrSpeaker(selectedLine?.speaker);
      setcurrDialogue(selectedLine?.dialogue || "");
      setcurrCommands(selectedLine?.commands || []);
      setxPos(selectedLine?.speaker?.xPos);
    }
  }, [selectedLine, selectedIndex]);

  const [error, setError] = useState("");

  const claimKeys = useMemo(() => {
    const idKeys = new Set<string>();

    fullArguments.forEach((argument) => {
      idKeys.add(argument.claimKey);
    });
    return Array.from(idKeys);
  }, [fullArguments]);

  const dialogue_arguments = useDisplayArg({
    args: fullArguments,
    key: selectedIndex,
  });

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
    setfullArguments([]);

    setArg_line("");
    setArg_key("");
    setArg_connectorkey("");
    setArg_tax(undefined);
    setArg_type(undefined);
  }
  function resetArgForm() {
    setArg_line("");
    setArg_key("");
    setArg_connectorkey("");
    setArg_tax("");
    setArg_type("");
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
        } else if (!arg_type && arg_tax === "Claim") {
          setError("Claim arguments needs a type (For,Against,Irrelevant)");
        } else if (!arg_tax) {
          setError("Please select a taxonomy (Claim,Warrant,Ground)");
        } else if (arg_connectorkey === "" && arg_tax !== "Claim") {
          setError("Warrant/Ground arguments needs a connection key");
        } else if (!speaker) {
          setError("Please select a speaker");
        } else {
          setError("");
          AddArgument();
        }
      } else {
        setError("Argument must be in the dialogue");
      }
    }
  }
  function AddArgument() {
    if (arg_tax === "Claim") {
      AddClaimArgument();
    } else if (arg_tax === "Warrant") {
      AddWarrantGroundArgument("warrant");
    } else if (arg_tax === "Ground") {
      AddWarrantGroundArgument("ground");
    }
  }
  function AddClaimArgument() {
    if (claimKeys.includes(arg_key)) {
      setError("Already have a claim on that key!");
      return;
    }
    const newFullArgument: FullArgument = {
      lineRef: selectedIndex,
      claimKey: arg_key,
      claimText: arg_line,
      type:
        arg_type === "For"
          ? ArgumentTypeEnum.FOR
          : arg_type === "Against"
          ? ArgumentTypeEnum.AGAINST
          : ArgumentTypeEnum.IRRELEVANT,
      tax:
        arg_tax === "Claim"
          ? ArgumentTaxEnum.CLAIM
          : arg_type === "Warrant"
          ? ArgumentTaxEnum.WARRANT
          : ArgumentTaxEnum.GROUND,
      chain: [],
    };
    setfullArguments((prev) => [...prev, newFullArgument]);
    resetArgForm();
  }
  function AddWarrantGroundArgument(ww: "warrant" | "ground") {
    let newFullArguments = [...fullArguments];
    let argIndex = newFullArguments.findIndex((d) => d.claimKey === arg_key);

    if (argIndex === -1) {
      console.log("No Found Claim");
      return;
    } // no found claim

    let foundArg = newFullArguments[argIndex];
    const chainIndex = foundArg.chain.findIndex(
      (d) => d.connectorKey === arg_connectorkey
    );
    let foundChain: ArgumentChain | undefined;
    if (chainIndex === -1) {
      // no chain yet
      if (ww === "warrant") {
        foundChain = {
          connectorKey: arg_connectorkey,
          warrant: {
            lineRef: selectedIndex,
            connectorKey: arg_connectorkey,
            text: arg_line,
            tax: "warrant" as any,
          },
        };
      } else {
        foundChain = {
          connectorKey: arg_connectorkey,
          ground: {
            lineRef: selectedIndex,
            connectorKey: arg_connectorkey,
            text: arg_line,
            tax: "ground" as any,
          },
        };
      }
      foundArg.chain.push(foundChain);
    } else {
      foundChain = foundArg.chain[chainIndex];

      if (ww === "warrant") {
        if (!foundChain.warrant)
          foundChain.warrant = {
            lineRef: selectedIndex,
            connectorKey: arg_connectorkey,
            text: arg_line,
            tax: "warrant" as any,
          };
        else {
          setError("Already existing warrant on the chain connector");
          return;
        }
      } else {
        if (!foundChain.ground)
          foundChain.ground = {
            lineRef: selectedIndex,
            connectorKey: arg_connectorkey,
            text: arg_line,
            tax: "ground" as any,
          };
        else {
          setError("Already existing ground on the chain connector");
          return;
        }
      }
      foundArg.chain[chainIndex] = foundChain;
    }
    //new chain

    newFullArguments[argIndex] = foundArg;
    setfullArguments(newFullArguments);
    resetArgForm();
  }

  function SaveChanges() {
    if (!currSpeaker) return null;

    const newDialogue: Dialogue = {
      ...selectedLine,
      lineNum: selectedIndex,
      speaker: { ...currSpeaker, xPos },
      dialogue: currDialogue,
      commands: currCommands,
      arguments: fullArguments,
      type: "FullDialogue",
    };

    if (
      !isSpawnedSpeaker({ speaker: currSpeaker, arr: spawnedSpeakers }) &&
      selectedLine?.isSpawnSpeaker
    ) {
      let newSpeakers = [...spawnedSpeakers];
      newSpeakers = newSpeakers.filter((s) => s.name !== speaker?.name);
      console.log(newSpeakers);
      setspawnedSpeakers([...newSpeakers, currSpeaker]);
    }

    let newStory = [...story];
    const index = newStory.findIndex((d) => d.lineNum === selectedIndex);
    if (index === -1) return;

    newStory[index] = newDialogue;
    setStory(newStory);

    setArguments(fullArguments);
    resetModify();
    resetForm();
    resetArgForm();
  }

  function handleSubmitNewStoryLine(e: FormEvent) {
    e.preventDefault();
    SaveChanges();
  }
  function handleDeleteDialogue() {
    if (!currSpeaker) return null;

    let newStory = [...story];
    const index = newStory.findIndex((d) => d.lineNum === selectedIndex);
    if (index === -1) return;

    newStory.splice(index, 1);
    setStory(newStory);

    if (
      isSpawnedSpeaker({ speaker: currSpeaker, arr: spawnedSpeakers }) &&
      selectedLine?.isSpawnSpeaker
    ) {
      let newSpeakers = [...spawnedSpeakers];
      newSpeakers = newSpeakers.filter((s) => s.name !== currSpeaker?.name);
      setspawnedSpeakers(newSpeakers);
    }

    // DELETE ARGS
    let deletedArgs = argumentLines.filter((d) => d.lineRef !== selectedIndex);

    // Filter out only chain.ground or chain.warrant if matching the selectedIndex
    let updatedArgs: FullArgument[] = [];
    deletedArgs.forEach((arg) => {
      let newArg = arg;
      let newChains: ArgumentChain[] = [];

      newArg.chain.map((ch) => {
        let newChain = ch;

        if (newChain.ground?.lineRef === selectedIndex) delete newChain.ground;
        if (newChain.warrant?.lineRef === selectedIndex)
          delete newChain.warrant;

        if (newChain.ground || newChain.warrant) newChains.push(newChain);
      });
      newArg.chain = newChains;
      updatedArgs.push(newArg);
    });

    setArguments(updatedArgs);

    resetForm();
    resetModify();
  }

  // IF BACKGROUND COMMAND
  if (
    selectedLine &&
    selectedLine.commands.length > 0 &&
    isBackgroundCommand(selectedLine.commands[0])
  ) {
    return <BackgroundCommandTemplate command={selectedLine.commands[0]} />;
  }

  // IF AUDIO COMMAND
  if (
    selectedLine &&
    selectedLine.commands.length > 0 &&
    isAudioCommand(selectedLine.commands[0])
  ) {
    return <AudioCommandTemplate command={selectedLine.commands[0]} />;
  }

  // IF ACTION COMMAND
  if (
    selectedLine &&
    selectedLine.commands.length > 0 &&
    isActionCommand(selectedLine.commands[0])
  ) {
    return <ActionCommandTemplate command={selectedLine.commands[0]} />;
  }

  return (
    <div className="col-span-3 flex flex-col h-full bg-white">
      <ScrollArea className="h-screen">
        <form
          onSubmit={handleSubmitNewStoryLine}
          className="w-full min-h-screen flex flex-col justify-between"
        >
          <div className="flex flex-col w-full h-full">
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
                            {data.name !== "ME" && (
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={data.image.src}
                                  alt="Pic"
                                  className="object-cover object-top bg-main-100 border"
                                />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                            )}
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
              {/* DIALOGUE */}
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
                  {arg_tax === "Claim" ? (
                    <>
                      <Input
                        placeholder="Enter claim key..."
                        value={arg_key}
                        onChange={(e) => setArg_key(e.target.value)}
                      />
                    </>
                  ) : null}
                  {arg_tax === "Warrant" || arg_tax === "Ground" ? (
                    <>
                      <>
                        <Select
                          value={arg_key}
                          onValueChange={(e) => {
                            setArg_key(e);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Claim Key" />
                          </SelectTrigger>
                          <SelectContent id="claimKey">
                            <SelectGroup>
                              <SelectLabel>CLAIM KEY</SelectLabel>
                              {claimKeys.map((data, idx) => {
                                return (
                                  <SelectItem key={idx} value={data}>
                                    {data}
                                  </SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </>
                    </>
                  ) : null}
                </div>
                <div className="w-full grid gap-2">
                  {arg_tax === "Warrant" || arg_tax === "Ground" ? (
                    <>
                      <Input
                        placeholder="Enter connector key..."
                        value={arg_connectorkey}
                        onChange={(e) => setArg_connectorkey(e.target.value)}
                      />
                    </>
                  ) : null}
                  {arg_tax === "Claim" ? (
                    <>
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
                    </>
                  ) : null}
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

              {/* MOVEMENT */}
              <>
                {currSpeaker &&
                currSpeaker.name !== "ME" &&
                selectedLine?.isSpawnSpeaker ? (
                  <>
                    <div className="grid w-full gap-1.5 mt-4">
                      <Label htmlFor="dialogue">SetXPosition()</Label>
                      <Select
                        value={`${
                          xPos === 0.5 ? "0.5" : xPos === 0 ? "0" : "1"
                        }`}
                        onValueChange={(e) => {
                          setxPos(e === "0.5" ? 0.5 : e === "0" ? 0 : 1);
                        }}
                      >
                        <SelectTrigger className="w-[320px]">
                          <SelectValue placeholder="xPos" />
                        </SelectTrigger>
                        <SelectContent id="xPos">
                          <SelectGroup>
                            <SelectLabel>X Position</SelectLabel>
                            <SelectItem value={"0"}>Left</SelectItem>
                            <SelectItem value={"0.5"}>Center</SelectItem>
                            <SelectItem value={"1"}>Right</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : null}
              </>

              {/* PREVIEW */}
              <>
                {currSpeaker &&
                currSpeaker.name !== "ME" &&
                selectedLine?.isSpawnSpeaker ? (
                  <>
                    <div className="h-56 relative overflow-hidden rounded-md">
                      <div className="w-full h-full border p-2 bg-slate-800 grid grid-cols-3 divide-x divide-dashed">
                        <div className="flex justify-center items-end">
                          {currSpeaker &&
                            currSpeaker.name !== "ME" &&
                            xPos === 0 && (
                              <Image
                                alt="speaker"
                                src={currSpeaker?.image.src}
                                width={70}
                                height={70}
                              />
                            )}
                        </div>
                        <div className="flex justify-center items-end">
                          {currSpeaker &&
                            currSpeaker.name !== "ME" &&
                            xPos === 0.5 && (
                              <Image
                                alt="speaker"
                                src={currSpeaker?.image.src}
                                width={70}
                                height={70}
                              />
                            )}
                        </div>
                        <div className="flex justify-center items-end">
                          {currSpeaker &&
                            currSpeaker.name !== "ME" &&
                            xPos === 1 && (
                              <Image
                                alt="speaker"
                                src={currSpeaker?.image?.src}
                                width={70}
                                height={70}
                              />
                            )}
                        </div>
                      </div>
                      <div className="w-full absolute bottom-0 h-12 bg-black/30 p-4 flex justify-center items-center">
                        <p className="flex-1 text-xs text-white text-wrap">
                          {currDialogue}
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}
              </>

              {/* DISPLAY */}
              <>
                <div className="min-h-20 border rounded-md p-2">
                  {currSpeaker && currDialogue !== "" ? (
                    <p className="text-sm font-mono">
                      <span className="">
                        {currSpeaker?.name.split(" ")[0]}
                      </span>{" "}
                      <span className="">&ldquo;{currDialogue}&ldquo;</span>
                      <div className="flex flex-wrap gap-0.5 text-xs">
                        {dialogue_arguments.map((d, idx) => {
                          if (d.tax === ArgumentTaxEnum.CLAIM)
                            return (
                              <button
                                type="button"
                                onClick={() => {
                                  let deletedArgs = fullArguments.filter(
                                    (atArg) => atArg.claimKey !== d.claimKey
                                  );
                                  setfullArguments(deletedArgs);
                                }}
                                className="px-2 py-1 bg-slate-100 rounded-full hover:bg-slate-300 transition-colors"
                                key={idx}
                              >
                                AddClaim(&ldquo;{d.claimKey}&ldquo;,&ldquo;
                                {d.text}
                                &ldquo;,{d.type},{d.tax})
                              </button>
                            );
                          else {
                            return (
                              <button
                                type="button"
                                onClick={() => {
                                  let updatedArgs: FullArgument[] = [];
                                  fullArguments.forEach((arg) => {
                                    let newArg = arg;
                                    let newChains: ArgumentChain[] = [];

                                    newArg.chain.map((ch) => {
                                      let newChain = ch;

                                      if (
                                        newChain.ground?.connectorKey ===
                                          d?.connectorKey &&
                                        newArg.claimKey === d.claimKey
                                      )
                                        delete newChain.ground;
                                      if (
                                        newChain.warrant?.connectorKey ===
                                          d?.connectorKey &&
                                        newArg.claimKey === d.claimKey
                                      )
                                        delete newChain.warrant;

                                      if (newChain.ground || newChain.warrant)
                                        newChains.push(newChain);
                                    });
                                    newArg.chain = newChains;
                                    updatedArgs.push(newArg);

                                    setfullArguments(updatedArgs);
                                  });
                                }}
                                className="px-2 py-1 bg-slate-100 rounded-full hover:bg-slate-300 transition-colors"
                                key={idx}
                              >
                                AddChainArg(&ldquo;{d.claimKey}&ldquo;,&ldquo;
                                {d?.connectorKey}&ldquo;,&ldquo;{d.text}
                                &ldquo;,{d.tax})
                              </button>
                            );
                          }
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
          </div>
          <div className="">
            <Separator className="mt-4" />
            <div className="w-full justify-end gap-1 items-center flex px-4 py-2">
              <Button size={"sm"} type="submit">
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
};

export default ActiveDialogue;
