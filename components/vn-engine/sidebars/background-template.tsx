"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// CHARACTERS
import { useStoryContext } from "@/providers/story";
import clsx from "clsx";
import { BACKGROUNDS } from "@/constants";
import { CommandType, Dialogue } from "@/types";
import { generateRandomKey } from "@/helpers";
import { Slides, useBuilderContext } from "@/providers/builder";
import {
  AddBackground,
  Command,
  CommandsEnum,
} from "@/types/vn-engine/command-types";
import usePreview from "@/components/hooks/usePreview";
import { isConversation } from "@/types/vn-engine/main-types";

const MoreBackgrounds = () => {
  const {
    visualNovel,
    setVisualNovel,
    setActiveBackground,
    spawnedCharacters,
  } = useBuilderContext();

  const previewSlides = usePreview({ slides: visualNovel });
  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <h2 className="text-center text-2xl font-bold">Preview</h2>
      <ScrollArea className="h-full w-full mt-4 px-2">
        <div className="w-full grid grid-flow-row gap-2">
          {previewSlides.map((slide, index) => {
            if (isConversation(slide.dialogue)) {
              const conversation = slide.dialogue;
              const leftCharacters = slide.spawnedCharacters.filter(
                (d) => d.xPos === 0 && d.name !== "ME"
              );
              const middleCharacters = slide.spawnedCharacters.filter(
                (d) => d.xPos === 0.5 && d.name !== "ME"
              );
              const rightCharacters = slide.spawnedCharacters.filter(
                (d) => d.xPos === 1 && d.name !== "ME"
              );
              const isHidden = slide.dialogue.isHidden;
              console.log(conversation.speaker);

              return (
                <Card key={index} className="overflow-hidden bg-transparent">
                  <CardContent className="flex h-40 relative items-center justify-center p-6 bg-transparent">
                    {slide.activeBackground ? (
                      <div className="absolute z-0 w-full h-full">
                        <Image
                          src={slide.activeBackground?.image?.src}
                          alt="BG"
                          fill
                        />
                      </div>
                    ) : (
                      <>
                        <div className="bg-slate-500 absolute w-full h-full z-0" />
                      </>
                    )}
                    <div className="w-full h-full grid grid-cols-3 relative">
                      <div className="flex justify-center items-end">
                        {leftCharacters.length && conversation.speaker ? (
                          <>
                            {leftCharacters.map((char, idx) => {
                              if (
                                char.name === conversation.speaker.name &&
                                isHidden
                              ) {
                              } else
                                return (
                                  <div key={idx} className="absolute">
                                    <Image
                                      alt="speaker"
                                      src={char?.image?.src}
                                      width={60}
                                      height={60}
                                    />
                                  </div>
                                );
                            })}
                          </>
                        ) : null}
                      </div>
                      <div className="flex justify-center items-end">
                        {middleCharacters.length && conversation.speaker ? (
                          <>
                            {middleCharacters.map((char, idx) => {
                              if (
                                char.name === conversation.speaker.name &&
                                isHidden
                              ) {
                              } else
                                return (
                                  <div key={idx} className="absolute">
                                    <Image
                                      alt="speaker"
                                      src={char?.image?.src}
                                      width={60}
                                      height={60}
                                    />
                                  </div>
                                );
                            })}
                          </>
                        ) : null}
                      </div>
                      <div className="flex justify-center items-end">
                        {rightCharacters.length && conversation.speaker ? (
                          <>
                            {rightCharacters.map((char, idx) => {
                              if (
                                char.name === conversation.speaker.name &&
                                isHidden
                              ) {
                              } else
                                return (
                                  <div key={idx} className="absolute">
                                    <Image
                                      alt="speaker"
                                      src={char?.image?.src}
                                      width={60}
                                      height={60}
                                    />
                                  </div>
                                );
                            })}
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="w-full absolute bottom-0 h-14 bg-black/50 p-4 flex flex-col justify-center items-start">
                      <span className="text-[10px] text-white font-bold">
                        {conversation.altName !== ""
                          ? conversation.altName
                          : conversation.speaker.name.split(" ")[0]}
                      </span>
                      <p className="flex-1 flex-shrink-0 text-[10px] text-white text-wrap">
                        {conversation.line}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MoreBackgrounds;
