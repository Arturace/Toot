import { TootEmphasizer } from "./TootEmphasizer.js";
import { TootChainable } from "./TootChainable.js";

export class Tooter {
  public toots: Record<string, TootChainable>;
  public emphasizers: Record<string, TootEmphasizer>;

  constructor(
    toots: Record<string, TootChainable>
    , emphasizers: Record<string, TootEmphasizer>
    ) {
    this.toots = toots ? toots : {};
    this.emphasizers = emphasizers ? emphasizers : {};
  }

  show(tootKey: string) {
    this.toots[tootKey].show();
  }
  hide(tootKey: string) {
    this.toots[tootKey].hide();
  }

  newToot(tootKey: string) {
    if (!tootKey) throw Error('tootKey must be defined');
    let toot = new TootChainable();
    this.toots[tootKey] = toot;
    return toot;
  }

  setNext(tootKey: string, nextTootKey: string) {
    this.toots[tootKey].next = this.toots[nextTootKey];
  }

  setPrevious(tootKey: string, previousTootKey: string) {
    this.toots[tootKey].previous = this.toots[previousTootKey];
  }
}