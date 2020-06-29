import { TootChainable } from "./TootChainable";

const toots = (function() {
  let toots: { [id: string] : TootChainable; } = {};
  
  const addToot = (aToot: TootChainable) => {};
  const show = (aToot: TootChainable) => {};

  return {
    addToot: addToot
    , show: show
  };
})();