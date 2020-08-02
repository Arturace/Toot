import { expect } from 'chai';
import { nameof } from 'ts-simple-nameof';

import { Tooter } from '../src/Tooter';
import { TootStep } from '../src/TootStep';
import { ITootDisplayGenerator } from '../src/TootDisplay';
import { ITootEmphasizer } from '../src/TootEmphasizer';
import { TestTootDisplay, Test_Key_NotGiven as Test_Throws_Key_NotGiven } from './Tooter.test-utils';

const constructorArgs = [
  { name: nameof<Tooter>(t => t.toots), value: {} },
  { name: nameof<Tooter>(t => t.emphasizers), value: {} },
  { name: nameof<Tooter>(t => t.displayGenerators), value: {} },
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

  let nextCallback: () => void = null;
  const mockTootDisplayGenerator
    : (callKey: 'displayGenerator1' | 'displayGenerator2') => ITootDisplayGenerator =
    (callKey) => (step) => {
      const someTootDisplay = new TestTootDisplay();
      someTootDisplay.setDescription = () => ++calls[callKey].setDescription;
      someTootDisplay.setTitle = () => ++calls[callKey].setTitle;
      someTootDisplay.setNextCallback = (clbck) => {
        ++calls[callKey].setNextCallback;
        someTootDisplay.nextCallback = clbck;
        nextCallback = clbck;
      }
      someTootDisplay.setPreviousCallback = () => ++calls[callKey].setPreviousCallback;
      someTootDisplay.setStopCallback = () => ++calls[callKey].setStopCallback;
      someTootDisplay.show = () =>
        new Promise(res => {
          ++calls[callKey].show;
          res();
        });
      someTootDisplay.hide = () => new Promise(res => {
         ++calls[callKey].hide;
         res();
        });
      return someTootDisplay;
    };

  const mockTootEmphasizer
    : (key: 'emphasizer1' | 'emphasizer2') => ITootEmphasizer =
    (callKey) => ({
      emphasize: () => new Promise(res => { 
        ++calls[callKey].emphasize;
        res();
      })
      , deemphasize: () => new Promise(res => {
        ++calls[callKey].deemphasize;
        res();
      })
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

  it('show 1 > 2 > 3 > done', async () => {
    await tooter.show(tootKeys)
    await nextCallback();
    await nextCallback();
    await nextCallback();
    
    return new Promise(res => {
      // displayGenerator1 should be shown twice and hidden twice
      for (let prop in calls.displayGenerator1) {
        expect(calls.displayGenerator1[prop]).to.equal(2);
      }
      // displayGenerator2 should be shown once and hidden once
      for (let prop in calls.displayGenerator2) {
        expect(calls.displayGenerator2[prop]).to.equal(1);
      }
      res();
    });
  });
});