"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SlidesCarousel } from "./components/list";
import { useBuilderContext } from "@/providers/builder";

export function PreviewModal() {
  const { visualNovel } = useBuilderContext();
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size={"sm"}>Preview</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full px-10 pb-4 max-w-screen-xl">
          <DrawerHeader>
            <DrawerTitle className="text-center">
              Visual Novel Preview
            </DrawerTitle>
          </DrawerHeader>

          {visualNovel.length > 0 ? (
            <>
              <SlidesCarousel slides={visualNovel} />
            </>
          ) : (
            <div className="py-20 text-center font-bold text-4xl">
              Nothing to preview yet!
            </div>
          )}

          {/* <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
