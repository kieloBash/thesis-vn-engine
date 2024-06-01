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
  isRemoveBackgroundCommand,
} from "@/types/vn-engine/command-types";
import { Slides, useBuilderContext } from "@/providers/builder";
import ConversationCard from "./conversation-card";
import AddBackgroundCommandCard from "./add-background-command-card";
import RemoveBackgroundCommandCard from "./remove-background-command-card";
import { Button } from "@/components/ui/button";
import { PenBoxIcon, Trash2 } from "lucide-react";
const MainCard = ({
  id,
  data,
  slide,
}: {
  id: string;
  data: Conversation | Command;
  slide: Slides;
}) => {
  const { toggleEdits, visualNovel, setVisualNovel } = useBuilderContext();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  function handleDeleteCard() {
    const selectedIdx = visualNovel.findIndex((d) => d.id === id);
    if (selectedIdx === -1) return;

    let newSlides = [...visualNovel];
    newSlides.splice(selectedIdx, 1);
    setVisualNovel(newSlides);
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="relative overflow-hidden w-full mt-2 bg-white min-h-14 p-2 px-4 rounded-md shadow-sm flex flex-col justify-center items-start"
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
          {isRemoveBackgroundCommand(data) ? (
            <>
              <RemoveBackgroundCommandCard data={data} id={id} />
            </>
          ) : null}
        </>
      ) : null}
      {toggleEdits ? (
        <div className="absolute flex gap-1 right-2 z-10 h-full justify-center items-center">
          {(!isCommand(data) ||
            (isCommand(data) && !isRemoveBackgroundCommand(data))) && (
            <Button
              type="button"
              className="w-7 h-7 p-1"
              onClick={() => {}}
              variant={"outline"}
              size={"icon"}
            >
              <PenBoxIcon className="w-full h-full" />
            </Button>
          )}
          <Button
            type="button"
            className="w-7 h-7 p-1"
            onClick={handleDeleteCard}
            variant={"outline"}
            size={"icon"}
          >
            <Trash2 className="w-full h-full" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default MainCard;
