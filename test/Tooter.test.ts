/// <reference path="../src/Tooter.ts" />

import { expect } from 'chai';
import { nameof } from 'ts-simple-nameof';

import { Tooter } from '../dist/Tooter.js';
import { TootStep } from '../dist/TootStep.js';
import { ITootDisplay, ITootDisplayGenerator } from '../src/TootDisplay';
import { ITootEmphasizer } from '../src/TootEmphasizer';
import { TestTootDisplay, Test_Key_NotGiven as Test_Throws_Key_NotGiven } from './Tooter.test-utils';

const constructorArgs = [
  { name: 'toots', value: {} },
  { name: 'emphasizers', value: {} },
  { name: 'displayGenerators', value: {} },
];

describe('constructor', () => {
  context('parameterless', () => {
    for (let arg of constructorArgs)
      it(`${arg.name} is an empty object`, () => {
        const tooter = new Tooter(void 0, void 0, void 0);
        expect(tooter[arg.name]).to.be.deep.equal({});
      });
  })
  context('w/ paraemters', () => {
    const tooter = new Tooter(
      constructorArgs[0].value,
      constructorArgs[1].value,
      constructorArgs[2].value
    );

    for (let arg of constructorArgs)
      it(`${arg.name} keeps given value`, () => {
        expect(tooter[arg.name]).to.be.equal(arg.value);
      });
  });
});

describe('add functions', () => {
  context('addDisplayGenerator', () => {
    Test_Throws_Key_NotGiven((tooter) => {
      tooter.addDisplayGenerator(undefined, null);
    });

    it('should work', () => {
      const tooter = new Tooter();
      const key = 'someKey';
      const someTootDisplay = new TestTootDisplay();
      const displayGenerator: ITootDisplayGenerator = () => someTootDisplay;
  
      tooter.addDisplayGenerator(key, displayGenerator);
  
      expect(tooter.displayGenerators).to.have.property(key, displayGenerator);
    });
  });

  context('addEmphasizer', () => {
    Test_Throws_Key_NotGiven((tooter) => {
      tooter.addEmphasizer(undefined, null);
    });

    it('should work', () => {
      const tooter = new Tooter();
      const key = 'someKey';
      const someEphasizer: ITootEmphasizer = {
        emphasize: () => new Promise(res => res)
        , deemphasize: () => new Promise(res => res)
      };
  
      tooter.addEmphasizer(key, someEphasizer);
  
      expect(tooter.emphasizers).to.have.property(key, someEphasizer);
    });
  });

  context('addToot', () => {
    Test_Throws_Key_NotGiven((tooter) => {
      tooter.addTootStep(undefined, null);
    });

    it('throws if emphasizer is not defined', () => {
      const tooter = new Tooter();
      const key = 'someKey';
      const someTootStep: TootStep = new TootStep()
        .setDisplayGenerator('abs');

      expect(() => tooter.addTootStep(key, JSON.stringify(someTootStep)))
        .to.throw(/did not contain/g);
    });

    it('throws if display generator is not defined', () => {
      const tooter = new Tooter();
      const key = 'someKey';
      const someTootStep: TootStep = new TootStep()
        .setEmphasizer('abs');

      expect(() => tooter.addTootStep(key, JSON.stringify(someTootStep)))
        .to.throw(/did not contain/g);
    });

    it(`should work`, () => {
      const tooter = new Tooter();
      const key = 'someKey';
      const someTootStep: TootStep = new TootStep()
        .setEmphasizer('asd')
        .setDisplayGenerator('abs');

      tooter.addTootStep(key, JSON.stringify(someTootStep));

      expect(tooter.toots).to.have.property(key);
      expect(tooter.toots[key]).to.be.deep.equal(someTootStep);
    });
  });
});

