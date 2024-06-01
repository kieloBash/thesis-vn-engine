import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Slides } from "@/providers/builder";
import { isConversation } from "@/types/vn-engine/main-types";
import Image from "next/image";

export function SlidesCarousel({ slides }: { slides: Slides[] }) {
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-1">
        {slides.map((slide, index) => {
          if (isConversation(slide.dialogue)) {
            const conversation = slide.dialogue;
            const leftCharacter = slide.spawnedCharacters.find(
              (d) => d.xPos === 0
            );
            const middleCharacter = slide.spawnedCharacters.find(
              (d) => d.xPos === 0.5
            );
            const rightCharacter = slide.spawnedCharacters.find(
              (d) => d.xPos === 1
            );
            const activeBackground = slide.activeBackground;
            return (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="overflow-hidden bg-transparent">
                    <CardContent className="flex h-60 relative items-center justify-center p-6">
                      {activeBackground ? (
                        <div className="absolute -z-10 w-full h-full">
                          <Image
                            src={activeBackground?.image?.src}
                            alt="BG"
                            fill
                          />
                        </div>
                      ) : (
                        <>
                          <div className="bg-slate-500 absolute w-full h-full -z-10" />
                        </>
                      )}
                      <div className="w-full h-full grid grid-cols-3">
                        <div className="flex justify-center items-end">
                          {conversation.speaker &&
                            conversation.speaker.name !== "ME" &&
                            leftCharacter && (
                              <Image
                                alt="speaker"
                                src={leftCharacter.image.src}
                                width={85}
                                height={85}
                              />
                            )}
                        </div>
                        <div className="flex justify-center items-end">
                          {conversation.speaker &&
                            conversation.speaker.name !== "ME" &&
                            middleCharacter && (
                              <Image
                                alt="speaker"
                                src={middleCharacter.image.src}
                                width={85}
                                height={85}
                              />
                            )}
                        </div>
                        <div className="flex justify-center items-end">
                          {conversation.speaker &&
                            conversation.speaker.name !== "ME" &&
                            rightCharacter && (
                              <Image
                                alt="speaker"
                                src={rightCharacter.image.src}
                                width={85}
                                height={85}
                              />
                            )}
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
                </div>
              </CarouselItem>
            );
          }
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
