/// <reference path="./src/TootChainable.ts" />

import { TootChainable } from "/dist/TootChainable.js";
import { Tooter } from "/dist/Tooter.js";

const highlighter = {
  emphasize: (el) => {
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const top = el.offsetTop;
    const left = el.offsetLeft;

    const highlightEl = document.createElement('div');
    highlightEl.style.width = width + 'px';
    highlightEl.style.height = height + 'px';
    highlightEl.style.position = 'absolute';
    highlightEl.style.top = top + 'px';
    highlightEl.style.left = left + 'px';
    highlightEl.style.backgroundColor = '#b1150d7F';
    document.body.appendChild(highlightEl);
    return highlightEl;
  },
  deemphasize: (el, highlightEl) => new Promise((res) =>
    highlightEl.animate([
      { opacity: '1' }
      , { opacity: '0' }
    ], {
      duration: 300
    })
      .onfinish = () => {
        document.body.removeChild(highlightEl);
        res();
      }
  )
};
const toot = new Tooter(null, {
  'basic-highlight': highlighter
});

const secondToot = toot
  .newToot('2ndToot')
  .setSelector('#result')
  .setTitle('Result should change')
  .setEmphasizer(toot.emphasizers['basic-highlight']);

const testingToot = toot
  .newToot('testingToot')
  .setSelector('#activator')
  .setTitle('Activating something awesome')
  .setDescription(`If you click on this amazingly plain button,
you will achieve greatness... Or show a different text in the div bellow.`)
  .setEmphasizer(toot.emphasizers['basic-highlight'])
  .setNext(secondToot)
  .show();

window.toot = toot;

// to hide
// toot.hide('testingToot')
// testingToot.hide()

