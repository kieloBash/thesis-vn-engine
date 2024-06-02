"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddBackground } from "@/types/vn-engine/command-types";
import clsx from "clsx";

const AddBackgroundCommandCard = ({ data }: { data: AddBackground }) => {
  const blank = !data.background || !data?.timer || !data?.transition;
  const mainClassName = clsx(
    "w-full h-full absolute top-0 left-0 flex px-4 rounded-md",
    blank ? "bg-red-100 border border-black shadow-sm" : "bg-blue-50"
  );
  return (
    <>
      <div className={mainClassName}>
        <div className="flex gap-2 justify-center items-center font-mono">
          <p className="text-xs">Add</p>
          <p className="text-xs bg-slate-200 px-2 py-1 rounded-md flex gap-1 justify-center items-center">
            <span className="">
              {data.background?.name ? data.background?.name : "unknown"}{" "}
            </span>
            {data.background ? (
              <>
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={data.background?.image?.src}
                    alt="BG"
                    className="object-cover object-top bg-slate-100 border"
                  />
                  <AvatarFallback>BG</AvatarFallback>
                </Avatar>
              </>
            ) : null}
          </p>
          <p className="text-xs">Background for</p>
          <p className="text-xs bg-slate-200 px-2 py-1 rounded-md flex gap-1 justify-center items-center">
            <span className="">
              {data?.timer && data.timer > 0 ? `${data.timer}s` : "unknown"}
            </span>
          </p>
          <p className="text-xs bg-slate-200 px-2 py-1 rounded-md flex gap-1 justify-center items-center">
            <span className="">
              {data?.transition ? data.transition : "unknown"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default AddBackgroundCommandCard;
