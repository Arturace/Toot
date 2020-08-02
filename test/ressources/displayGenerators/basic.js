import { TootStep } from "../../../dist/browser/TootStep.js";

export const BASIC_DISPLAY_GENERATOR = (toot) => {
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
};