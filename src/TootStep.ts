/**
 * A tutorial step
 */
export class TootStep {
  /** A selector for the target element */
  public selector: string;
  /** Cached target element */
  private element: HTMLElement;
  /** Title to display */
  public title: string;
  /** Description to display */
  public description: string;
  /** Emphasizer for the step */
  public emphasizer: string;
  /** Display generator for the step */
  public displayGenerator: string;
  /** Element set by an emphasizer */
  public emphasizerElement: HTMLElement;
  
  //#region Setters
  setSelector(selector: string): this {
    this.selector = selector;
    return this;
  }
  setTitle(title: string): this {
    this.title = title;
    return this;
  }
  setDescription(desc: string): this {
    this.description = desc;
    return this;
  }

  setEmphasizer(emphasizer: string): this {
    this.emphasizer = emphasizer;
    return this;
  }

  setDisplayGenerator(displayGenerator: string): this {
    this.displayGenerator = displayGenerator;
    return this;
  }
  //#endregion
  
  /**
   * Will get (cached or not) element from a TootStep
   * @param tootStep ToolStep to get or store the cached element
   */
  public static getElement(tootStep: TootStep) {
    if (!tootStep.element) {
      tootStep.element = document.querySelector(tootStep.selector);
      if (!tootStep.element) throw Error('No element found with selector');
    }
    return tootStep.element;
  }

}