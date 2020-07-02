export interface ITootDisplay {
  mainContainer: HTMLElement;
  titleContainer: HTMLElement;
  descriptionContainer: HTMLElement;
  nextBtn: HTMLElement;
  previousBtn: HTMLElement;
  show: () => Promise<void>;
  hide: () => Promise<void>;
}