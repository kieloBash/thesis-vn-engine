"use client";
import { useStoryContext } from "@/providers/story";
import React, { FormEvent, useState, KeyboardEvent } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Command, StoryLine } from "@/types";

const Dialogue = () => {
  const { speaker, setStory, story } = useStoryContext();
  const [dialogue, setDialogue] = useState("");
  const [commands, setCommands] = useState<Command[]>([]);

  function AddToStory() {
    if (!speaker) return null;

    const newStoryLine: StoryLine = {
      speaker,
      dialogue,
      commands,
    };

    setStory([...story, newStoryLine]);
    setDialogue("");
  }

  function handleSubmitStoryLine(e: FormEvent) {
    e.preventDefault();
    AddToStory();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      if (speaker && dialogue !== "") {
        event.preventDefault();
        handleSubmitStoryLine(
          new Event("submit", {
            cancelable: true,
            bubbles: true,
          }) as unknown as FormEvent
        );
      }
    }
  }

  return (
    <div className="col-span-3 flex flex-col h-full py-6">
      <form
        onSubmit={handleSubmitStoryLine}
        className="w-full h-full border rounded-lg bg-white flex flex-col"
      >
        <div className="w-full h-16 border-b items-center flex px-6">
          <h3 className="">
            Speaker:{" "}
            {!speaker ? (
              <span className="py-1 px-2 bg-slate-100 font-bold rounded-full text-sm">
                Add Speaker
              </span>
            ) : (
              <>
                <span className="py-1 px-2 rounded-full bg-main-100 font-bold text-main-500">
                  {speaker.name}
                </span>
              </>
            )}
          </h3>
        </div>
        <div className="flex-1 p-6">
          <Textarea
            value={dialogue}
            onChange={(e) => setDialogue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter dialogue here..."
            className="w-full text-sm h-full resize-none"
          />
        </div>
        <div className="w-full h-16 border-t flex justify-end items-center px-6">
          <Button
            type="submit"
            disabled={dialogue === "" || speaker === undefined}
            size={"sm"}
          >
            Add Dialogue Line
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Dialogue;
