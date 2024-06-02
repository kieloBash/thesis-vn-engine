"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation } from "@/types/vn-engine/main-types";
import { EyeOff } from "lucide-react";

const ConversationCard = ({ data }: { data: Conversation }) => {
  return (
    <>
      <div className="flex gap-4 justify-start items-center">
        <Avatar>
          <AvatarImage
            src={data.speaker?.image?.src}
            alt="Pic"
            className="object-cover object-top bg-main-100 border"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="font-bold flex gap-1 justify-start items-center">
            <span className="">{data.speaker.name}</span>
            <span className="font-normal">
              {data.altName !== "" && data.altName ? `as ${data.altName}` : ""}
            </span>
            {data.isHidden && <EyeOff className="w-4 h-4" />}
          </div>
          <p className="text-xs">{data.line}</p>
        </div>
      </div>
      <div className=""></div>
    </>
  );
};

export default ConversationCard;
