"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation } from "@/types/vn-engine/main-types";

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
          <h3 className="font-bold">
            {data.speaker.name}{" "}
            <span className="font-normal">
              {data.altName !== "" && data.altName ? `as ${data.altName}` : ""}
            </span>
          </h3>
          <p className="text-xs">{data.line}</p>
        </div>
      </div>
      <div className=""></div>
    </>
  );
};

export default ConversationCard;
