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
import { ARG_TAX, ARG_TYPE } from "@/constants";
import {
  ArgumentChain,
  ArgumentTaxEnum,
  ArgumentTypeEnum,
  DisplayArg,
  FullArgument,
} from "@/types/new-types";
import useDisplayArg from "@/components/hooks/useDisplayArg";
import { generateRandomKey } from "@/helpers";

const NewDialogue = () => {
  const {
    speaker,
    story,
    AddDialogue,
    resetModify,
    argumentLines,
    setArguments,
  } = useStoryContext();

  const [currDialogue, setcurrDialogue] = useState("");
  const [currCommands, setcurrCommands] = useState<Command[]>([]);

  const [arg_line, setArg_line] = useState("");
  const [arg_key, setArg_key] = useState("");
  const [arg_connectorkey, setArg_connectorkey] = useState("");
  const [arg_tax, setArg_tax] = useState<ArgumentTax | undefined | string>(
    undefined
  );
  const [arg_type, setArg_type] = useState<ArgumentType | undefined | string>(
    undefined
  );

  const [fullArguments, setfullArguments] =
    useState<FullArgument[]>(argumentLines);
  useEffect(() => {
    setfullArguments(argumentLines);
  }, [argumentLines]);

  const [error, setError] = useState("");
  const [randKey, setRandKey] = useState<string>(generateRandomKey());

  const claimKeys = useMemo(() => {
    const idKeys = new Set<string>();

    story.forEach((dialogue) => {
      dialogue.arguments.forEach((argument) => {
        idKeys.add(argument.claimKey);
      });
    });

    fullArguments.forEach((argument) => {
      idKeys.add(argument.claimKey);
    });
    return Array.from(idKeys);
  }, [story, fullArguments]);

  const dialogue_arguments = useDisplayArg({
    args: fullArguments,
    key: randKey,
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
      lineRef: randKey,
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
            lineRef: randKey,
            connectorKey: arg_connectorkey,
            text: arg_line,
            tax: "warrant" as any,
          },
        };
      } else {
        foundChain = {
          connectorKey: arg_connectorkey,
          ground: {
            lineRef: randKey,
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
            lineRef: randKey,
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
            lineRef: randKey,
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

  function AddNewDialogue() {
    if (!speaker) return null;

    const newDialogue: Dialogue = {
      lineNum: randKey,
      speaker,
      dialogue: currDialogue,
      commands: currCommands,
      arguments: fullArguments,
      type: "FullDialogue",
    };

    AddDialogue(newDialogue);
    setArguments(fullArguments);
    resetModify();
    resetForm();
    resetArgForm();
  }

  function handleSubmitNewStoryLine(e: FormEvent) {
    e.preventDefault();
    AddNewDialogue();
    setRandKey(generateRandomKey());
  }

  return (
    <div className="col-span-3 flex flex-col h-full bg-white">
      <form
        onSubmit={handleSubmitNewStoryLine}
        className="w-full h-full flex flex-col"
      >
        <div className="w-full justify-between gap-1 items-center flex px-4 py-1">
          {speaker ? (
            <>
              <div className="flex gap-2 justify-center items-center">
                <Avatar>
                  <AvatarImage
                    src={speaker.image.src}
                    alt="Pic"
                    className="object-cover object-top bg-main-100 border"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h4 className="font-bold text-lg">{speaker.name}</h4>
              </div>
            </>
          ) : (
            <div className="px-2 py-1 bg-slate-100 text-slate-400 font-bold rounded-full text-sm">
              Select a Speaker
            </div>
          )}
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

          {/* DISPLAY */}
          <>
            <div className="flex-1 border rounded-md p-2">
              {speaker && currDialogue !== "" ? (
                <p className="text-sm font-mono">
                  <span className="">{speaker?.name.split(" ")[0]}</span>{" "}
                  <span className="">&ldquo;{currDialogue}&ldquo;</span>
                  <div className="flex flex-wrap gap-0.5 text-xs">
                    {dialogue_arguments.map((d, idx) => {
                      if (d.tax === ArgumentTaxEnum.CLAIM)
                        return (
                          <span
                            className="px-2 py-1 bg-slate-100 rounded-full"
                            key={idx}
                          >
                            AddClaim(&ldquo;{d.claimKey}&ldquo;,&ldquo;{d.text}
                            &ldquo;,{d.type},{d.tax})
                          </span>
                        );
                      else {
                        return (
                          <span
                            className="px-2 py-1 bg-slate-100 rounded-full"
                            key={idx}
                          >
                            AddChainArg(&ldquo;{d.claimKey}&ldquo;,&ldquo;
                            {d?.connectorKey}&ldquo;,&ldquo;{d.text}
                            &ldquo;,{d.tax})
                          </span>
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
        <Separator className="mt-4" />
        <div className="w-full justify-end gap-1 items-center flex px-4 py-2">
          <Button
            size={"sm"}
            type="submit"
            disabled={!speaker || currDialogue === ""}
          >
            + Add Dialogue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewDialogue;
