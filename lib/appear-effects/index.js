"use strict";

var _domData = _interopRequireDefault(require("./../js/dom/dom-data"));

var _functionElements = _interopRequireDefault(require("./../js/dom/function-elements"));

var _domFunctions = _interopRequireDefault(require("./../js/utilities/dom-functions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// params
var KEY = 'ape';
var DEFAULT_APPEARED_CLASS = 'appeared';
var DEFAULT_NON_APPEARED_CLASS = 'non-appeared';
var DEFAULT_ADD_CLASS_DELAY = 200;
var TRANSITION_TOLERANCE_DELAY = 10; // required to enable clean css transition, e.g. add class containing transition, then change style triggering transition
// class

var AppearEffects = /*#__PURE__*/function () {
  function AppearEffects() {
    _classCallCheck(this, AppearEffects);
  }

  _createClass(AppearEffects, [{
    key: "init",
    value: function init() {
      // console.log( 'init: ' + elem.bsxData.id )
      var appearUpdate = function appearUpdate() {
        if (_domData["default"].getElems(KEY)) {
          var elems = _domData["default"].getElems(KEY);

          elems.forEach(function (elem) {
            var conf = _domFunctions["default"].getConfigFromAttr(elem, KEY);

            var APPEARED_CLASS = conf != null && typeof conf.appearedClass !== 'undefined' ? conf.appearedClass : DEFAULT_APPEARED_CLASS;
            var NON_APPEARED_CLASS = conf != null && typeof conf.nonAppearedClass !== 'undefined' ? conf.nonAppearedClass : DEFAULT_NON_APPEARED_CLASS;
            var ADD_CLASS_DELAY = conf != null && typeof conf.addClassDelay !== 'undefined' ? conf.addClassDelay : DEFAULT_ADD_CLASS_DELAY; // TODO: get elems from dom data each event
            // TODO: remove done elems from dom data

            var elemY = elem.offsetTop;
            var elemX = elem.offsetLeft;
            var elemHeight = elem.offsetHeight;
            var elemWidth = elem.offsetWidth;
            var windowScrollY = window.pageYOffset; // document.documentElement.scrollTop

            var windowScrollX = window.pageXOffset; // document.documentElement.scrollLeft

            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth; // check scrollTop / Left and window height / width
            // console.log( 'id: ' + elem.bsxData.id + ' – top: ' + elemY + ' – left: ' + elemX )

            var aboveTheFold = function aboveTheFold() {
              return elemY + elemHeight <= windowScrollY;
            };

            var belowTheFold = function belowTheFold() {
              return elemY > windowScrollY + windowHeight;
            };

            var leftTheFold = function leftTheFold() {
              return elemX + elemWidth <= windowScrollX;
            };

            var rightTheFold = function rightTheFold() {
              return elemX > windowScrollX + windowWidth;
            };

            if (!(aboveTheFold() || belowTheFold()) && !(rightTheFold() || rightTheFold()) && typeof elem.bsxData !== 'undefined') {
              // on screen
              if (!elem.bsxData.appeared) {
                // not already appeared – appear
                console.log('id: ' + elem.bsxData.id + ' on screen');
                setTimeout(function () {
                  _domFunctions["default"].removeClassNames(elem, NON_APPEARED_CLASS);

                  _domFunctions["default"].addClassNames(elem, APPEARED_CLASS);
                }, ADD_CLASS_DELAY);
                elem.bsxData.appeared = true;

                if (!(conf != null && typeof conf.repeat !== 'undefined' && conf.repeat === true)) {
                  // remove from domData
                  console.log('DomData.removeElem( elem, KEY )');

                  _domData["default"].removeElem(elem, KEY);
                }
              } else {// already appeared and not disappeared again – do nothing
              }
            } else {
              // not on screen
              if (elem.bsxData.appeared) {
                // already appeared – disappear
                console.log('id: ' + elem.bsxData.id + ' off screen');
                elem.bsxData.appeared = false;
                setTimeout(function () {
                  _domFunctions["default"].removeClassNames(elem, APPEARED_CLASS);

                  _domFunctions["default"].addClassNames(elem, NON_APPEARED_CLASS);
                }, ADD_CLASS_DELAY);
              } else {// already disappeared and not appeared again – do nothing
              }
            }
          });
        } // /if

      }; // /appearUpdate()


      window.addEventListener('scroll', appearUpdate, false);
      window.addEventListener('touchmove', appearUpdate, false);
      window.addEventListener('resize', appearUpdate, false); // check initial state

      appearUpdate();
    }
  }]);

  return AppearEffects;
}(); // init


var effects = new AppearEffects();
effects.init(); // // class
// class AppearEffects {
//   constructor( elem ) {
//     elem = elem
//     conf = DomFn.getConfigFromAttr( elem, KEY )
//     APPEARED_CLASS = ( conf != null && typeof conf.appearedClass ) !== 'undefined' ? conf.appearedClass : DEFAULT_APPEARED_CLASS
//     ADD_CLASS_DELAY = ( conf != null && typeof conf.addClassDelay ) !== 'undefined' ? conf.addClassDelay : DEFAULT_ADD_CLASS_DELAY
//   }
//   init() {
//     // console.log( 'init: ' + elem.bsxData.id )
//     const appearUpdate = () => {
//       // TODO: get elems from dom data each event
//       // TODO: remove done elems from dom data
//       const elemY = elem.offsetTop
//       const elemX = elem.offsetLeft
//       const elemHeight = elem.offsetHeight
//       const elemWidth = elem.offsetWidth
//       const windowScrollY = window.pageYOffset// document.documentElement.scrollTop
//       const windowScrollX = window.pageXOffset// document.documentElement.scrollLeft
//       const windowHeight = window.innerHeight
//       const windowWidth = window.innerWidth
//       // check scrollTop / Left and window height / width
//       // console.log( 'id: ' + elem.bsxData.id + ' – top: ' + elemY + ' – left: ' + elemX )
//       const aboveTheFold = () => {
//         return elemY + elemHeight <= windowScrollY
//       }
//       const belowTheFold = () => {
//         return elemY > windowScrollY + windowHeight
//       }
//       const leftTheFold = () => {
//         return elemX + elemWidth <= windowScrollX
//       }
//       const rightTheFold = () => {
//         return elemX > windowScrollX + windowWidth
//       }
//       if ( 
//         ! ( aboveTheFold() || belowTheFold() ) 
//         && ! ( rightTheFold() || rightTheFold() ) 
//         && typeof elem.bsxData !== 'undefined' 
//         && ! elem.bsxData.appeared
//       ) {
//         console.log( 'id: ' + elem.bsxData.id + ' on screen' )
//         elem.bsxData.appeared = true
//         setTimeout( () => {
//           elem.classList.add( APPEARED_CLASS )
//         }, ADD_CLASS_DELAY )
//       }
//     }
//     window.addEventListener( 'scroll', appearUpdate )
//     window.addEventListener( 'resize', appearUpdate )
//     // check initial state
//     appearUpdate()
//   }
// }
// // init
// if ( DomData.getElems( KEY ) ) {
//   DomData.getElems( KEY ).forEach( ( elem ) => {
//     const currentElem = new AppearEffects( elem )
//     currentElem.init()
//   } )
// }