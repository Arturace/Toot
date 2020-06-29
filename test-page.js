/// <reference path="./src/TootChainable.ts" />

import { TootChainable } from "/dist/TootChainable.js";

const highLighter = (el) => {
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
};
const deHighLighter = (highlightEl) => {
  highlightEl.animate([
    { opacity: '1' }
    , { opacity: '0' }
  ], {
    duration: 300
  })
    .onfinish = () => document.body.removeChild(highlightEl);
};

let testingToot = new TootChainable();
testingToot
  .setSelector('#activator')
  .setTitle('Activating something awesome')
  .setDescription(`If you click on this amazingly plain button,
  you will achieve greatness... Or show a different text in the div bellow.`)
  .setEmphasizer(highLighter)
  .setDeemphasizer(deHighLighter);
testingToot.show();
window.testingToot = testingToot;
