import { TootStep } from "./TootStep";
export interface ITootEmphasizer {
  emphasize: (step: TootStep) => Promise<void>;
  deemphasize: (step: TootStep) => Promise<void>;
}