context('show', () => {
  const initFuncCounter = () => ({
    setDescription: 0
    , setTitle: 0
    , setNextCallback: 0
    , setPreviousCallback: 0
    , setStopCallback: 0
    , show: 0
    , hide: 0
  });
  /** Saves the number of calls to mocked object's functions */
  const calls = {
    displayGenerator1: initFuncCounter()
    , displayGenerator2: initFuncCounter()
    , emphasizer1: {
      emphasize: 0
      , deemphasize: 0
    }
    , emphasizer2: {
      emphasize: 0
      , deemphasize: 0
    }
  }

  let latestDisplayGenerator: TestTootDisplay = null;
  const mockTootDisplayGenerator
    : (key: 'displayGenerator1' | 'displayGenerator2') => ITootDisplayGenerator =
    (callKey) => () => {
      const someTootDisplay = new TestTootDisplay();
      someTootDisplay.setDescription = () => ++calls[callKey].setDescription;
      someTootDisplay.setTitle = () => ++calls[callKey].setTitle;
      someTootDisplay.setNextCallback = (clbck) => {
        ++calls[callKey].setNextCallback;
        someTootDisplay.nextCallback = clbck;
      }
      someTootDisplay.setPreviousCallback = () => ++calls[callKey].setPreviousCallback;
      someTootDisplay.setStopCallback = () => ++calls[callKey].setStopCallback;
      someTootDisplay.show = () => new Promise(res => { 
        latestDisplayGenerator = someTootDisplay;
        ++calls[callKey].show;
        res(); });
      someTootDisplay.hide = () => new Promise(res => { ++calls[callKey].hide; res(); });
      return someTootDisplay;
    };

  const mockTootEmphasizer
    : (key: 'emphasizer1' | 'emphasizer2') => ITootEmphasizer =
    (callKey) => ({
      emphasize: () => new Promise(res => { ++calls[callKey].emphasize; res(); })
      , deemphasize: () => new Promise(res => { ++calls[callKey].deemphasize; res(); })
    });

  const tootKeys = ['1', '2', '3'];

  const tooter = new Tooter(
    {
      '1': JSON.parse(`{ "displayGenerator": "generator1", "emphasizer": "emphasizer1" }`)
      , '2': JSON.parse(`{ "displayGenerator": "generator2", "emphasizer": "emphasizer2" }`)
      , '3': JSON.parse(`{ "displayGenerator": "generator1", "emphasizer": "emphasizer1" }`)
    }
    , {
      'emphasizer1': mockTootEmphasizer('emphasizer1')
      , 'emphasizer2': mockTootEmphasizer('emphasizer2')
    }
    , {
      'generator1': mockTootDisplayGenerator('displayGenerator1')
      , 'generator2': mockTootDisplayGenerator('displayGenerator2')
    }
  );

  it('1 > 2 > 3', function(done) {
    this.timeout(5000);
    tooter.show(tootKeys);
    latestDisplayGenerator.nextCallback();
    latestDisplayGenerator.nextCallback();
    setTimeout(() => {
      expect(calls.displayGenerator1.setDescription).to.equal(2);
      expect(calls.displayGenerator1.setTitle).to.equal(2);
      expect(calls.displayGenerator1.setNextCallback).to.equal(2);
      expect(calls.displayGenerator1.setPreviousCallback).to.equal(2);
      expect(calls.displayGenerator1.setStopCallback).to.equal(2);
      expect(calls.displayGenerator1.show).to.equal(2);
      expect(calls.displayGenerator1.hide).to.equal(1);
      expect(calls.displayGenerator2.setDescription).to.equal(1);
      expect(calls.displayGenerator2.setTitle).to.equal(1);
      expect(calls.displayGenerator2.setNextCallback).to.equal(1);
      expect(calls.displayGenerator2.setPreviousCallback).to.equal(1);
      expect(calls.displayGenerator2.setStopCallback).to.equal(1);
      expect(calls.displayGenerator2.show).to.equal(1);
      expect(calls.displayGenerator2.hide).to.equal(0);
      done();
    }, 2000);
  });
});