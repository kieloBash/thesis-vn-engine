"use client";
import React from "react";
import {
  CreateCharacter,
  FlipCharacter,
  HideCharacter,
  ShowCharacter,
} from "@/types/vn-engine/command-types";
import clsx from "clsx";
import { useBuilderContext } from "@/providers/builder";

const ShowCharacterCommandCard = ({
  data,
  id,
}: {
  data: ShowCharacter;
  id: string;
}) => {
  const { selectedSlide } = useBuilderContext();

  const blank = data.speakers.length <= 0;
  const mainClassName = clsx(
    "w-full h-full absolute top-0 left-0 flex px-4 rounded-md",
    blank ? "bg-red-100 border border-black shadow-sm" : "bg-blue-50",
    selectedSlide?.id === id ? "bg-main-400" : ""
  );

  return (
    <div className={mainClassName}>
      <div className="flex gap-2 justify-center items-center font-mono">
        <p className="text-xs">Show</p>
        {data.speakers.length > 0 ? (
          <div className="flex justify-start items-center gap-1">
            {data.speakers.map((speaker) => {
              return (
                <p
                  key={speaker.name}
                  className="text-xs bg-slate-200 px-2 py-1 rounded-md"
                >
                  {speaker.name.split(" ")[0]}
                </p>
              );
            })}
          </div>
        ) : (
          <>
            <p className="text-xs bg-slate-200 px-2 py-1 rounded-md">unknown</p>
          </>
        )}

        <p className="text-xs bg-slate-200 px-2 py-1 rounded-md">
          {data.isInstant ? "Immediate" : "Fade In"}
        </p>
      </div>
    </div>
  );
};

export default ShowCharacterCommandCard;
