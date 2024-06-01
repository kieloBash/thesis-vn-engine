"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddBackground } from "@/types/vn-engine/command-types";

const AddBackgroundCommandCard = ({ data }: { data: AddBackground }) => {
  return (
    <>
      <div className="flex gap-2 justify-start items-center">
        <Avatar>
          <AvatarImage
            src={data.background?.image?.src}
            alt="BG"
            className="object-cover object-top bg-main-100 border"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex gap-2">
          <span className="">Add Background Scene:</span>
          <h3 className="font-bold">{data.background?.name}</h3>
        </div>
      </div>
    </>
  );
};

export default AddBackgroundCommandCard;
