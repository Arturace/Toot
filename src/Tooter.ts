import { ITootEmphasizer } from "./TootEmphasizer.js";
import { TootStep } from "./TootStep.js";
import { ITootDisplay } from "./TootDisplay.js";

export class Tooter {
  public toots: Record<string, TootStep>;
  public emphasizers: Record<string, ITootEmphasizer>;
  public displayGenerators: Record<string, () => ITootDisplay>;

  constructor(
    toots: Record<string, TootStep>
    , emphasizers: Record<string, ITootEmphasizer>
    , displayGenerators: Record<string, () => ITootDisplay>
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
  protected currentStepKey: string;
  protected currentStepKeysIndex: number;
  protected currentStepKeys: Array<string>;
  show(tootKeys: Array<string>) {
    if (!tootKeys || tootKeys.length == 0) throw new Error();
    this.currentStepKeys = tootKeys;
    this.currentStepKeysIndex = 0;
    this.currentStepKey = tootKeys[0];
    this.currentStep = this.toots[tootKeys[this.currentStepKeysIndex]];
    this.emphasizers[this.currentStep.emphasizer].emphasize.call(this.currentStep);

    this.displayStep();
  }

  protected cachedDisplays: Record<string, ITootDisplay> = {};
  protected displayByIndex(nextTootX: number, previousDisplay: ITootDisplay) {
    let promise = this.emphasizers[this.currentStep.emphasizer]
      .deemphasize.call(this.currentStep);
    if (promise)
      promise.then(() => {
        if (nextTootX < 0) {
          // We have cancelled the Toot
        } else if (nextTootX == this.currentStepKeys.length) {
          // We have completed the Toot
        } else {
          this.currentStepKey = this.currentStepKeys[nextTootX];
          this.currentStep = this.toots[this.currentStepKeys[nextTootX]];
          this.emphasizers[this.currentStep.emphasizer].emphasize.call(this.currentStep);
    
          document.body.removeChild(previousDisplay.mainContainer);
          this.displayStep();
        }
      })
  }
  protected displayStep() {
    // Getting the ITootDisplay
    let display = this.cachedDisplays[this.currentStep.displayGenerator];
    if (!display) {
      display = this.displayGenerators[this.currentStep.displayGenerator]();
      if (!display) throw new Error(`Display Generator ${this.currentStep.displayGenerator} returned nothing`);
      this.cachedDisplays[this.currentStep.displayGenerator] = display;
    }

    // Updating the text
    display.descriptionContainer.innerHTML = this.currentStep.description;
    display.titleContainer.innerHTML = this.currentStep.title;

    display.previousBtn.onclick = () => this.displayByIndex(--this.currentStepKeysIndex, display);
    display.nextBtn.onclick = () => this.displayByIndex(++this.currentStepKeysIndex, display);

    if (this.currentStepKeysIndex + 1 < this.currentStepKeys.length)
      display.nextBtn.innerHTML = "Next";
    else
      display.nextBtn.innerHTML = "Done!";

    if (this.currentStepKeysIndex == 0)
      display.previousBtn.innerHTML = "Nevermind...";
    else
      display.previousBtn.innerHTML = "Previous";


    document.body.appendChild(display.mainContainer);
  }
}