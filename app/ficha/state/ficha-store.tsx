"use client";
import React, { createContext, useContext, useState } from "react";
import { fichaState } from "./fichaState";

type FichaData = Record<string, string>;

interface FichaContextType {
  indice: number;
  data: FichaData;
  setField: (id: string, value: string) => void;
  next: () => void;
  previous: () => void;
  clear: () => void;
}

const FichaContext = createContext<FichaContextType | null>(null);

export function FichaProvider({ children }: { children: React.ReactNode }) {
  const [indice, setIndice] = useState(0);
  const [data, setData] = useState<FichaData>({});

  function setField(id: string, value: string) {
    setData((prev) => ({
      ...prev,
      [id]: value
    }));
  }

  function next() {
    setIndice((i) => i + 1);
  }

  function previous() {
    setIndice((i) => Math.max(0, i - 1));
  }

  function clear() {
    setData({});
    setIndice(0);
    fichaState.values = {};
    fichaState.indice = 0;
  }

  return (
    <FichaContext.Provider
      value={{ indice, data, setField, next, previous, clear }}
    >
      {children}
    </FichaContext.Provider>
  );
}

export function useFicha() {
  const ctx = useContext(FichaContext);
  if (!ctx) throw new Error("useFicha must be used inside FichaProvider");
  return ctx;
}
