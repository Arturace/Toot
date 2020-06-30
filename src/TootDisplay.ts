export interface ITootDisplay {
  mainContainer: HTMLElement;
  titleContainer: HTMLElement;
  descriptionContainer: HTMLElement;
  nextBtn: HTMLElement;
  previousBtn: HTMLElement;
  show: () => void | Promise<void>;
  hide: () => void | Promise<void>;
}