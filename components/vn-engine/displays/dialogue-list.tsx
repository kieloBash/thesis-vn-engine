"use client";
import { useBuilderContext } from "@/providers/builder";
import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import ToolsSummary from "../tools-summary/summary";

import { closestCorners, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import MainCard from "../cards/main-card";
import {
  Command,
  isCommand,
  isRemoveBackgroundCommand,
} from "@/types/vn-engine/command-types";
import { Dialogue } from "@/types/vn-engine/main-types";

const DialogueList = () => {
  const { visualNovel, setVisualNovel, setSelectedCommand, toggleEdits } =
    useBuilderContext();

  const getPos = (id: string) => visualNovel.findIndex((d) => d.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id === over.id) return;

    const originalPos = getPos(active.id);
    const newPos = getPos(over.id);

    const newArr = arrayMove(visualNovel, originalPos, newPos);
    setVisualNovel(newArr);
  };

  function handleClickCommand(data: Dialogue, id: string) {
    if (!isCommand(data)) return;

    if (isRemoveBackgroundCommand(data)) {
      setSelectedCommand({ command: data.type, id });
    }
  }
  return (
    <div className="col-span-4 overflow-hidden flex flex-col h-screen py-8 gap-8">
      <ScrollArea className="flex-1 px-4">
        {toggleEdits ? (
          <>
            {visualNovel.map((single) => {
              if (isCommand(single.dialogue) && single.dialogue.blank) {
                return (
                  <div
                    className="w-full h-8 rounded-sm shadow-sm transition-colors bg-white mt-2 hover:bg-slate-100 peer"
                    key={single.id}
                  >
                    <button
                      className="w-full h-full p-0 flex flex-col justify-center items-center"
                      type="button"
                      onClick={() => {
                        handleClickCommand(single.dialogue, single.id);
                      }}
                    >
                      <p className="w-full text-center font-mono">
                        Press to add Command
                      </p>
                    </button>
                  </div>
                );
              } else
                return (
                  <MainCard
                    id={single.id}
                    slide={single}
                    data={single.dialogue}
                    key={single.id}
                  />
                );
            })}
          </>
        ) : (
          <>
            <DndContext
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={visualNovel}
                strategy={verticalListSortingStrategy}
              >
                {visualNovel.map((single) => {
                  if (isCommand(single.dialogue) && single.dialogue.blank) {
                    return (
                      <div
                        className="w-full h-8 rounded-sm shadow-sm transition-colors bg-white mt-2 hover:bg-slate-100 peer"
                        key={single.id}
                      >
                        <button
                          className="w-full h-full p-0 flex flex-col justify-center items-center"
                          type="button"
                          onClick={() => {
                            handleClickCommand(single.dialogue, single.id);
                          }}
                        >
                          <p className="w-full text-center font-mono">
                            Press to add Command
                          </p>
                        </button>
                      </div>
                    );
                  } else
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
          </>
        )}
      </ScrollArea>
      <ToolsSummary />
    </div>
  );
};

export default DialogueList;
