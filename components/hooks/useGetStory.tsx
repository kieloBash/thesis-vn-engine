"use client";
import { useStoryContext } from "@/providers/story";
import React from "react";

const useGetStory = () => {
  const { story } = useStoryContext();

  const data = story.map((dl, idx) => {
    const speakerName = dl.speaker?.name.split(" ")[0];
    const speakerDialogue = dl.dialogue;

    let textToDisplay = `${speakerName} "${speakerDialogue}"`;
    console.log(textToDisplay);
    return textToDisplay;
  });
  return data.join("\n");
};

export default useGetStory;
