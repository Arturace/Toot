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
  protected currentStepKeysIndex: number;
  protected currentStepKeys: Array<string>;
  show(tootKeys: Array<string>) {
    if (!tootKeys || tootKeys.length == 0) throw new Error();
    this.currentStepKeys = tootKeys;
    this.currentStepKeysIndex = 0;
    this.displayStep(this.toots[tootKeys[this.currentStepKeysIndex]]);
  }

  protected displayStep(step: TootStep) {
    this.currentStep = step;
    // Getting the ITootDisplay
    let display = this.displayGenerators[this.currentStep.displayGenerator](this.currentStep);

    // Updating the text
    display.descriptionContainer.innerHTML = this.currentStep.description;
    display.titleContainer.innerHTML = this.currentStep.title;

    display.previousBtn.onclick = () => this.continue(--this.currentStepKeysIndex, display);
    display.nextBtn.onclick = () => this.continue(++this.currentStepKeysIndex, display);

    if (this.currentStepKeysIndex + 1 < this.currentStepKeys.length)
      display.nextBtn.innerHTML = "Next";
    else
      display.nextBtn.innerHTML = "Done!";

    if (this.currentStepKeysIndex == 0)
      display.previousBtn.innerHTML = "Nevermind...";
    else
      display.previousBtn.innerHTML = "Previous";

    this.emphasizers[this.currentStep.emphasizer].emphasize.call(this.currentStep);
    display.show();
  }
  protected continue(nextTootX: number, previousDisplay: ITootDisplay) {
    Promise.all([
      this.emphasizers[this.currentStep.emphasizer].deemphasize.call(this.currentStep),
      previousDisplay.hide()])
      .then(() => {
        if (nextTootX < 0) {
          // We have cancelled the Toot
        } else if (nextTootX == this.currentStepKeys.length) {
          // We have completed the Toot
        } else {
          this.displayStep(this.toots[this.currentStepKeys[nextTootX]]);
        }
      })
  }
}