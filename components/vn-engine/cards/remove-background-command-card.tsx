import { RemoveBackground } from "@/types/vn-engine/command-types";
import React from "react";

const RemoveBackgroundCommandCard = ({
  data,
  id,
}: {
  data: RemoveBackground;
  id: string;
}) => {
  return (
    <>
      <div className="flex gap-2 justify-start items-center absolute w-full bg-red-200 h-full left-0 top-0">
        <button
          className="w-full h-full border-2 border-black rounded-md p-0 flex flex-col justify-center items-center"
          type="button"
        >
          <p className="w-full text-center font-mono text-sm">
            Removed Active Background
          </p>
        </button>
      </div>
    </>
  );
};

export default RemoveBackgroundCommandCard;
