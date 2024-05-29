"use client";
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
    let data: DisplayArg[] = [];
    args.forEach((arg) => {
      if (arg.lineRef === key) {
        data.push({
          tax: arg.tax,
          type: arg.type,
          claimKey: arg.claimKey,
          text: arg.claimText,
        });
      }
      arg.chain.forEach((ch) => {
        if (ch.ground?.lineRef === key) {
          data.push({
            tax: ArgumentTaxEnum.GROUND,
            claimKey: arg.claimKey,
            text: ch.ground.text,
            connectorKey: ch.connectorKey,
          });
        }
        if (ch.warrant?.lineRef === key) {
          data.push({
            tax: ArgumentTaxEnum.WARRANT,
            claimKey: arg.claimKey,
            text: ch.warrant.text,
            connectorKey: ch.connectorKey,
          });
        }
      });
    });
    return data;
  }, [args, key]);
  return dialogue_arguments;
};

export default useDisplayArg;
