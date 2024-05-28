"use client";
import { Dialogue } from "@/types";
import { ArgumentTaxEnum, DisplayArg, FullArgument } from "@/types/new-types";
import { useMemo } from "react";

const useDisplayArg = ({
  story,
  args,
  variant = "Blank",
  idx,
}: {
  story: Dialogue[];
  args: FullArgument[];
  variant?: "Blank" | "Active";
  idx?: number;
}) => {
  const dialogue_arguments = useMemo(() => {
    let data: DisplayArg[] = [];
    if (variant === "Blank") {
      args.forEach((arg) => {
        if (arg.lineRef === story.length) {
          data.push({
            tax: arg.tax,
            type: arg.type,
            claimKey: arg.claimKey,
            text: arg.claimText,
          });
        }
        arg.chain.forEach((ch) => {
          if (ch.ground?.lineRef === story.length) {
            data.push({
              tax: ArgumentTaxEnum.GROUND,
              claimKey: arg.claimKey,
              text: ch.ground.text,
              connectorKey: ch.connectorKey,
            });
          }
          if (ch.warrant?.lineRef === story.length) {
            data.push({
              tax: ArgumentTaxEnum.WARRANT,
              claimKey: arg.claimKey,
              text: ch.warrant.text,
              connectorKey: ch.connectorKey,
            });
          }
        });
      });
    } else if (idx !== undefined && variant === "Active") {
      if (idx >= 0) {
        args.forEach((arg) => {
          if (arg.lineRef === idx) {
            data.push({
              tax: arg.tax,
              type: arg.type,
              claimKey: arg.claimKey,
              text: arg.claimText,
            });
          }
          arg.chain.forEach((ch) => {
            if (ch.ground?.lineRef === idx) {
              data.push({
                tax: ArgumentTaxEnum.GROUND,
                claimKey: arg.claimKey,
                text: ch.ground.text,
                connectorKey: ch.connectorKey,
              });
            }
            if (ch.warrant?.lineRef === idx) {
              data.push({
                tax: ArgumentTaxEnum.WARRANT,
                claimKey: arg.claimKey,
                text: ch.warrant.text,
                connectorKey: ch.connectorKey,
              });
            }
          });
        });
      }
    }
    return data;
  }, [story.length, args, idx, variant]);
  return dialogue_arguments;
};

export default useDisplayArg;
