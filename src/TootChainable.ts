export interface emphasizerCallback {
  (element: HTMLElement): HTMLElement;
}

export interface deemphasizerCallback {
  (element: HTMLElement): void;
}

export class TootChainable {
  public selector: string;
  /** Cached target element */
  private element: HTMLElement;
  public title: string;
  public description: string;
  public previous: TootChainable;
  public next: TootChainable;
  public emphasizer: emphasizerCallback;
  public deemphasizer: deemphasizerCallback;
  
  //#region Setters
  setSelector(selector: string): TootChainable {
    this.selector = selector;
    return this;
  }
  setTitle(title: string): TootChainable {
    this.title = title;
    return this;
  }
  setDescription(desc: string): TootChainable {
    this.description = desc;
    return this;
  }
  setPrevious(toot: TootChainable): TootChainable {
    this.previous = toot;
    return this;
  }
  setNext(toot: TootChainable): TootChainable {
    this.next = toot;
    return this;
  }
  setEmphasizer(emphasizer: emphasizerCallback): TootChainable {
    this.emphasizer = emphasizer;
    return this;
  }
  setDeemphasizer(deemphasizer: deemphasizerCallback): TootChainable {
    this.deemphasizer = deemphasizer;
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

  private emphasizerElement: HTMLElement;
  show() {
    this.emphasizerElement = this.emphasizer(this.getElement());
  }
  hide() {
    this.deemphasizer(this.emphasizerElement);
    this.emphasizerElement = undefined;
  }
}