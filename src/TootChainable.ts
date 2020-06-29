import { TootEmphasizer } from "./TootEmphasizer";

export class TootChainable {
  public selector: string;
  /** Cached target element */
  private element: HTMLElement;
  public title: string;
  public description: string;
  public emphasizer: TootEmphasizer;
  public previous: TootChainable;
  public next: TootChainable;
  
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
  setPrevious(toot: TootChainable): this {
    this.previous = toot;
    return this;
  }
  setNext(toot: TootChainable): this {
    this.next = toot;
    return this;
  }
  setEmphasizer(emphasizer: TootEmphasizer): this {
    this.emphasizer = emphasizer;
    return this;
  }
  //#endregion
  
  public getElement() {
    if (!this.element) {
      this.element = document.querySelector(this.selector);
      if (!this.element) throw Error('No element found with selector');
    }
    return this.element;
  }

  public emphasizerElement: HTMLElement;
  show(): void {
    this.emphasizerElement = this.emphasizer.emphasize(this.getElement());
  }
  hide(): void {
    let prom = this.emphasizer.deemphasize(this.getElement(), this.emphasizerElement);
    this.emphasizerElement = undefined;
    if (prom)
      prom.then(() => this.next?.show())
  }
}