import { TootStep } from "./TootStep";

export interface ITootDisplay {
  setTitle(title: string): void;
  setDescription(desc: string): void;
  setNextCallback(callback: () => void);
  setPreviousCallback(callback: () => void);
  setStopCallback(callback: () => void);
  show: (stepIndex: number, tootLength: number) => Promise<void>;
  hide: (stepIndex: number, tootLength: number) => Promise<void>;
}

export interface ITootDisplayGenerator {
  (step: TootStep): ITootDisplay;
}