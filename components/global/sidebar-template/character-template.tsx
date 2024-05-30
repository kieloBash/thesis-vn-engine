"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

// CHARACTERS
import { useStoryContext } from "@/providers/story";
import clsx from "clsx";
import { CHARACTERS } from "@/constants";
import { PersonStandingIcon } from "lucide-react";

const MoreCharacters = () => {
  const { speaker, setSpeaker } = useStoryContext();

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <h2 className="text-center text-2xl font-bold">Characters</h2>
      <ScrollArea className="h-full w-full mt-4 px-2">
        <div className="w-full grid grid-cols-2 grid-flow-row gap-2">
          {CHARACTERS.map((character, index) => {
            const activeSpeakerClassName = clsx(
              "border h-40 shadow-sm relative overflow-hidden rounded-md p-0 transition-colors",
              speaker?.name === character.name
                ? "bg-main-200"
                : "bg-white hover:bg-main-100"
            );
            return (
              <button
                type="button"
                className={activeSpeakerClassName}
                key={index}
                onClick={() => {
                  if (speaker?.name === character.name) {
                    setSpeaker(undefined);
                  } else {
                    setSpeaker(character);
                  }
                }}
              >
                {character.name === "ME" ? (
                  <>
                    <div className="w-full h-full flex justify-center items-center">
                      <PersonStandingIcon className="w-10 h-10"/>
                    </div>
                  </>
                ) : (
                  <>
                    <Image
                      src={character?.image || ""}
                      alt={character?.name}
                      fill
                      className="object-cover object-top"
                    />
                  </>
                )}
                <div className="absolute bottom-0 left-0 w-full bg-white/50">
                  <h3 className="text-sm font-bold text-center">
                    {character.name}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MoreCharacters;
