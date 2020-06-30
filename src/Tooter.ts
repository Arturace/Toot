import { ITootEmphasizer } from "./TootEmphasizer.js";
import { TootStep } from "./TootStep.js";
import { ITootDisplay } from "./TootDisplay.js";

export class Tooter {
  public toots: Record<string, TootStep>;
  public emphasizers: Record<string, ITootEmphasizer>;
  public displayGenerators: Record<string, (step: TootStep) => ITootDisplay>;

  constructor(
    toots: Record<string, TootStep>
    , emphasizers: Record<string, ITootEmphasizer>
    , displayGenerators: Record<string, (step: TootStep) => ITootDisplay>
  ) {
    this.toots = toots ? toots : {};
    this.emphasizers = emphasizers ? emphasizers : {};
    this.displayGenerators = displayGenerators ? displayGenerators : {};
  }

  addEmphasizer(emphasizerKey: string, emphasizer: ITootEmphasizer) {
    if (!emphasizerKey) throw Error('emphasizerKey must be defined');
    this.emphasizers[emphasizerKey] = emphasizer;
  }

  addDisplayGenerator(displayGeneratorKey: string, displayGenerator: () => ITootDisplay) {
    if (!displayGeneratorKey) throw Error('emphasizerKey must be defined');
    this.displayGenerators[displayGeneratorKey] = displayGenerator;
  }

  addToot(tootKey: string, tootJson: string) {
    if (!tootKey) throw Error('tootKey must be defined');
    let toot = Object.assign(new TootStep, JSON.parse(tootJson));
    this.toots[tootKey] = toot;
    return toot;
  }

  protected currentStep: TootStep;
  protected currentStepKeys: Array<string>;
  show(tootKeys: Array<string>) {
    if (!tootKeys || tootKeys.length == 0) throw new Error();
    this.currentStepKeys = tootKeys;
    this.displayStep(0);
  }

  /**
   * Depens on currentStepKeys
   * @param step 
   * @param indexOfstep 
   */
  protected displayStep(indexOfstep: number) {
    let step = this.toots[this.currentStepKeys[indexOfstep]];
    let display = this.displayGenerators[step.displayGenerator](step);

    // Updating the text
    display.descriptionContainer.innerHTML = step.description;
    display.titleContainer.innerHTML = step.title;

    display.previousBtn.onclick = () => this.continue(indexOfstep - 1, step, display);
    display.nextBtn.onclick = () => this.continue(indexOfstep + 1, step, display);

    if (indexOfstep + 1 < this.currentStepKeys.length)
      display.nextBtn.innerHTML = "Next";
    else
      display.nextBtn.innerHTML = "Done!";

    if (indexOfstep == 0)
      display.previousBtn.innerHTML = "Nevermind...";
    else
      display.previousBtn.innerHTML = "Previous";

    this.emphasizers[step.emphasizer].emphasize.call(step);
    display.show();
  }
  /**
   * Depens on currentStepKeys
   * @param nextTootX 
   * @param previousDisplay 
   */
  protected continue(nextTootX: number, previousStep: TootStep, previousDisplay: ITootDisplay) {
    Promise.all([
      this.emphasizers[previousStep.emphasizer].deemphasize.call(previousStep)
      , previousDisplay.hide()])
      .then(() => {
        if (nextTootX < 0) {
          // We have cancelled the Toot
        } else if (nextTootX == this.currentStepKeys.length) {
          // We have completed the Toot
        } else {
          this.displayStep(nextTootX);
        }
      })
  }
}