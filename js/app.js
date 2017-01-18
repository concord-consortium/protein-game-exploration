var Snap = require("snapsvg");
import Melanogenesis from "./animations/melanogenesis";
import Transport from "./animations/transport";
import Gate from "./animations/gate";

const snap = Snap("#game");

const melanogenesis = new Melanogenesis(snap),
      transport = new Transport(snap, melanogenesis),
      gate = new Gate(snap, transport);

melanogenesis.run();


var radios = document.getElementsByTagName("input");
  for(let radio of radios) {
    radio.onchange = function() {
      if (radio.checked) {
        if (radio.name == "melanogenesis") {
          melanogenesis.setVersion(Melanogenesis[radio.id]);
        } else if (radio.name == "transport") {
          transport.setVersion(Transport[radio.id]);
        } else if (radio.name == "gate") {
          gate.setVersion(Gate[radio.id]);
        }
      }
    }
}
