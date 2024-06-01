"use client";
import { useBuilderContext } from "@/providers/builder";
import { isConversation } from "@/types/vn-engine/main-types";
import React, { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToolsSummary from "../tools-summary/summary";
import {
  isAddBackgroundCommand,
  isCommand,
} from "@/types/vn-engine/command-types";

import { closestCorners, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ConversationCard from "../cards/conversation-card";
import MainCard from "../cards/main-card";

const DialogueList = () => {
  const { visualNovel, setVisualNovel } = useBuilderContext();

  const getPos = (id: string) => visualNovel.findIndex((d) => d.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    const originalPos = getPos(active.id);
    const newPos = getPos(over.id);

    const newArr = arrayMove(visualNovel, originalPos, newPos);
    setVisualNovel(newArr);
  };
  return (
    <div className="col-span-4 overflow-hidden flex flex-col h-screen py-8 gap-8">
      <ScrollArea className="flex-1">
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visualNovel}
            strategy={verticalListSortingStrategy}
          >
            {visualNovel.map((single) => {
              return (
                <MainCard
                  id={single.id}
                  slide={single}
                  data={single.dialogue}
                  key={single.id}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </ScrollArea>
      <ToolsSummary />
    </div>
  );
};

export default DialogueList;
