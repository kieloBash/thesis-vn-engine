"use client";
import { useStoryContext } from "@/providers/story";
import React from "react";

import NewDialogue from "./new-dialogue";
import ActiveDialogue from "./active-dialogue";

const Dialogue = () => {
  const { toggleModify, selectedIndex, selectedLine } = useStoryContext();

  if (toggleModify && selectedIndex >= 0 && selectedLine)
    return <ActiveDialogue />;
  else return <NewDialogue />;
};

export default Dialogue;
