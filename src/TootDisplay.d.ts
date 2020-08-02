import { TootStep } from "./TootStep";

/** Responsable for displaying TootStep information & interactivity */
export interface ITootDisplay {
  /** Sets the title of a TootStep */
  setTitle(title: string): void;
  /** Passes the description of a TootStep */
  setDescription(desc: string): void;
  /** Set the callback that will continue the turoial */
  setNextCallback(callback: () => void);
  /** Set the callback that will go back 1 step of the turoial */
  setPreviousCallback(callback: () => void);
  /** Set the callback that will go stop the turoial */
  setStopCallback(callback: () => void);
  /** WIll show the data & interactive elements of a TootStep */
  show: (stepIndex: number, tootLength: number) => Promise<void>;
  /** WIll hide the data & interactive elements of a TootStep */
  hide: (stepIndex: number, tootLength: number) => Promise<void>;
}

/** Generates a ITootDisplay instance, for a given TootStep */
export interface ITootDisplayGenerator {
  (step: TootStep): ITootDisplay;
}