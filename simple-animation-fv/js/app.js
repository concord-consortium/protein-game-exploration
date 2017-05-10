var Snap = require("snapsvg");
import Melanogenesis from "./animations/melanogenesis";
import Transport from "./animations/transport";
import Gate from "./animations/gate";

(function() {
        Snap.plugin( function( Snap, Element, Paper, global ) {

    Element.prototype.drawAtPath = function( path, timer, options) {

      var myObject = this, bbox = this.getBBox(1);
      var point, movePoint = {}, len = path.getTotalLength(), from = 0, to = len, drawpath = 0, easing = mina.linear, callback;
      var startingTransform = '';

      if( options ) {
        easing = options.easing || easing;
        if( options.reverse  ) { from = len; to = 0; };
        if( options.drawpath ) {
          drawpath = 1;
          path.attr({
            fill: "none",
                                                strokeDasharray: len + " " + len,
                                                strokeDashoffset: this.len
                                  });

        };
        if( options.startingTransform ) {
          startingTransform = options.startingTransform;
        };
        callback = options.callback || function() {};
      };

      Snap.animate(from, to , function( val ) {
              point = path.getPointAtLength( val );
            movePoint.x = point.x - bbox.cx; movePoint.y = point.y - bbox.cy;
            myObject.transform( startingTransform + 't' + movePoint.x + ',' + movePoint.y + 'r' + point.alpha);

        if( drawpath ) {
          path.attr({ "stroke-dashoffset": len - val });
        };
        }, timer, easing, callback );
    };
  });

})();

const snap = Snap("#game");

const melanogenesis = new Melanogenesis(snap),
      transport = new Transport(snap, melanogenesis),
      gate = new Gate(snap, transport);

Snap.load("assets/melanocyte.svg", (img) => {

  snap.append(img)
  snap.select("#melanosome").attr({
    visibility: "hidden"
  });
  melanogenesis.run()
})



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
    },
    fade = (el, fadeIn, callback) => {
      if (fadeIn) {
        el.style.opacity = 0;
      } else {
        el.style.opacity = 1;
      }

      var last = +new Date();
      var tick = function() {
        if (fadeIn) {
          el.style.opacity = +el.style.opacity + (new Date() - last) / 5000;
        } else {
          el.style.opacity = +el.style.opacity - (new Date() - last) / 5000;
        }
        last = +new Date();

        if (fadeIn && +el.style.opacity < 1 || !fadeIn && +el.style.opacity > 0) {
          (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        } else if (callback) {
          callback();
        }
      };

      tick();
    };

var radios = document.getElementsByTagName("input");
  for(let radio of Array.from(radios)) {
    radio.onchange = function() {
      if (radio.checked) {
        if (radio.name == "melanogenesis") {
          melanogenesis.setVersion(Melanogenesis[radio.id]);
        } else if (radio.name == "transport") {
          transport.setVersion(Transport[radio.id]);
        } else if (radio.name == "gate") {
          gate.setVersion(Gate[radio.id]);
        }

        setTimeout( () => {
          let visibleDrake = document.querySelectorAll("#drake img:not(.hidden)")[0];
          let drakeId = melanogenesis.version+"_"+transport.version+"_"+gate.version,
              drake = document.getElementById(drakeId);
          show(drake);
          fade(visibleDrake, false);
          fade(drake, true, () => {hide(drakes); show(drake);});
        }, 500);
      }
    }
}
