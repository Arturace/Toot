import { TootStep } from "./TootStep";

/**
 * Responsable for emphasizing and deemphasizing what is sneeded for a given TootStep
 */
export interface ITootEmphasizer {
  /** Emphasize a TootStep */
  emphasize: (step: TootStep) => Promise<void>;
  /** Deemphasize a TootStep */
  deemphasize: (step: TootStep) => Promise<void>;
}