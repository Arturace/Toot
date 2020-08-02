import { ITootEmphasizer } from "./TootEmphasizer";
import { TootStep } from "./TootStep";
import { ITootDisplay, ITootDisplayGenerator } from "./TootDisplay";

export class Tooter {
  /** Global callback for any completed tutorial */
  public tootCompletedCallback: () => void = null;
  /** Global callback for any canceled tutorial */
  public tootCanceledCallback: () => void = null;

  constructor(
    public toots: Record<string, TootStep> = {}
    , public emphasizers: Record<string, ITootEmphasizer> = {}
    , public displayGenerators: Record<string, ITootDisplayGenerator> = {}
  ) { }

  addDisplayGenerator(
    displayGeneratorKey: string,
    displayGenerator: ITootDisplayGenerator) {
    if (!displayGeneratorKey) throw Error('emphasizerKey must be defined');
    this.displayGenerators[displayGeneratorKey] = displayGenerator;
  }

  addEmphasizer(emphasizerKey: string, emphasizer: ITootEmphasizer) {
    if (!emphasizerKey) throw Error('emphasizerKey must be defined');
    this.emphasizers[emphasizerKey] = emphasizer;
  }

  addTootStep(tootKey: string, tootJson: string) {
    if (!tootKey) throw Error('tootKey must be defined');
    let toot: TootStep = Object.assign(new TootStep, JSON.parse(tootJson));

    if (!toot.emphasizer) throw new Error('Tootstep did not contain an emphasizer');
    if (!toot.displayGenerator) throw new Error('Tootstep did not contain a displayGenerator');

    this.toots[tootKey] = toot;
    return toot;
  }

  protected currentStepKeys: Array<string>;
  show(tootKeys: Array<string>) {
    if (!tootKeys || tootKeys.length == 0) throw new Error();
    this.currentStepKeys = tootKeys;
    return this.displayStep(0);
  }

  /**
   * Depens on currentStepKeys
   * @param step 
   * @param indexOfStep 
   */
  protected displayStep(indexOfStep: number) {
    let step = this.toots[this.currentStepKeys[indexOfStep]];
    let display = this.displayGenerators[step.displayGenerator](step);

    // Updating the text
    display.setDescription(step.description);
    display.setTitle(step.title);

    display.setNextCallback(() =>
      this.continue(indexOfStep + 1, indexOfStep, step, display));
    display.setPreviousCallback(() =>
      this.continue(indexOfStep - 1, indexOfStep, step, display));
    display.setStopCallback(() =>
      this.continue(-1, indexOfStep, step, display));

    this.emphasizers[step.emphasizer].emphasize.call(step);
    return display.show(indexOfStep, this.currentStepKeys.length);
  }
  /**
   * Depens on currentStepKeys
   * @param nextTootX 
   * @param previousDisplay 
   */
  protected continue(
    nextTootX: number
    , previousStepX:number
    , previousStep: TootStep
    , previousDisplay: ITootDisplay) {
    return Promise.all([
      this.emphasizers[previousStep.emphasizer].deemphasize.call(previousStep)
      , previousDisplay.hide(previousStepX, this.currentStepKeys.length)
    ])
      .then(() => {
        if (nextTootX < 0) {
          if (this.tootCanceledCallback) this.tootCanceledCallback();
        } else if (nextTootX == this.currentStepKeys.length) {
          if (this.tootCompletedCallback) this.tootCompletedCallback();
        } else {
          console.log('continue displayStep nextTootX: ' + nextTootX);
          this.displayStep(nextTootX);
        }
      })
  }
}