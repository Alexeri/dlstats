"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useHotkeys } from "react-hotkeys-hook";

interface DialogContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useHotkeys(
    "ctrl+k, cmd+k",
    (e) => {
      e.preventDefault();
      open();
    },
    { enableOnFormTags: true },
    []
  );

  return (
    <DialogContext.Provider value={{ isOpen, open, close }}>
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within DialogProvider");
  return ctx;
}
