"use client";
import React from "react";
import { MoveCharacter } from "@/types/vn-engine/command-types";

const MoveCharacterCard = ({
  data,
  id,
}: {
  data: MoveCharacter;
  id: string;
}) => {
  return (
    <div className="w-full h-full absolute top-0 left-0 bg-blue-50 flex px-4">
      <div className="flex gap-2 justify-center items-center font-mono">
        <p className="text-xs">Move</p>
        <p className="text-xs bg-slate-200 px-2 py-1">
          {data.speaker ? data.speaker.name.split(" ")[0] : "unknown"}
        </p>
        <p className="text-xs">to</p>
        <p className="text-xs bg-slate-200 px-2 py-1">
          {data.xPos === 0
            ? "Left"
            : data.xPos === 0.5
            ? "Center"
            : data.xPos === 1
            ? "Right"
            : "unknown"}
        </p>
      </div>
    </div>
  );
};

export default MoveCharacterCard;
