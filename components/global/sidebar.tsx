"use client";
import React from "react";
import { Button } from "../ui/button";
import {
  CommandIcon,
  ImageDownIcon,
  SidebarIcon,
  User2,
  X,
} from "lucide-react";
import { TooltipButton } from "./tooltip-btn";
import { useSidebarContext } from "@/providers/sidebar";
import clsx from "clsx";
import { SidebarButtonsType } from "@/types";
import MoreCommands from "./sidebar-template/commands-template";
import MoreActiveCharacters from "../vn-engine/sidebars/character-template";
import MoreBackgrounds from "../vn-engine/sidebars/background-template";

const Sidebar = () => {
  const BTNS = [
    { icon: CommandIcon, tip: "Commands" },
    { icon: ImageDownIcon, tip: "Background" },
    { icon: User2, tip: "Characters" },
  ];

  const { active, setActive, toggleSidebar, setToggleSidebar } =
    useSidebarContext();

  return (
    <div className="h-screen border-r bg-white flex relative shadow-sm">
      <div className="w-16 border-r py-6 flex flex-col justify-start items-center gap-2">
        {BTNS.map((btn, index) => {
          const activeClassName = clsx(
            "transition-colors",
            active.toLocaleLowerCase() === btn.tip.toLocaleLowerCase()
              ? "bg-main-100 text-main-400 hover:bg-main-100 hover:text-main-400"
              : ""
          );
          return (
            <TooltipButton key={index} tip={btn.tip}>
              <Button
                variant={"outline"}
                size={"icon"}
                className={activeClassName}
                onClick={() => setActive(btn.tip as SidebarButtonsType)}
              >
                <btn.icon />
              </Button>
            </TooltipButton>
          );
        })}
      </div>
      {toggleSidebar ? (
        <div className="w-[20rem] py-6 px-4 relative">
          <Button
            className="absolute top-2 right-2"
            variant={"ghost"}
            size={"icon"}
            onClick={() => setToggleSidebar(false)}
          >
            <X />
          </Button>
          {active === "Characters" ? (
            <MoreActiveCharacters />
          ) : active === "Background" ? (
            <MoreBackgrounds />
          ) : (
            <MoreCommands />
          )}
        </div>
      ) : (
        <button
          onClick={() => setToggleSidebar(true)}
          type="button"
          className="absolute top-4 left-full w-6 h-12 bg-main-50 z-10 rounded-e-full hover:bg-main-200 transition-colors p-1 flex justify-center items-center"
        >
          <SidebarIcon className="w-full h-full" />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
