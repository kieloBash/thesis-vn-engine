"use client";
import { useStoryContext } from "@/providers/story";
import React from "react";

import NewDialogue from "./dialogue/new";
import ActiveDialogue from "./dialogue/active";

const Dialogue = () => {
  const { toggleModify, selectedIndex, selectedLine } = useStoryContext();

  if (toggleModify && selectedIndex && selectedLine)
    return <ActiveDialogue />;
  else return <NewDialogue />;
};

export default Dialogue;
