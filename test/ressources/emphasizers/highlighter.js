import { TootStep } from "../../../dist/browser/TootStep.js";

export const HIGHLIGHTER = {
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