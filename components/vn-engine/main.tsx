import React from "react";
import DialogueList from "./displays/dialogue-list";
import MainInputs from "./inputs/main";

const MainStoryBuilder = () => {
  return (
    <main className="pl-4 grid grid-cols-7 gap-4 w-full">
      <DialogueList />
      <MainInputs />
    </main>
  );
};

export default MainStoryBuilder;
