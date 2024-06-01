"use client";
import { SidebarButtonsType } from "@/types";
import * as React from "react";

type SidebarContextType = {
  toggleSidebar: boolean;
  setToggleSidebar: (temp: boolean) => void;

  active: SidebarButtonsType;
  setActive: (temp: SidebarButtonsType) => void;
};

const SidebarContext = React.createContext<SidebarContextType>({
  toggleSidebar: true,
  setToggleSidebar: (temp: boolean) => {},

  active: "Characters",
  setActive: (temp: SidebarButtonsType) => {},
});

export const useSidebarContext = () => React.useContext(SidebarContext);

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [toggleSidebar, setToggleSidebar] = React.useState<boolean>(true);
  const [active, setActive] = React.useState<SidebarButtonsType>("Commands");

  return (
    <SidebarContext.Provider
      value={{
        toggleSidebar,
        setToggleSidebar,
        active,
        setActive,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
