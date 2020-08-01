/// <reference path="./src/TootStep.ts" />

import { Tooter } from "/dist/Tooter.js";
import { TootStep } from "/dist/TootStep.js";

const highlighter = {
  emphasize: function () {
    const el = TootStep.getElement(this);
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const top = el.offsetTop;
    const left = el.offsetLeft;

    const highlightEl = document.createElement('div');
    highlightEl.style.pointerEvents = 'none';
    highlightEl.style.width = width + 'px';
    highlightEl.style.height = height + 'px';
    highlightEl.style.position = 'absolute';
    highlightEl.style.top = top + 'px';
    highlightEl.style.left = left + 'px';
    highlightEl.style.backgroundColor = 'transparent';
    document.body.appendChild(highlightEl);
    this.emphasizerElement = highlightEl;

    return new Promise((res) =>
      this.emphasizerElement.animate([
        { backgroundColor: 'transparent' }
        , { backgroundColor: '#b1150d7F' }
      ], {
        duration: 300,
        fill: 'forwards'
      })
        .onfinish = res
    )
  },
  deemphasize: function () {
    return new Promise((res) =>
      this.emphasizerElement.animate([
        { opacity: '1' }
        , { opacity: '0' }
      ], {
        duration: 300
      })
        .onfinish = () => {
          document.body.removeChild(this.emphasizerElement);
          res();
        }
    )
  }
};
const toot = new Tooter({}, {
  'basic-highlight': highlighter
});

toot.addDisplayGenerator('Basic_Display', (toot) => {
  const el = TootStep.getElement(toot);
  let display = {};

  display.mainContainer = document.createElement('div');
  display.descriptionContainer = document.createElement('p');
  display.titleContainer = document.createElement('h5');
  display.previousBtn = document.createElement('button');
  display.previousBtn.innerHTML = 'Previous';
  display.stopBtn = document.createElement('button');
  display.stopBtn.innerHTML = 'Stop it';
  display.nextBtn = document.createElement('button');
  display.nextBtn.innerHTML = 'Next';

  display.mainContainer.style.position = 'absolute';
  display.mainContainer.style.top = el.offsetTop + 'px';
  display.mainContainer.style.left = (el.offsetLeft + el.offsetWidth) + 'px';
  display.mainContainer.style.width = '200px';
  display.mainContainer.style.padding = '10px';
  display.mainContainer.style.backgroundColor = 'aliceBlue';

  display.mainContainer.appendChild(display.titleContainer);
  display.mainContainer.appendChild(display.descriptionContainer);
  display.mainContainer.appendChild(display.previousBtn);
  display.mainContainer.appendChild(display.stopBtn);
  display.mainContainer.appendChild(display.nextBtn);

  display.show = () => document.body.appendChild(display.mainContainer);
  display.hide = () => document.body.removeChild(display.mainContainer);
  display.setDescription = (desc) => display.descriptionContainer.innerHTML = desc;
  display.setTitle = (title) => display.titleContainer.innerHTML = title;
  display.setNextCallback = (clb) => display.nextBtn.addEventListener('click', clb); 
  display.setPreviousCallback = (clb) => display.previousBtn.addEventListener('click', clb);
  display.setStopCallback = (clb) => display.stopBtn.addEventListener('click', clb);
  
  return display;
});

const secondTootJSON = `{
  "title": "Result should change"
  , "description": "If it didn't, it means you didn't click on the button!"
  , "selector": "#result"
  , "emphasizer": "basic-highlight"
  , "displayGenerator": "Basic_Display"
}`;
const firstTootJSON = `{
  "title": "Activating something awesome"
  , "description": "If you click on this amazingly plain button, you will achieve greatness... Or show a different text in the div bellow."
  , "selector": "#activator"
  , "emphasizer": "basic-highlight"
  , "displayGenerator": "Basic_Display"
}`;
toot.addTootStep('firstToot', firstTootJSON);
toot.addTootStep('secondToot', secondTootJSON);
toot.show(['firstToot', 'secondToot']);

window.toot = toot;