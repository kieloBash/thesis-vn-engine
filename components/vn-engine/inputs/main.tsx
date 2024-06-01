"use client";
import React from "react";
import ConversationInput from "./conversation";
import { useBuilderContext } from "@/providers/builder";
import { CommandsEnum } from "@/types/vn-engine/command-types";
import RemoveBackgroundInput from "./commands-input/removeBackground";

const MainInputs = () => {
  const { selectedCommand } = useBuilderContext();
  return (
    <div className="col-span-3 bg-white">
      {selectedCommand ? (
        <>
          {selectedCommand.command === CommandsEnum.RemoveBackground ? (
            <RemoveBackgroundInput />
          ) : null}
        </>
      ) : (
        <>
          <ConversationInput />
        </>
      )}
    </div>
  );
};

export default MainInputs;
