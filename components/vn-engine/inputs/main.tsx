"use client";
import React from "react";
import ConversationInput from "./conversation";
import { useBuilderContext } from "@/providers/builder";
import { CommandsEnum } from "@/types/vn-engine/command-types";
import RemoveBackgroundInput from "./commands-input/removeBackground";
import MoveCharacterInput from "./commands-input/moveCharacter";
import AddBackgroundInput from "./commands-input/addBackground";
import EditConversationInput from "./edit-conversation";
import CreateCharacterInput from "./commands-input/createCharacter";

const MainInputs = () => {
  const { selectedCommand } = useBuilderContext();
  return (
    <div className="col-span-3 bg-white">
      {selectedCommand ? (
        <>
          {selectedCommand?.isConvo ? (
            <>
              <EditConversationInput />
            </>
          ) : (
            <>
              {selectedCommand?.command === CommandsEnum.AddBackground ? (
                <AddBackgroundInput />
              ) : null}
              {selectedCommand?.command === CommandsEnum.RemoveBackground ? (
                <RemoveBackgroundInput />
              ) : null}
              {selectedCommand?.command === CommandsEnum.MoveCharacter ? (
                <MoveCharacterInput />
              ) : null}
              {selectedCommand?.command === CommandsEnum.CreateCharacter ? (
                <CreateCharacterInput />
              ) : null}
            </>
          )}
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
