"use client";
import { getDisplayArgs } from "@/helpers";
import { ArgumentTaxEnum, DisplayArg, FullArgument } from "@/types/new-types";
import { useMemo } from "react";

const useDisplayArg = ({
  args,
  key,
}: {
  args: FullArgument[];
  key: string;
}) => {
  const dialogue_arguments = useMemo(() => {
    let data: DisplayArg[] = getDisplayArgs({ args, key });
    return data;
  }, [args, key]);
  return dialogue_arguments;
};

export default useDisplayArg;
