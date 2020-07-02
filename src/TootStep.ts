export class TootStep {
  public selector: string;
  /** Cached target element */
  private element: HTMLElement;
  public title: string;
  public description: string;
  public emphasizer: string;
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
  
  public static getElement(tootStep: TootStep) {
    if (!tootStep.element) {
      tootStep.element = document.querySelector(tootStep.selector);
      if (!tootStep.element) throw Error('No element found with selector');
    }
    return tootStep.element;
  }

}