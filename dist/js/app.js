var Snap = require("snapsvg");
import Melanogenesis from "./animations/melanogenesis";
import Transport from "./animations/transport";
import Gate from "./animations/gate";

const snap = Snap("#game");

const melanogenesis = new Melanogenesis(snap),
      transport = new Transport(snap, melanogenesis),
      gate = new Gate(snap, transport);

melanogenesis.run();


let drakes = document.querySelectorAll("#drake img"),
    hide = (els) => {
      Array.prototype.forEach.call(els, function (el) {
        if (el.classList)
          el.classList.add("hidden");
        else
          el.className += " hidden";
      });
    },
    show = (el) => {
      if (el.classList)
        el.classList.remove("hidden");
      else
        el.className = el.className.replace(new RegExp('(^|\\b)' + "hidden".split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

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
        hide(drakes);
        let drakeId = melanogenesis.version+"_"+transport.version+"_"+gate.version,
            drake = document.getElementById(drakeId);
        show(drake);
      }
    }
}
