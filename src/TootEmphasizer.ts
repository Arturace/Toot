import { TootStep } from "./TootStep";
export interface ITootEmphasizer {
  emphasize: (step: TootStep) => HTMLElement;
  deemphasize: (step: TootStep) => void | Promise<void>;
}