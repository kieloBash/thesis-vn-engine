"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation, isConversation } from "@/types/vn-engine/main-types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Command,
  isAddBackgroundCommand,
  isCommand,
} from "@/types/vn-engine/command-types";
import { Slides } from "@/providers/builder";
import ConversationCard from "./conversation-card";
import AddBackgroundCommandCard from "./background-command-card";
const MainCard = ({
  id,
  data,
  slide,
}: {
  id: string;
  data: Conversation | Command;
  slide: Slides;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="w-full mt-2 bg-white min-h-20 p-2 rounded-md shadow-sm flex flex-col justify-center items-start"
    >
      {isConversation(data) ? (
        <>
          <ConversationCard data={data} />
        </>
      ) : null}
      {isCommand(data) ? (
        <>
          {isAddBackgroundCommand(data) ? (
            <>
              <AddBackgroundCommandCard data={data} />
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default MainCard;
