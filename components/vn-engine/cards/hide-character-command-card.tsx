"use client";
import React from "react";
import {
  CreateCharacter,
  FlipCharacter,
  HideCharacter,
} from "@/types/vn-engine/command-types";
import clsx from "clsx";
import { useBuilderContext } from "@/providers/builder";

const HideCharacterCommandCard = ({
  data,
  id,
}: {
  data: HideCharacter;
  id: string;
}) => {
  const { selectedSlide } = useBuilderContext();

  const blank = !data.speaker;
  const mainClassName = clsx(
    "w-full h-full absolute top-0 left-0 flex px-4 rounded-md",
    blank ? "bg-red-100 border border-black shadow-sm" : "bg-blue-50",
    selectedSlide?.id === id ? "bg-main-400" : ""
  );

  return (
    <div className={mainClassName}>
      <div className="flex gap-2 justify-center items-center font-mono">
        <p className="text-xs">Hide</p>
        <p className="text-xs bg-slate-200 px-2 py-1 rounded-md">
          {data.speaker ? data.speaker.name.split(" ")[0] : "unknown"}
        </p>
        <p className="text-xs bg-slate-200 px-2 py-1 rounded-md">
          {data.isInstant ? "Immediate" : "Fade In"}
        </p>
      </div>
    </div>
  );
};

export default HideCharacterCommandCard;
