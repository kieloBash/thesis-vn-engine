"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { PreviewModal } from "./preview";
import { useBuilderContext } from "@/providers/builder";

const ToolsSummary = () => {
  const { toggleEdits, setToggleEdits } = useBuilderContext();
  return (
    <div className="h-20 bg-white flex justify-between items-center px-4">
      {toggleEdits ? (
        <>
          <div className="font-mono">Editting...</div>
          <div className="flex gap-1 items-center justify-center">
            <Button
              size={"sm"}
              variant={"destructive"}
              onClick={() => {
                setToggleEdits(false);
              }}
            >
              Done Edit
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className=""></div>
          <div className="flex gap-1 items-center justify-center">
            <Button
              size={"sm"}
              onClick={() => {
                setToggleEdits(true);
              }}
            >
              Edit
            </Button>
            <PreviewModal />
            <Button size={"sm"}>Upload</Button>
            <Button size={"sm"}>Save</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ToolsSummary;
