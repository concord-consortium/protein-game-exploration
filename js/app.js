var Snap = require("snapsvg");
import Melanogenesis from "./animations/melanogenesis";

const snap = Snap("#game");

const melanogenesis = new Melanogenesis(snap, Melanogenesis.WORKING_TYR1);
melanogenesis.run();


var radios = document.getElementsByTagName("input");
  for(let radio of radios) {
    radio.onchange = function() {
      if (radio.checked) {
        if (radio.name == "melanogenesis") {
          melanogenesis.setVersion(Melanogenesis[radio.id]);
        }
      }
    }
}
