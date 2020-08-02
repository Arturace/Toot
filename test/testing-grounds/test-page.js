/// <reference path="../../src/TootStep.ts" />

import { Tooter } from "/dist/browser/Tooter.js";
import { HIGHLIGHTER } from "../ressources/emphasizers/highlighter.js";
import { BASIC_DISPLAY_GENERATOR } from "../ressources/displayGenerators/basic.js";

const toot = new Tooter(
  {},
  { 'basic-highlight': HIGHLIGHTER },
  { 'Basic_Display': BASIC_DISPLAY_GENERATOR }
);

toot.addTootStep('firstToot', `{
  "title": "Activating something awesome"
  , "description": "If you click on this amazingly plain button, you will achieve greatness... Or show a different text in the div bellow."
  , "selector": "#activator"
  , "emphasizer": "basic-highlight"
  , "displayGenerator": "Basic_Display"
}`);
toot.addTootStep('secondToot', `{
  "title": "Result should change"
  , "description": "If it didn't, it means you didn't click on the button!"
  , "selector": "#result"
  , "emphasizer": "basic-highlight"
  , "displayGenerator": "Basic_Display"
}`);
toot.show(['firstToot', 'secondToot']);

window.toot = toot;