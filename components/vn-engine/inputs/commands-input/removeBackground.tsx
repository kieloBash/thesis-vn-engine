"use client";
import { Button } from "@/components/ui/button";

import React, { FormEvent } from "react";

import { useBuilderContext } from "@/providers/builder";

const RemoveBackgroundInput = () => {
  const { selectedCommand, setSelectedCommand, visualNovel, setVisualNovel } =
    useBuilderContext();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedCommand) return;

    const selectedIdx = visualNovel.findIndex(
      (d) => d.id === selectedCommand.id
    );
    if (selectedIdx === -1) return;

    let newSlides = [...visualNovel];
    newSlides.splice(selectedIdx, 1);
    setVisualNovel(newSlides);
    setSelectedCommand(undefined);
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-screen flex flex-col gap-4 relative"
    >
      {/* HEADER */}
      <div className="absolute top-0 z-10 bg-white h-14 border-b w-full flex justify-between items-center p-4">
        <h3 className="font-medium text-lg">Remove Background</h3>
        <div className="flex gap-2"></div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 z-10 bg-white h-14 border-t w-full flex justify-between items-center p-4">
        <h3 className="font-bold text-xs"></h3>
        <div className="flex gap-2">
          <Button type="submit" size={"sm"}>
            Remove Command
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RemoveBackgroundInput;
