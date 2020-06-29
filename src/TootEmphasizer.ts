export interface TootEmphasizer {
  emphasize: (element: HTMLElement) => HTMLElement;
  deemphasize: (element: HTMLElement, emphResult: HTMLElement) => void | Promise<void>;
}