"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { PreviewModal } from "./preview";

const ToolsSummary = () => {
  return (
    <div className="h-20 bg-white flex justify-between items-center px-4">
      <div className=""></div>
      <div className="flex gap-1 items-center justify-center">
        <PreviewModal />
        <Button size={"sm"}>Upload</Button>
        <Button size={"sm"}>Save</Button>
      </div>
    </div>
  );
};

export default ToolsSummary;
