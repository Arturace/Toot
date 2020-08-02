import { ITootDisplay } from "../../src/TootDisplay"
import { expect } from "chai";
import { Tooter } from "../../src/Tooter";

export class TestTootDisplay implements ITootDisplay {
  public nextCallback: () => void;
  public previousCallback: () => void;
  public stopCallback: () => void;

  public setTitle = (title) => { };
  public setDescription = (desc) => { };
  public setNextCallback = (clbck) => this.nextCallback = clbck;
  public setPreviousCallback = (clbck) => this.previousCallback = clbck;
  public setStopCallback = (clbck) => this.stopCallback = clbck;
  public show = (stepIndex: number, tootLength: number) => new Promise<void>(res => res);
  public hide = (stepIndex: number, tootLength: number) => new Promise<void>(res => res);
}

export const Test_Key_NotGiven = (doThis: (tooter: Tooter) => void) =>
  it('throws if key not defined', () =>
    expect(() => doThis(new Tooter()))
      .to.throw(/Key must be defined/g));