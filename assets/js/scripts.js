(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _domData = _interopRequireDefault(require("./../js/dom/dom-data"));

var _functionElements = _interopRequireDefault(require("./../js/dom/function-elements"));

var _domFunctions = _interopRequireDefault(require("./../js/utilities/dom-functions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// params
var KEY = 'acc';
var DEFAULT_TARGET_OPENED_CLASS = 'open';
var DEFAULT_TRIGGER_OPENED_CLASS = 'open';
var DEFAULT_ALLOW_MULTI_OPEN = true;
var TRANSITION_TOLERANCE_DELAY = 10; // required to enable clean css transition, e.g. add class containing transition, then change style triggering transition
// class

var Accordion = /*#__PURE__*/function () {
  function Accordion(trigger) {
    _classCallCheck(this, Accordion);

    this.trigger = trigger;
    this.acc = this.trigger.closest('[data-acc]');
    this.conf = _domFunctions["default"].getConfigFromAttr(this.acc, KEY);
    this.ALLOW_MULTI_OPEN = (this.conf != null && _typeof(this.conf.multipleOpen)) !== 'undefined' ? this.conf.multipleOpen : DEFAULT_ALLOW_MULTI_OPEN;
    this.TARGET_OPENED_CLASS = (this.conf != null && _typeof(this.conf.targetOpenedClass)) !== 'undefined' ? this.conf.targetOpenedClass : DEFAULT_TARGET_OPENED_CLASS;
    this.TRIGGER_OPENED_CLASS = (this.conf != null && _typeof(this.conf.triggerOpenedClass)) !== 'undefined' ? this.conf.triggerOpenedClass : DEFAULT_TRIGGER_OPENED_CLASS;
  }

  _createClass(Accordion, [{
    key: "_open",
    value: function _open(trigger) {
      trigger.setAttribute('aria-expanded', 'true');
      trigger.classList.add(this.TRIGGER_OPENED_CLASS);

      var target = _domFunctions["default"].getTargetByAriaControls(trigger, trigger.closest('[data-acc-itm]'));

      var targetInner = target.querySelector('[acc-cnt-inr]');
      var targetInnerHeight = targetInner.offsetHeight;
      target.classList.add(this.TARGET_OPENED_CLASS);
      target.style.height = targetInnerHeight + 'px'; // remove height after transition ended

      var transitionDuration = _domFunctions["default"].getTransitionDuration(target) + TRANSITION_TOLERANCE_DELAY;
      setTimeout(function () {
        target.style.height = '';

        _domFunctions["default"].triggerEvent(window, 'scroll'); // TODO: trigger update event to all data-bsx elems within target (e.g. appear)

      }, transitionDuration);

      if (!this.ALLOW_MULTI_OPEN) {
        // disable clicked since must stay open
        trigger.setAttribute('aria-disabled', 'true');

        if (typeof this.acc.bsxData !== 'undefined' && typeof this.acc.bsxData.recentTrigger !== 'undefined') {
          // remove disabled from recent
          this.acc.bsxData.recentTrigger.removeAttribute('aria-disabled'); // close open (not clicked) item

          this._close(this.acc.bsxData.recentTrigger);
        } // remember clicked item


        this.acc.bsxData = {
          recentTrigger: trigger
        };
      }
    } // use trigger param (not this.trigger) since function will close multiple accordion items with one click event

  }, {
    key: "_close",
    value: function _close(trigger) {
      var _this = this;

      if (!trigger.hasAttribute('aria-disabled') || trigger.getAttribute('aria-disabled') === 'false') {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.classList.remove(this.TRIGGER_OPENED_CLASS);

        var target = _domFunctions["default"].getTargetByAriaControls(trigger, trigger.closest('[data-acc-itm]'));

        var targetInner = target.querySelector('[acc-cnt-inr]');
        var targetInnerHeight = targetInner.offsetHeight;
        var transitionDuration = _domFunctions["default"].getTransitionDuration(target) + TRANSITION_TOLERANCE_DELAY; // set height before remove opened class

        target.style.height = targetInnerHeight + 'px';
        setTimeout(function () {
          // remove opened class
          target.classList.remove(_this.TARGET_OPENED_CLASS);
          setTimeout(function () {
            // remove height to init transition
            target.style.height = '';
            setTimeout(function () {
              _domFunctions["default"].triggerEvent(window, 'scroll');
            }, transitionDuration);
          }, TRANSITION_TOLERANCE_DELAY);
        }, TRANSITION_TOLERANCE_DELAY);
      }
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      // console.log( 'init: ' + this.trigger.bsxData.id )
      if (!this.ALLOW_MULTI_OPEN && this.trigger.getAttribute('aria-expanded') === 'true') {
        // remember initial open status item
        this.acc.bsxData = {
          recentTrigger: this.trigger
        }; // set disabled (might not be initially set but opened)

        this.trigger.setAttribute('aria-disabled', 'true');
      } // set event listener


      this.trigger.addEventListener('click', function (event) {
        event.preventDefault(); // decide wether open or close

        if (_this2.trigger.getAttribute('aria-expanded') === 'false') {
          _this2._open(_this2.trigger);
        } else {
          _this2._close(_this2.trigger);
        }
      }, false);
    }
  }]);

  return Accordion;
}(); // init


if (_domData["default"].getElems(KEY)) {
  _domData["default"].getElems(KEY).forEach(function (trigger) {
    var currentTrigger = new Accordion(trigger);
    currentTrigger.init();
  });
}

},{"./../js/dom/dom-data":4,"./../js/dom/function-elements":5,"./../js/utilities/dom-functions":7}],2:[function(require,module,exports){
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

},{"./../js/dom/dom-data":4,"./../js/dom/function-elements":5,"./../js/utilities/dom-functions":7}],3:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BrowserAnalytics = /*#__PURE__*/function () {
  function BrowserAnalytics() {
    _classCallCheck(this, BrowserAnalytics);
  }

  _createClass(BrowserAnalytics, [{
    key: "isIos",
    value: function isIos() {
      return /iPad|iPhone|iPod/.test(navigator.platform) && !window.MSStream;
    }
  }, {
    key: "isAndroid",
    value: function isAndroid() {
      return /(android)/i.test(navigator.userAgent);
    }
  }, {
    key: "isWin",
    value: function isWin() {
      return navigator.platform.indexOf('Win') > -1;
    }
  }, {
    key: "isMobileIe",
    value: function isMobileIe() {
      return navigator.userAgent.match(/iemobile/i);
    }
  }, {
    key: "isWinPhone",
    value: function isWinPhone() {
      return navigator.userAgent.match(/Windows Phone/i);
    }
  }, {
    key: "getIosVersion",
    value: function getIosVersion() {
      return parseInt(('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1]).replace('undefined', '3_2').replace('_', '.').replace(/_/g, '')) || false;
    }
  }, {
    key: "getIosFullVersion",
    value: function getIosFullVersion() {
      return ('' + (/CPU.*OS ([0-9_]{1,9})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1]).replace('undefined', '3_2') || false;
    }
  }, {
    key: "addBodyClassNames",
    value: function addBodyClassNames() {
      if (this.isIos()) {
        // document.body.className += ' is-ios';
        document.body.classList.add('is-ios'); // detect version (required for fixes)

        var iosMaxVersion = 11;
        var iosVersion = this.getIosVersion();

        if (iosVersion !== false) {
          // document.body.className += ' ios' + iosVersion;
          document.body.classList.add('ios' + iosVersion);

          for (var i = iosVersion; i <= iosMaxVersion; i++) {
            // document.body.className += ' ioslte' + i;
            document.body.classList.add('ioslte' + i);
          }
        }
      } else if (this.isAndroid()) {
        // document.body.className += ' is-android';
        document.body.classList.add('is-android');
      } else if (this.isWin()) {
        // document.body.className += ' is-win';
        document.body.classList.add('is-win');

        if (this.isMobileIe()) {
          // document.body.className += ' is-mobile-ie';
          document.body.classList.add('is-mobile-ie');
        }
      }

      if (this.isWinPhone()) {
        // document.body.className += ' is-win-phone';
        document.body.classList.add('is-win-phone');
      }

      var detectIe = function detectIe() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');

        if (msie > 0) {
          return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');

        if (trident > 0) {
          var rv = ua.indexOf('rv:');
          return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');

        if (edge > 0) {
          return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        return false;
      }; // detect ie gt 9


      var ieMaxVersion = 14;
      var ieVersion = detectIe();
      var isIe = ieVersion !== false;

      if (isIe && ieVersion > 9) {
        // document.body.className += ' ie ie' + ieVersion;
        document.body.classList.add('ie');
        document.body.classList.add('ie' + ieVersion);

        for (var _i = ieVersion; _i <= ieMaxVersion; _i++) {
          // document.body.className += ' ielte' + i;
          document.body.classList.add('ielte' + _i);
        }
      }

      document.body.classList.add('browser-tested');
      console.log('browser-tested');
    }
  }]);

  return BrowserAnalytics;
}(); // init


var test = new BrowserAnalytics();
test.addBodyClassNames();

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var elemMap = function () {
  var elemStorage = {};
  var id = 0;
  return {
    set: function set(elem, key) {
      if (typeof elem.bsxData === 'undefined') {
        // add elem if not already exists
        // add data
        elem.bsxData = {
          key: key,
          id: id
        };

        if (typeof elemStorage[key] === 'undefined') {
          // add list if not already exists
          elemStorage[key] = [];
        } // add to list


        elemStorage[key].push(elem);
        id++;
      }
    },
    get: function get(key) {
      if (!key || typeof elemStorage[key] === 'undefined') {
        return null;
      }

      return elemStorage[key];
    },
    remove: function remove(elem, key) {
      if (typeof elem.bsxData === 'undefined') {
        return;
      }

      if (elem.bsxData.key === key) {
        // delete elem data
        delete elem.bsxData; // remove from list

        var currentElems = elemStorage[key];

        for (var i = 0; i < currentElems.length; i++) {
          if (currentElems[i] === elem) {
            currentElems.splice(i, 1);
          }
        }

        elemStorage[key] = currentElems;
      }
    }
  };
}();

var DomData = {
  addElem: function addElem(instance, key) {
    elemMap.set(instance, key);
  },
  getElems: function getElems(key) {
    return elemMap.get(key);
  },
  removeElem: function removeElem(instance, key) {
    elemMap.remove(instance, key);
  }
};
var _default = DomData;
exports["default"] = _default;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _domData = _interopRequireDefault(require("./dom-data"));

var _selectors = _interopRequireDefault(require("./../utilities/selectors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var FUNCTION_ATTR = _selectors["default"].functionAttr;
var functionElems = document.querySelectorAll('[' + FUNCTION_ATTR + ']'); // add to DomData

functionElems.forEach(function (elem) {
  var key = elem.getAttribute(FUNCTION_ATTR);

  _domData["default"].addElem(elem, key);
});
var _default = functionElems;
exports["default"] = _default;

},{"./../utilities/selectors":8,"./dom-data":4}],6:[function(require,module,exports){
"use strict";

require("./../test/index.js");

require("./browser-analytics/index.js");

require("./../accordion/index.js");

require("./../appear-effects/index.js");

},{"./../accordion/index.js":1,"./../appear-effects/index.js":2,"./../test/index.js":9,"./browser-analytics/index.js":3}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _selectors = _interopRequireDefault(require("./../utilities/selectors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }

var FUNCTION_ATTR = _selectors["default"].functionAttr;

var getConfigFromAttr = function getConfigFromAttr(elem, key) {
  if (!elem) {
    return;
  }

  var conf;

  if (key) {
    conf = elem.getAttribute("data-".concat(key, "-conf"));
  } else {
    conf = elem.getAttribute("data-conf");
  }

  if (typeof conf !== 'undefined' && conf != null) {
    return new Function('return ' + conf)();
  } else {
    return {};
  }
};

var getTargetByAriaControls = function getTargetByAriaControls(trigger, closest) {
  var wrapper = typeof closest !== 'undefined' ? closest : document;
  var targetId = trigger.getAttribute('aria-controls');
  return wrapper.querySelector("#".concat(targetId));
};

var getTransitionDuration = function getTransitionDuration(elem) {
  var _window$getComputedSt = window.getComputedStyle(elem),
      transitionDuration = _window$getComputedSt.transitionDuration;

  var floatTransitionDuration = Number.parseFloat(transitionDuration);

  if (!floatTransitionDuration) {
    floatTransitionDuration = (_readOnlyError("floatTransitionDuration"), 0);
  }

  return floatTransitionDuration * 1000;
};

var getTriggerFromEvent = function getTriggerFromEvent(event) {
  return event.target.getAttribute(FUNCTION_ATTR) != null ? event.target : event.target.closest('[' + FUNCTION_ATTR + ']');
};

var addClassNames = function addClassNames(elem, classNames) {
  if (classNames.indexOf(' ')) {
    var classNameList = classNames.split(' ');
    classNameList.forEach(function (className) {
      elem.classList.add(className);
    });
  } else {
    elem.classList.add(classNames);
  }
};

var removeClassNames = function removeClassNames(elem, classNames) {
  if (classNames.indexOf(' ')) {
    var classNameList = classNames.split(' ');
    classNameList.forEach(function (className) {
      elem.classList.remove(className);
    });
  } else {
    elem.classList.remove(classNames);
  }
};

var triggerEvent = function triggerEvent(elem, eventName) {
  var event = document.createEvent('Event');
  event.initEvent(eventName, true, true);
  elem.dispatchEvent(event);
}; // check if innerElem is positiones inside outerElem


var isPositionedInside = function isPositionedInside(outerElem, innerElem) {
  console.log('--');
  console.log('innerElem.offsetLeft >= outerElem.offsetLeft: ' + (innerElem.offsetLeft >= outerElem.offsetLeft ? 'true' : 'false'));
  console.log('( innerElem.offsetLeft + innerElem.offsetWidth ) <= ( /* outerElem.offsetLeft + */ outerElem.offsetWidth ): ' + (innerElem.offsetLeft + innerElem.offsetWidth <=
  /* outerElem.offsetLeft + */
  outerElem.offsetWidth ? 'true' : 'false'));
  console.log('innerElem.offsetTop >= outerElem.offsetTop: ' + (innerElem.offsetTop >= outerElem.offsetTop ? 'true' : 'false'));
  console.log('( innerElem.offsetTop + innerElem.offsetHeight ) <= ( /* outerElem.offsetTop + */ outerElem.offsetHeight ): ' + (innerElem.offsetTop + innerElem.offsetHeight <=
  /* outerElem.offsetTop + */
  outerElem.offsetHeight ? 'true' : 'false'));
  return innerElem.offsetLeft >= outerElem.offsetLeft && innerElem.offsetLeft + innerElem.offsetWidth <=
  /* outerElem.offsetLeft + */
  outerElem.offsetWidth && innerElem.offsetTop >= outerElem.offsetTop && innerElem.offsetTop + innerElem.offsetHeight <=
  /* outerElem.offsetTop + */
  outerElem.offsetHeight;
};

var DomFn = {
  getConfigFromAttr: getConfigFromAttr,
  getTargetByAriaControls: getTargetByAriaControls,
  getTransitionDuration: getTransitionDuration,
  getTriggerFromEvent: getTriggerFromEvent,
  addClassNames: addClassNames,
  removeClassNames: removeClassNames,
  triggerEvent: triggerEvent,
  isPositionedInside: isPositionedInside
};
var _default = DomFn;
exports["default"] = _default;

},{"./../utilities/selectors":8}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Selectors = {
  functionAttr: 'data-bsx',
  targetAttr: 'data-bsx-tg',
  focussableElements: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
};
var _default = Selectors;
exports["default"] = _default;

},{}],9:[function(require,module,exports){
"use strict";

require("./is-positioned-inside/index.js");

},{"./is-positioned-inside/index.js":10}],10:[function(require,module,exports){
"use strict";

var _domData = _interopRequireDefault(require("./../../js/dom/dom-data"));

var _functionElements = _interopRequireDefault(require("./../../js/dom/function-elements"));

var _domFunctions = _interopRequireDefault(require("./../../js/utilities/dom-functions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// inner elem positioned inside outer elem
var KEY = 'outer'; // init

if (_domData["default"].getElems(KEY)) {
  _domData["default"].getElems(KEY).forEach(function (outerElem) {
    var innerElem = outerElem.querySelector('[data-bsx-tg="inner"]');
    outerElem.setAttribute('data-test', _domFunctions["default"].isPositionedInside(outerElem, innerElem) ? 'true' : 'false');
    innerElem.innerHTML = _domFunctions["default"].isPositionedInside(outerElem, innerElem) ? 'true' : 'false';
  });
}

},{"./../../js/dom/dom-data":4,"./../../js/dom/function-elements":5,"./../../js/utilities/dom-functions":7}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWNjb3JkaW9uL2luZGV4LmpzIiwic3JjL2FwcGVhci1lZmZlY3RzL2luZGV4LmpzIiwic3JjL2pzL2Jyb3dzZXItYW5hbHl0aWNzL2luZGV4LmpzIiwic3JjL2pzL2RvbS9kb20tZGF0YS5qcyIsInNyYy9qcy9kb20vZnVuY3Rpb24tZWxlbWVudHMuanMiLCJzcmMvanMvaW5kZXguanMiLCJzcmMvanMvdXRpbGl0aWVzL2RvbS1mdW5jdGlvbnMuanMiLCJzcmMvanMvdXRpbGl0aWVzL3NlbGVjdG9ycy5qcyIsInNyYy90ZXN0L2luZGV4LmpzIiwic3JjL3Rlc3QvaXMtcG9zaXRpb25lZC1pbnNpZGUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFHQTtBQUVBLElBQU0sR0FBRyxHQUFHLEtBQVo7QUFDQSxJQUFNLDJCQUEyQixHQUFHLE1BQXBDO0FBQ0EsSUFBTSw0QkFBNEIsR0FBRyxNQUFyQztBQUNBLElBQU0sd0JBQXdCLEdBQUcsSUFBakM7QUFDQSxJQUFNLDBCQUEwQixHQUFHLEVBQW5DLEMsQ0FBc0M7QUFHdEM7O0lBRU0sUztBQUNKLHFCQUFhLE9BQWIsRUFBdUI7QUFBQTs7QUFDckIsU0FBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLFNBQUssR0FBTCxHQUFXLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBc0IsWUFBdEIsQ0FBWDtBQUNBLFNBQUssSUFBTCxHQUFZLHlCQUFNLGlCQUFOLENBQXlCLEtBQUssR0FBOUIsRUFBbUMsR0FBbkMsQ0FBWjtBQUNBLFNBQUssZ0JBQUwsR0FBd0IsQ0FBRSxLQUFLLElBQUwsSUFBYSxJQUFiLFlBQTRCLEtBQUssSUFBTCxDQUFVLFlBQXRDLENBQUYsTUFBMkQsV0FBM0QsR0FBeUUsS0FBSyxJQUFMLENBQVUsWUFBbkYsR0FBa0csd0JBQTFIO0FBQ0EsU0FB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UUFBUixDQUFrQixHQUFsQixDQUFMLEVBQStCO0FBQzdCLHNCQUFRLFFBQVIsQ0FBa0IsR0FBbEIsRUFBd0IsT0FBeEIsQ0FBaUMsVUFBRSxTQUFGLEVBQWlCO0FBQ2hELFFBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxhQUFWLENBQXlCLHVCQUF6QixDQUFsQjtBQUNBLElBQUEsU0FBUyxDQUFDLFlBQVYsQ0FBd0IsV0FBeEIsRUFBdUMseUJBQU0sa0JBQU4sQ0FBMEIsU0FBMUIsRUFBcUMsU0FBckMsSUFBbUQsTUFBbkQsR0FBNEQsT0FBbkc7QUFDQSxJQUFBLFNBQVMsQ0FBQyxTQUFWLEdBQXdCLHlCQUFNLGtCQUFOLENBQTBCLFNBQTFCLEVBQXFDLFNBQXJDLElBQW1ELE1BQW5ELEdBQTRELE9BQXBGO0FBQ0QsR0FKRDtBQUtEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IERvbURhdGEgZnJvbSAnLi8uLi9qcy9kb20vZG9tLWRhdGEnXG5pbXBvcnQgTWFrZUZuRWxlbXMgZnJvbSAnLi8uLi9qcy9kb20vZnVuY3Rpb24tZWxlbWVudHMnXG5pbXBvcnQgRG9tRm4gZnJvbSAnLi8uLi9qcy91dGlsaXRpZXMvZG9tLWZ1bmN0aW9ucydcblxuXG4vLyBwYXJhbXNcblxuY29uc3QgS0VZID0gJ2FjYydcbmNvbnN0IERFRkFVTFRfVEFSR0VUX09QRU5FRF9DTEFTUyA9ICdvcGVuJ1xuY29uc3QgREVGQVVMVF9UUklHR0VSX09QRU5FRF9DTEFTUyA9ICdvcGVuJ1xuY29uc3QgREVGQVVMVF9BTExPV19NVUxUSV9PUEVOID0gdHJ1ZVxuY29uc3QgVFJBTlNJVElPTl9UT0xFUkFOQ0VfREVMQVkgPSAxMCAvLyByZXF1aXJlZCB0byBlbmFibGUgY2xlYW4gY3NzIHRyYW5zaXRpb24sIGUuZy4gYWRkIGNsYXNzIGNvbnRhaW5pbmcgdHJhbnNpdGlvbiwgdGhlbiBjaGFuZ2Ugc3R5bGUgdHJpZ2dlcmluZyB0cmFuc2l0aW9uXG5cblxuLy8gY2xhc3NcblxuY2xhc3MgQWNjb3JkaW9uIHtcbiAgY29uc3RydWN0b3IoIHRyaWdnZXIgKSB7XG4gICAgdGhpcy50cmlnZ2VyID0gdHJpZ2dlclxuICAgIHRoaXMuYWNjID0gdGhpcy50cmlnZ2VyLmNsb3Nlc3QoICdbZGF0YS1hY2NdJyApXG4gICAgdGhpcy5jb25mID0gRG9tRm4uZ2V0Q29uZmlnRnJvbUF0dHIoIHRoaXMuYWNjLCBLRVkgKVxuICAgIHRoaXMuQUxMT1dfTVVMVElfT1BFTiA9ICggdGhpcy5jb25mICE9IG51bGwgJiYgdHlwZW9mIHRoaXMuY29uZi5tdWx0aXBsZU9wZW4gKSAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLmNvbmYubXVsdGlwbGVPcGVuIDogREVGQVVMVF9BTExPV19NVUxUSV9PUEVOXG4gICAgdGhpcy5UQVJHRVRfT1BFTkVEX0NMQVNTID0gKCB0aGlzLmNvbmYgIT0gbnVsbCAmJiB0eXBlb2YgdGhpcy5jb25mLnRhcmdldE9wZW5lZENsYXNzICkgIT09ICd1bmRlZmluZWQnID8gdGhpcy5jb25mLnRhcmdldE9wZW5lZENsYXNzIDogREVGQVVMVF9UQVJHRVRfT1BFTkVEX0NMQVNTXG4gICAgdGhpcy5UUklHR0VSX09QRU5FRF9DTEFTUyA9ICggdGhpcy5jb25mICE9IG51bGwgJiYgdHlwZW9mIHRoaXMuY29uZi50cmlnZ2VyT3BlbmVkQ2xhc3MgKSAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLmNvbmYudHJpZ2dlck9wZW5lZENsYXNzIDogREVGQVVMVF9UUklHR0VSX09QRU5FRF9DTEFTU1xuICB9XG4gIF9vcGVuKCB0cmlnZ2VyICkge1xuICAgIHRyaWdnZXIuc2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyApXG4gICAgdHJpZ2dlci5jbGFzc0xpc3QuYWRkKCB0aGlzLlRSSUdHRVJfT1BFTkVEX0NMQVNTIClcbiAgICBjb25zdCB0YXJnZXQgPSBEb21Gbi5nZXRUYXJnZXRCeUFyaWFDb250cm9scyggdHJpZ2dlciwgdHJpZ2dlci5jbG9zZXN0KCAnW2RhdGEtYWNjLWl0bV0nICkgKVxuICAgIGNvbnN0IHRhcmdldElubmVyID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoICdbYWNjLWNudC1pbnJdJyApXG4gICAgY29uc3QgdGFyZ2V0SW5uZXJIZWlnaHQgPSB0YXJnZXRJbm5lci5vZmZzZXRIZWlnaHRcbiAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZCggdGhpcy5UQVJHRVRfT1BFTkVEX0NMQVNTIClcbiAgICB0YXJnZXQuc3R5bGUuaGVpZ2h0ID0gdGFyZ2V0SW5uZXJIZWlnaHQgKyAncHgnXG4gICAgLy8gcmVtb3ZlIGhlaWdodCBhZnRlciB0cmFuc2l0aW9uIGVuZGVkXG4gICAgY29uc3QgdHJhbnNpdGlvbkR1cmF0aW9uID0gRG9tRm4uZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCB0YXJnZXQgKSArIFRSQU5TSVRJT05fVE9MRVJBTkNFX0RFTEFZXG4gICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgdGFyZ2V0LnN0eWxlLmhlaWdodCA9ICcnXG4gICAgICBEb21Gbi50cmlnZ2VyRXZlbnQoIHdpbmRvdywgJ3Njcm9sbCcgKVxuICAgICAgLy8gVE9ETzogdHJpZ2dlciB1cGRhdGUgZXZlbnQgdG8gYWxsIGRhdGEtYnN4IGVsZW1zIHdpdGhpbiB0YXJnZXQgKGUuZy4gYXBwZWFyKVxuICAgIH0sIHRyYW5zaXRpb25EdXJhdGlvbiApXG5cbiAgICBpZiAoICEgdGhpcy5BTExPV19NVUxUSV9PUEVOICkge1xuICAgICAgLy8gZGlzYWJsZSBjbGlja2VkIHNpbmNlIG11c3Qgc3RheSBvcGVuXG4gICAgICB0cmlnZ2VyLnNldEF0dHJpYnV0ZSggJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScgKVxuICAgICAgaWYgKCB0eXBlb2YgdGhpcy5hY2MuYnN4RGF0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHRoaXMuYWNjLmJzeERhdGEucmVjZW50VHJpZ2dlciAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIC8vIHJlbW92ZSBkaXNhYmxlZCBmcm9tIHJlY2VudFxuICAgICAgICB0aGlzLmFjYy5ic3hEYXRhLnJlY2VudFRyaWdnZXIucmVtb3ZlQXR0cmlidXRlKCAnYXJpYS1kaXNhYmxlZCcgKVxuICAgICAgICAvLyBjbG9zZSBvcGVuIChub3QgY2xpY2tlZCkgaXRlbVxuICAgICAgICB0aGlzLl9jbG9zZSggdGhpcy5hY2MuYnN4RGF0YS5yZWNlbnRUcmlnZ2VyIClcbiAgICAgIH1cbiAgICAgIC8vIHJlbWVtYmVyIGNsaWNrZWQgaXRlbVxuICAgICAgdGhpcy5hY2MuYnN4RGF0YSA9IHsgcmVjZW50VHJpZ2dlcjogdHJpZ2dlciB9XG4gICAgfVxuICB9XG4gIC8vIHVzZSB0cmlnZ2VyIHBhcmFtIChub3QgdGhpcy50cmlnZ2VyKSBzaW5jZSBmdW5jdGlvbiB3aWxsIGNsb3NlIG11bHRpcGxlIGFjY29yZGlvbiBpdGVtcyB3aXRoIG9uZSBjbGljayBldmVudFxuICBfY2xvc2UoIHRyaWdnZXIgKSB7XG4gICAgaWYgKCAhIHRyaWdnZXIuaGFzQXR0cmlidXRlKCAnYXJpYS1kaXNhYmxlZCcgKSB8fCB0cmlnZ2VyLmdldEF0dHJpYnV0ZSggJ2FyaWEtZGlzYWJsZWQnICkgPT09ICdmYWxzZScgKSB7XG4gICAgICB0cmlnZ2VyLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnIClcbiAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSggdGhpcy5UUklHR0VSX09QRU5FRF9DTEFTUyApXG4gICAgICBjb25zdCB0YXJnZXQgPSBEb21Gbi5nZXRUYXJnZXRCeUFyaWFDb250cm9scyggdHJpZ2dlciwgdHJpZ2dlci5jbG9zZXN0KCAnW2RhdGEtYWNjLWl0bV0nICkgKVxuICAgICAgY29uc3QgdGFyZ2V0SW5uZXIgPSB0YXJnZXQucXVlcnlTZWxlY3RvciggJ1thY2MtY250LWlucl0nIClcbiAgICAgIGNvbnN0IHRhcmdldElubmVySGVpZ2h0ID0gdGFyZ2V0SW5uZXIub2Zmc2V0SGVpZ2h0XG4gICAgICBjb25zdCB0cmFuc2l0aW9uRHVyYXRpb24gPSBEb21Gbi5nZXRUcmFuc2l0aW9uRHVyYXRpb24oIHRhcmdldCApICsgVFJBTlNJVElPTl9UT0xFUkFOQ0VfREVMQVlcbiAgICAgIC8vIHNldCBoZWlnaHQgYmVmb3JlIHJlbW92ZSBvcGVuZWQgY2xhc3NcbiAgICAgIHRhcmdldC5zdHlsZS5oZWlnaHQgPSB0YXJnZXRJbm5lckhlaWdodCArICdweCdcbiAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcbiAgICAgICAgLy8gcmVtb3ZlIG9wZW5lZCBjbGFzc1xuICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSggdGhpcy5UQVJHRVRfT1BFTkVEX0NMQVNTIClcbiAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgIC8vIHJlbW92ZSBoZWlnaHQgdG8gaW5pdCB0cmFuc2l0aW9uXG4gICAgICAgICAgdGFyZ2V0LnN0eWxlLmhlaWdodCA9ICcnXG4gICAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgRG9tRm4udHJpZ2dlckV2ZW50KCB3aW5kb3csICdzY3JvbGwnIClcbiAgICAgICAgICB9LCB0cmFuc2l0aW9uRHVyYXRpb24gKVxuICAgICAgICB9LCBUUkFOU0lUSU9OX1RPTEVSQU5DRV9ERUxBWSApXG4gICAgICB9LCBUUkFOU0lUSU9OX1RPTEVSQU5DRV9ERUxBWSApXG4gICAgfVxuICB9XG4gIGluaXQoKSB7XG4gICAgLy8gY29uc29sZS5sb2coICdpbml0OiAnICsgdGhpcy50cmlnZ2VyLmJzeERhdGEuaWQgKVxuICAgIGlmICggISB0aGlzLkFMTE9XX01VTFRJX09QRU4gJiYgdGhpcy50cmlnZ2VyLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICd0cnVlJyApIHtcbiAgICAgIC8vIHJlbWVtYmVyIGluaXRpYWwgb3BlbiBzdGF0dXMgaXRlbVxuICAgICAgdGhpcy5hY2MuYnN4RGF0YSA9IHsgcmVjZW50VHJpZ2dlcjogdGhpcy50cmlnZ2VyIH1cbiAgICAgIC8vIHNldCBkaXNhYmxlZCAobWlnaHQgbm90IGJlIGluaXRpYWxseSBzZXQgYnV0IG9wZW5lZClcbiAgICAgIHRoaXMudHJpZ2dlci5zZXRBdHRyaWJ1dGUoICdhcmlhLWRpc2FibGVkJywgJ3RydWUnIClcbiAgICB9XG5cbiAgICAvLyBzZXQgZXZlbnQgbGlzdGVuZXJcbiAgICB0aGlzLnRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCBldmVudCApID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIC8vIGRlY2lkZSB3ZXRoZXIgb3BlbiBvciBjbG9zZVxuICAgICAgaWYgKCB0aGlzLnRyaWdnZXIuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ2ZhbHNlJyApIHtcbiAgICAgICAgdGhpcy5fb3BlbiggdGhpcy50cmlnZ2VyIClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Nsb3NlKCB0aGlzLnRyaWdnZXIgKVxuICAgICAgfVxuICAgIH0sIGZhbHNlIClcbiAgfVxufVxuXG5cbi8vIGluaXRcblxuaWYgKCBEb21EYXRhLmdldEVsZW1zKCBLRVkgKSApIHtcbiAgRG9tRGF0YS5nZXRFbGVtcyggS0VZICkuZm9yRWFjaCggKCB0cmlnZ2VyICkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRUcmlnZ2VyID0gbmV3IEFjY29yZGlvbiggdHJpZ2dlciApXG4gICAgY3VycmVudFRyaWdnZXIuaW5pdCgpXG4gIH0gKVxufVxuXG4iLCJpbXBvcnQgRG9tRGF0YSBmcm9tICcuLy4uL2pzL2RvbS9kb20tZGF0YSdcbmltcG9ydCBNYWtlRm5FbGVtcyBmcm9tICcuLy4uL2pzL2RvbS9mdW5jdGlvbi1lbGVtZW50cydcbmltcG9ydCBEb21GbiBmcm9tICcuLy4uL2pzL3V0aWxpdGllcy9kb20tZnVuY3Rpb25zJ1xuXG5cbi8vIHBhcmFtc1xuXG5jb25zdCBLRVkgPSAnYXBlJ1xuY29uc3QgREVGQVVMVF9BUFBFQVJFRF9DTEFTUyA9ICdhcHBlYXJlZCdcbmNvbnN0IERFRkFVTFRfTk9OX0FQUEVBUkVEX0NMQVNTID0gJ25vbi1hcHBlYXJlZCdcbmNvbnN0IERFRkFVTFRfQUREX0NMQVNTX0RFTEFZID0gMjAwXG5jb25zdCBUUkFOU0lUSU9OX1RPTEVSQU5DRV9ERUxBWSA9IDEwIC8vIHJlcXVpcmVkIHRvIGVuYWJsZSBjbGVhbiBjc3MgdHJhbnNpdGlvbiwgZS5nLiBhZGQgY2xhc3MgY29udGFpbmluZyB0cmFuc2l0aW9uLCB0aGVuIGNoYW5nZSBzdHlsZSB0cmlnZ2VyaW5nIHRyYW5zaXRpb25cblxuXG4vLyBjbGFzc1xuXG5jbGFzcyBBcHBlYXJFZmZlY3RzIHtcblxuICBpbml0KCkge1xuXG4gICAgLy8gY29uc29sZS5sb2coICdpbml0OiAnICsgZWxlbS5ic3hEYXRhLmlkIClcbiAgICBjb25zdCBhcHBlYXJVcGRhdGUgPSAoKSA9PiB7XG5cbiAgICAgIGlmICggRG9tRGF0YS5nZXRFbGVtcyggS0VZICkgKSB7XG5cbiAgICAgICAgY29uc3QgZWxlbXMgPSBEb21EYXRhLmdldEVsZW1zKCBLRVkgKVxuXG4gICAgICAgIGVsZW1zLmZvckVhY2goICggZWxlbSApID0+IHtcblxuICAgICAgICAgIGNvbnN0IGNvbmYgPSBEb21Gbi5nZXRDb25maWdGcm9tQXR0ciggZWxlbSwgS0VZIClcbiAgICAgICAgICBjb25zdCBBUFBFQVJFRF9DTEFTUyA9ICggY29uZiAhPSBudWxsICYmIHR5cGVvZiBjb25mLmFwcGVhcmVkQ2xhc3MgIT09ICd1bmRlZmluZWQnICkgPyBjb25mLmFwcGVhcmVkQ2xhc3MgOiBERUZBVUxUX0FQUEVBUkVEX0NMQVNTXG4gICAgICAgICAgY29uc3QgTk9OX0FQUEVBUkVEX0NMQVNTID0gKCBjb25mICE9IG51bGwgJiYgdHlwZW9mIGNvbmYubm9uQXBwZWFyZWRDbGFzcyAhPT0gJ3VuZGVmaW5lZCcgKSA/IGNvbmYubm9uQXBwZWFyZWRDbGFzcyA6IERFRkFVTFRfTk9OX0FQUEVBUkVEX0NMQVNTXG4gICAgICAgICAgY29uc3QgQUREX0NMQVNTX0RFTEFZID0gKCBjb25mICE9IG51bGwgJiYgdHlwZW9mIGNvbmYuYWRkQ2xhc3NEZWxheSAhPT0gJ3VuZGVmaW5lZCcgKSA/IGNvbmYuYWRkQ2xhc3NEZWxheSA6IERFRkFVTFRfQUREX0NMQVNTX0RFTEFZXG4gICAgICAgIFxuICAgICAgICAgIC8vIFRPRE86IGdldCBlbGVtcyBmcm9tIGRvbSBkYXRhIGVhY2ggZXZlbnRcbiAgICAgICAgICAvLyBUT0RPOiByZW1vdmUgZG9uZSBlbGVtcyBmcm9tIGRvbSBkYXRhXG4gICAgICAgICAgY29uc3QgZWxlbVkgPSBlbGVtLm9mZnNldFRvcFxuICAgICAgICAgIGNvbnN0IGVsZW1YID0gZWxlbS5vZmZzZXRMZWZ0XG4gICAgICAgICAgY29uc3QgZWxlbUhlaWdodCA9IGVsZW0ub2Zmc2V0SGVpZ2h0XG4gICAgICAgICAgY29uc3QgZWxlbVdpZHRoID0gZWxlbS5vZmZzZXRXaWR0aFxuICAgICAgICAgIGNvbnN0IHdpbmRvd1Njcm9sbFkgPSB3aW5kb3cucGFnZVlPZmZzZXQvLyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wXG4gICAgICAgICAgY29uc3Qgd2luZG93U2Nyb2xsWCA9IHdpbmRvdy5wYWdlWE9mZnNldC8vIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0XG4gICAgICAgICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XG4gICAgICAgICAgY29uc3Qgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgICAgICAgIC8vIGNoZWNrIHNjcm9sbFRvcCAvIExlZnQgYW5kIHdpbmRvdyBoZWlnaHQgLyB3aWR0aFxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCAnaWQ6ICcgKyBlbGVtLmJzeERhdGEuaWQgKyAnIOKAkyB0b3A6ICcgKyBlbGVtWSArICcg4oCTIGxlZnQ6ICcgKyBlbGVtWCApXG5cbiAgICAgICAgICBjb25zdCBhYm92ZVRoZUZvbGQgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbVkgKyBlbGVtSGVpZ2h0IDw9IHdpbmRvd1Njcm9sbFlcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgYmVsb3dUaGVGb2xkID0gKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1ZID4gd2luZG93U2Nyb2xsWSArIHdpbmRvd0hlaWdodFxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBsZWZ0VGhlRm9sZCA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtWCArIGVsZW1XaWR0aCA8PSB3aW5kb3dTY3JvbGxYXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHJpZ2h0VGhlRm9sZCA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtWCA+IHdpbmRvd1Njcm9sbFggKyB3aW5kb3dXaWR0aFxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIFxuICAgICAgICAgICAgISAoIGFib3ZlVGhlRm9sZCgpIHx8IGJlbG93VGhlRm9sZCgpICkgXG4gICAgICAgICAgICAmJiAhICggcmlnaHRUaGVGb2xkKCkgfHwgcmlnaHRUaGVGb2xkKCkgKSBcbiAgICAgICAgICAgICYmIHR5cGVvZiBlbGVtLmJzeERhdGEgIT09ICd1bmRlZmluZWQnIFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgLy8gb24gc2NyZWVuXG5cbiAgICAgICAgICAgIGlmICggISBlbGVtLmJzeERhdGEuYXBwZWFyZWQgKSB7XG4gICAgICAgICAgICAgIC8vIG5vdCBhbHJlYWR5IGFwcGVhcmVkIOKAkyBhcHBlYXJcblxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2lkOiAnICsgZWxlbS5ic3hEYXRhLmlkICsgJyBvbiBzY3JlZW4nIClcblxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgRG9tRm4ucmVtb3ZlQ2xhc3NOYW1lcyggZWxlbSwgTk9OX0FQUEVBUkVEX0NMQVNTIClcbiAgICAgICAgICAgICAgICBEb21Gbi5hZGRDbGFzc05hbWVzKCBlbGVtLCBBUFBFQVJFRF9DTEFTUyApXG4gICAgICAgICAgICAgIH0sIEFERF9DTEFTU19ERUxBWSApXG5cbiAgICAgICAgICAgICAgZWxlbS5ic3hEYXRhLmFwcGVhcmVkID0gdHJ1ZVxuICAgXG4gICAgICAgICAgICAgIGlmICggISAoIGNvbmYgIT0gbnVsbCAmJiB0eXBlb2YgY29uZi5yZXBlYXQgIT09ICd1bmRlZmluZWQnICYmIGNvbmYucmVwZWF0ID09PSB0cnVlICkgKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGZyb20gZG9tRGF0YVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnRG9tRGF0YS5yZW1vdmVFbGVtKCBlbGVtLCBLRVkgKScgKVxuICAgICAgICAgICAgICAgIERvbURhdGEucmVtb3ZlRWxlbSggZWxlbSwgS0VZIClcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gYWxyZWFkeSBhcHBlYXJlZCBhbmQgbm90IGRpc2FwcGVhcmVkIGFnYWluIOKAkyBkbyBub3RoaW5nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBub3Qgb24gc2NyZWVuXG5cbiAgICAgICAgICAgIGlmICggZWxlbS5ic3hEYXRhLmFwcGVhcmVkICkge1xuICAgICAgICAgICAgICAvLyBhbHJlYWR5IGFwcGVhcmVkIOKAkyBkaXNhcHBlYXJcblxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2lkOiAnICsgZWxlbS5ic3hEYXRhLmlkICsgJyBvZmYgc2NyZWVuJyApXG4gICAgICAgICAgICAgIGVsZW0uYnN4RGF0YS5hcHBlYXJlZCA9IGZhbHNlXG5cbiAgICAgICAgICAgICAgc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgICAgICAgICAgIERvbUZuLnJlbW92ZUNsYXNzTmFtZXMoIGVsZW0sIEFQUEVBUkVEX0NMQVNTIClcbiAgICAgICAgICAgICAgICBEb21Gbi5hZGRDbGFzc05hbWVzKCBlbGVtLCBOT05fQVBQRUFSRURfQ0xBU1MgKVxuICAgICAgICAgICAgICB9LCBBRERfQ0xBU1NfREVMQVkgKVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gYWxyZWFkeSBkaXNhcHBlYXJlZCBhbmQgbm90IGFwcGVhcmVkIGFnYWluIOKAkyBkbyBub3RoaW5nXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9XG5cbiAgICAgICAgfSApXG5cbiAgICAgIH0gLy8gL2lmXG5cbiAgICB9IC8vIC9hcHBlYXJVcGRhdGUoKVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBhcHBlYXJVcGRhdGUsIGZhbHNlIClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIGFwcGVhclVwZGF0ZSwgZmFsc2UgKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgYXBwZWFyVXBkYXRlLCBmYWxzZSApXG5cbiAgICAvLyBjaGVjayBpbml0aWFsIHN0YXRlXG4gICAgYXBwZWFyVXBkYXRlKClcbiAgfVxufVxuXG5cbi8vIGluaXRcblxuY29uc3QgZWZmZWN0cyA9IG5ldyBBcHBlYXJFZmZlY3RzKClcbmVmZmVjdHMuaW5pdCgpXG5cblxuXG5cblxuXG4vLyAvLyBjbGFzc1xuXG4vLyBjbGFzcyBBcHBlYXJFZmZlY3RzIHtcbi8vICAgY29uc3RydWN0b3IoIGVsZW0gKSB7XG4vLyAgICAgZWxlbSA9IGVsZW1cbi8vICAgICBjb25mID0gRG9tRm4uZ2V0Q29uZmlnRnJvbUF0dHIoIGVsZW0sIEtFWSApXG4vLyAgICAgQVBQRUFSRURfQ0xBU1MgPSAoIGNvbmYgIT0gbnVsbCAmJiB0eXBlb2YgY29uZi5hcHBlYXJlZENsYXNzICkgIT09ICd1bmRlZmluZWQnID8gY29uZi5hcHBlYXJlZENsYXNzIDogREVGQVVMVF9BUFBFQVJFRF9DTEFTU1xuLy8gICAgIEFERF9DTEFTU19ERUxBWSA9ICggY29uZiAhPSBudWxsICYmIHR5cGVvZiBjb25mLmFkZENsYXNzRGVsYXkgKSAhPT0gJ3VuZGVmaW5lZCcgPyBjb25mLmFkZENsYXNzRGVsYXkgOiBERUZBVUxUX0FERF9DTEFTU19ERUxBWVxuLy8gICB9XG4vLyAgIGluaXQoKSB7XG4vLyAgICAgLy8gY29uc29sZS5sb2coICdpbml0OiAnICsgZWxlbS5ic3hEYXRhLmlkIClcbi8vICAgICBjb25zdCBhcHBlYXJVcGRhdGUgPSAoKSA9PiB7XG4vLyAgICAgICAvLyBUT0RPOiBnZXQgZWxlbXMgZnJvbSBkb20gZGF0YSBlYWNoIGV2ZW50XG4vLyAgICAgICAvLyBUT0RPOiByZW1vdmUgZG9uZSBlbGVtcyBmcm9tIGRvbSBkYXRhXG4vLyAgICAgICBjb25zdCBlbGVtWSA9IGVsZW0ub2Zmc2V0VG9wXG4vLyAgICAgICBjb25zdCBlbGVtWCA9IGVsZW0ub2Zmc2V0TGVmdFxuLy8gICAgICAgY29uc3QgZWxlbUhlaWdodCA9IGVsZW0ub2Zmc2V0SGVpZ2h0XG4vLyAgICAgICBjb25zdCBlbGVtV2lkdGggPSBlbGVtLm9mZnNldFdpZHRoXG4vLyAgICAgICBjb25zdCB3aW5kb3dTY3JvbGxZID0gd2luZG93LnBhZ2VZT2Zmc2V0Ly8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcFxuLy8gICAgICAgY29uc3Qgd2luZG93U2Nyb2xsWCA9IHdpbmRvdy5wYWdlWE9mZnNldC8vIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0XG4vLyAgICAgICBjb25zdCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbi8vICAgICAgIGNvbnN0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbi8vICAgICAgIC8vIGNoZWNrIHNjcm9sbFRvcCAvIExlZnQgYW5kIHdpbmRvdyBoZWlnaHQgLyB3aWR0aFxuLy8gICAgICAgLy8gY29uc29sZS5sb2coICdpZDogJyArIGVsZW0uYnN4RGF0YS5pZCArICcg4oCTIHRvcDogJyArIGVsZW1ZICsgJyDigJMgbGVmdDogJyArIGVsZW1YIClcblxuLy8gICAgICAgY29uc3QgYWJvdmVUaGVGb2xkID0gKCkgPT4ge1xuLy8gICAgICAgICByZXR1cm4gZWxlbVkgKyBlbGVtSGVpZ2h0IDw9IHdpbmRvd1Njcm9sbFlcbi8vICAgICAgIH1cbi8vICAgICAgIGNvbnN0IGJlbG93VGhlRm9sZCA9ICgpID0+IHtcbi8vICAgICAgICAgcmV0dXJuIGVsZW1ZID4gd2luZG93U2Nyb2xsWSArIHdpbmRvd0hlaWdodFxuLy8gICAgICAgfVxuLy8gICAgICAgY29uc3QgbGVmdFRoZUZvbGQgPSAoKSA9PiB7XG4vLyAgICAgICAgIHJldHVybiBlbGVtWCArIGVsZW1XaWR0aCA8PSB3aW5kb3dTY3JvbGxYXG4vLyAgICAgICB9XG4vLyAgICAgICBjb25zdCByaWdodFRoZUZvbGQgPSAoKSA9PiB7XG4vLyAgICAgICAgIHJldHVybiBlbGVtWCA+IHdpbmRvd1Njcm9sbFggKyB3aW5kb3dXaWR0aFxuLy8gICAgICAgfVxuLy8gICAgICAgaWYgKCBcbi8vICAgICAgICAgISAoIGFib3ZlVGhlRm9sZCgpIHx8IGJlbG93VGhlRm9sZCgpICkgXG4vLyAgICAgICAgICYmICEgKCByaWdodFRoZUZvbGQoKSB8fCByaWdodFRoZUZvbGQoKSApIFxuLy8gICAgICAgICAmJiB0eXBlb2YgZWxlbS5ic3hEYXRhICE9PSAndW5kZWZpbmVkJyBcbi8vICAgICAgICAgJiYgISBlbGVtLmJzeERhdGEuYXBwZWFyZWRcbi8vICAgICAgICkge1xuLy8gICAgICAgICBjb25zb2xlLmxvZyggJ2lkOiAnICsgZWxlbS5ic3hEYXRhLmlkICsgJyBvbiBzY3JlZW4nIClcbi8vICAgICAgICAgZWxlbS5ic3hEYXRhLmFwcGVhcmVkID0gdHJ1ZVxuXG4vLyAgICAgICAgIHNldFRpbWVvdXQoICgpID0+IHtcbi8vICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoIEFQUEVBUkVEX0NMQVNTIClcbi8vICAgICAgICAgfSwgQUREX0NMQVNTX0RFTEFZIClcbi8vICAgICAgIH1cbi8vICAgICB9XG5cbi8vICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Njcm9sbCcsIGFwcGVhclVwZGF0ZSApXG4vLyAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBhcHBlYXJVcGRhdGUgKVxuXG4vLyAgICAgLy8gY2hlY2sgaW5pdGlhbCBzdGF0ZVxuLy8gICAgIGFwcGVhclVwZGF0ZSgpXG4vLyAgIH1cbi8vIH1cblxuXG4vLyAvLyBpbml0XG5cbi8vIGlmICggRG9tRGF0YS5nZXRFbGVtcyggS0VZICkgKSB7XG4vLyAgIERvbURhdGEuZ2V0RWxlbXMoIEtFWSApLmZvckVhY2goICggZWxlbSApID0+IHtcbi8vICAgICBjb25zdCBjdXJyZW50RWxlbSA9IG5ldyBBcHBlYXJFZmZlY3RzKCBlbGVtIClcbi8vICAgICBjdXJyZW50RWxlbS5pbml0KClcbi8vICAgfSApXG4vLyB9XG5cbiIsImNsYXNzIEJyb3dzZXJBbmFseXRpY3Mge1xuICBpc0lvcygpIHtcbiAgICByZXR1cm4gL2lQYWR8aVBob25lfGlQb2QvLnRlc3QoIG5hdmlnYXRvci5wbGF0Zm9ybSApICYmICEgd2luZG93Lk1TU3RyZWFtXG4gIH1cbiAgaXNBbmRyb2lkKCkge1xuICAgIHJldHVybiAvKGFuZHJvaWQpL2kudGVzdCggbmF2aWdhdG9yLnVzZXJBZ2VudCApXG4gIH1cbiAgaXNXaW4oKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci5wbGF0Zm9ybS5pbmRleE9mKCAnV2luJyApID4gLTFcbiAgfVxuICBpc01vYmlsZUllKCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKCAvaWVtb2JpbGUvaSApXG4gIH1cbiAgaXNXaW5QaG9uZSgpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCggL1dpbmRvd3MgUGhvbmUvaSApXG4gIH1cbiAgZ2V0SW9zVmVyc2lvbigpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoXG4gICAgICAoICcnICsgKCAvQ1BVLipPUyAoWzAtOV9dezEsNX0pfChDUFUgbGlrZSkuKkFwcGxlV2ViS2l0LipNb2JpbGUvaS5leGVjKCBuYXZpZ2F0b3IudXNlckFnZW50ICkgfHwgWyAwLCcnIF0gKVsgMSBdIClcbiAgICAgIC5yZXBsYWNlKCAndW5kZWZpbmVkJywgJzNfMicgKS5yZXBsYWNlKCAnXycsICcuJyApLnJlcGxhY2UoIC9fL2csICcnIClcbiAgICApIHx8IGZhbHNlXG4gIH1cbiAgZ2V0SW9zRnVsbFZlcnNpb24oKSB7XG4gICAgcmV0dXJuICggJycgKyAoIC9DUFUuKk9TIChbMC05X117MSw5fSl8KENQVSBsaWtlKS4qQXBwbGVXZWJLaXQuKk1vYmlsZS9pLmV4ZWMoIG5hdmlnYXRvci51c2VyQWdlbnQgKSB8fCBbIDAsJycgXSApWyAxIF0gKVxuICAgICAgLnJlcGxhY2UoICd1bmRlZmluZWQnLCAnM18yJyApIHx8IGZhbHNlXG4gIH1cbiAgYWRkQm9keUNsYXNzTmFtZXMoKSB7XG4gICAgaWYgKCB0aGlzLmlzSW9zKCkgKSB7XG4gICAgICAvLyBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSArPSAnIGlzLWlvcyc7XG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoICdpcy1pb3MnIClcblxuICAgICAgLy8gZGV0ZWN0IHZlcnNpb24gKHJlcXVpcmVkIGZvciBmaXhlcylcbiAgICAgIGNvbnN0IGlvc01heFZlcnNpb24gPSAxMTtcbiAgICAgIGNvbnN0IGlvc1ZlcnNpb24gPSB0aGlzLmdldElvc1ZlcnNpb24oKVxuICAgICAgaWYgKCBpb3NWZXJzaW9uICE9PSBmYWxzZSApIHtcbiAgICAgICAgLy8gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgKz0gJyBpb3MnICsgaW9zVmVyc2lvbjtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCAnaW9zJyArIGlvc1ZlcnNpb24gKVxuICAgICAgICBmb3IgKCBsZXQgaSA9IGlvc1ZlcnNpb247IGkgPD0gaW9zTWF4VmVyc2lvbjsgaSsrICkge1xuICAgICAgICAgIC8vIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lICs9ICcgaW9zbHRlJyArIGk7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCAnaW9zbHRlJyArIGkgKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG4gICAgZWxzZSBpZiAoIHRoaXMuaXNBbmRyb2lkKCkgKSB7XG4gICAgICAvLyBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSArPSAnIGlzLWFuZHJvaWQnO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCAnaXMtYW5kcm9pZCcgKVxuICAgIH1cbiAgICBlbHNlIGlmICggdGhpcy5pc1dpbigpICkge1xuICAgICAgLy8gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgKz0gJyBpcy13aW4nO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCAnaXMtd2luJyApXG4gICAgICBpZiAoIHRoaXMuaXNNb2JpbGVJZSgpICkge1xuICAgICAgICAvLyBkb2N1bWVudC5ib2R5LmNsYXNzTmFtZSArPSAnIGlzLW1vYmlsZS1pZSc7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCggJ2lzLW1vYmlsZS1pZScgKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIHRoaXMuaXNXaW5QaG9uZSgpICkge1xuICAgICAgLy8gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgKz0gJyBpcy13aW4tcGhvbmUnO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCAnaXMtd2luLXBob25lJyApXG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGRldGVjdEllID0gKCkgPT4ge1xuICAgICAgY29uc3QgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAgIGNvbnN0IG1zaWUgPSB1YS5pbmRleE9mKCAnTVNJRSAnICk7XG4gICAgICBpZiAoIG1zaWUgPiAwICkge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQoIHVhLnN1YnN0cmluZyggbXNpZSArIDUsIHVhLmluZGV4T2YoICcuJywgbXNpZSApICksIDEwICk7XG4gICAgICB9XG4gICAgICBjb25zdCB0cmlkZW50ID0gdWEuaW5kZXhPZiggJ1RyaWRlbnQvJyApO1xuICAgICAgaWYgKCB0cmlkZW50ID4gMCApIHtcbiAgICAgICAgY29uc3QgcnYgPSB1YS5pbmRleE9mKCAncnY6JyApO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQoIHVhLnN1YnN0cmluZyggcnYgKyAzLCB1YS5pbmRleE9mKCAnLicsIHJ2ICkgKSwgMTAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVkZ2UgPSB1YS5pbmRleE9mKCAnRWRnZS8nICk7XG4gICAgICBpZiAoIGVkZ2UgPiAwICkge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQoIHVhLnN1YnN0cmluZyggZWRnZSArIDUsIHVhLmluZGV4T2YoICcuJywgZWRnZSApICksIDEwICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gZGV0ZWN0IGllIGd0IDlcbiAgICBjb25zdCBpZU1heFZlcnNpb24gPSAxNDtcbiAgICBjb25zdCBpZVZlcnNpb24gPSBkZXRlY3RJZSgpO1xuICAgIGNvbnN0IGlzSWUgPSAoIGllVmVyc2lvbiAhPT0gZmFsc2UgKTtcbiAgICBpZiAoIGlzSWUgJiYgaWVWZXJzaW9uID4gOSApIHtcbiAgICAgIC8vIGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lICs9ICcgaWUgaWUnICsgaWVWZXJzaW9uO1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCAnaWUnIClcbiAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCggJ2llJyArIGllVmVyc2lvbiApXG4gICAgICBmb3IgKCBsZXQgaSA9IGllVmVyc2lvbjsgaSA8PSBpZU1heFZlcnNpb247IGkrKyApIHtcbiAgICAgICAgLy8gZG9jdW1lbnQuYm9keS5jbGFzc05hbWUgKz0gJyBpZWx0ZScgKyBpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoICdpZWx0ZScgKyBpIClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoICdicm93c2VyLXRlc3RlZCcgKVxuICAgIGNvbnNvbGUubG9nKCAnYnJvd3Nlci10ZXN0ZWQnIClcbiAgfVxufVxuXG5cbi8vIGluaXRcbmNvbnN0IHRlc3QgPSBuZXcgQnJvd3NlckFuYWx5dGljc1xudGVzdC5hZGRCb2R5Q2xhc3NOYW1lcygpXG5cblxuIiwiY29uc3QgZWxlbU1hcCA9ICggKCkgPT4ge1xuICBjb25zdCBlbGVtU3RvcmFnZSA9IHt9XG4gIGxldCBpZCA9IDBcbiAgcmV0dXJuIHtcbiAgICBzZXQoIGVsZW0sIGtleSApIHtcbiAgICAgIGlmICggdHlwZW9mIGVsZW0uYnN4RGF0YSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIC8vIGFkZCBlbGVtIGlmIG5vdCBhbHJlYWR5IGV4aXN0c1xuICAgICAgICAvLyBhZGQgZGF0YVxuICAgICAgICBlbGVtLmJzeERhdGEgPSB7XG4gICAgICAgICAga2V5LFxuICAgICAgICAgIGlkXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2YgZWxlbVN0b3JhZ2VbIGtleSBdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAvLyBhZGQgbGlzdCBpZiBub3QgYWxyZWFkeSBleGlzdHNcbiAgICAgICAgICBlbGVtU3RvcmFnZVsga2V5IF0gPSBbXVxuICAgICAgICB9XG4gICAgICAgIC8vIGFkZCB0byBsaXN0XG4gICAgICAgIGVsZW1TdG9yYWdlWyBrZXkgXS5wdXNoKCBlbGVtIClcbiAgICAgICAgaWQrK1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0KCBrZXkgKSB7XG4gICAgICBpZiAoICEga2V5IHx8IHR5cGVvZiBlbGVtU3RvcmFnZVsga2V5IF0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgICAgcmV0dXJuIGVsZW1TdG9yYWdlWyBrZXkgXVxuICAgIH0sXG4gICAgcmVtb3ZlKCBlbGVtLCBrZXkgKSB7XG4gICAgICBpZiAoIHR5cGVvZiBlbGVtLmJzeERhdGEgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGlmICggZWxlbS5ic3hEYXRhLmtleSA9PT0ga2V5ICkge1xuICAgICAgICAvLyBkZWxldGUgZWxlbSBkYXRhXG4gICAgICAgIGRlbGV0ZSBlbGVtLmJzeERhdGFcbiAgICAgICAgLy8gcmVtb3ZlIGZyb20gbGlzdFxuICAgICAgICBjb25zdCBjdXJyZW50RWxlbXMgPSBlbGVtU3RvcmFnZVsga2V5IF1cbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgY3VycmVudEVsZW1zLmxlbmd0aDsgaSsrICkgeyBcbiAgICAgICAgICBpZiAoIGN1cnJlbnRFbGVtc1sgaSBdID09PSBlbGVtICkgeyBcbiAgICAgICAgICAgICAgY3VycmVudEVsZW1zLnNwbGljZSggaSwgMSApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbGVtU3RvcmFnZVsga2V5IF0gPSBjdXJyZW50RWxlbXNcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0gKSgpXG5cbmNvbnN0IERvbURhdGEgPSB7XG4gIGFkZEVsZW0oIGluc3RhbmNlLCBrZXkgKSB7XG4gICAgZWxlbU1hcC5zZXQoIGluc3RhbmNlLCBrZXkgKVxuICB9LFxuICBnZXRFbGVtcygga2V5ICkge1xuICAgIHJldHVybiBlbGVtTWFwLmdldCgga2V5IClcbiAgfSxcbiAgcmVtb3ZlRWxlbSggaW5zdGFuY2UsIGtleSApIHtcbiAgICBlbGVtTWFwLnJlbW92ZSggaW5zdGFuY2UsIGtleSApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRG9tRGF0YVxuXG4iLCJpbXBvcnQgRG9tRGF0YSBmcm9tICcuL2RvbS1kYXRhJ1xuaW1wb3J0IFNlbGVjdG9ycyBmcm9tICcuLy4uL3V0aWxpdGllcy9zZWxlY3RvcnMnXG5cblxuY29uc3QgRlVOQ1RJT05fQVRUUiA9IFNlbGVjdG9ycy5mdW5jdGlvbkF0dHJcblxuY29uc3QgZnVuY3Rpb25FbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdbJyArIEZVTkNUSU9OX0FUVFIgKyAnXScgKVxuXG4vLyBhZGQgdG8gRG9tRGF0YVxuZnVuY3Rpb25FbGVtcy5mb3JFYWNoKCBlbGVtID0+IHtcbiAgY29uc3Qga2V5ID0gZWxlbS5nZXRBdHRyaWJ1dGUoIEZVTkNUSU9OX0FUVFIgKVxuICBEb21EYXRhLmFkZEVsZW0oIGVsZW0sIGtleSApXG59IClcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb25FbGVtc1xuXG4iLCIvLyBJbXBvcnRzXG5cblxuLy8gaW1wb3J0IERhdGFDYXRlZ29yeSBmcm9tICcuL3Rlc3QvdGVzdC1jbGFzcy5qcydcbi8vIGltcG9ydCBUZXN0IGZyb20gJy4vdGVzdC5qcydcblxuLy8gaW1wb3J0IERvbURhdGEgZnJvbSAnLi9kb20vZG9tLWRhdGEnXG4vLyBpbXBvcnQgRG9tRm4gZnJvbSAnLi91dGlsaXRpZXMvZG9tLWZ1bmN0aW9ucydcbi8vIGltcG9ydCBTZWxlY3RvcnMgZnJvbSAnLi91dGlsaXRpZXMvc2VsZWN0b3JzJ1xuXG5cbi8vIGNvbnN0IEZVTkNUSU9OX0FUVFIgPSBTZWxlY3RvcnMuZnVuY3Rpb25BdHRyKClcblxuLy8gVEVTVCDigJMgVE9ETzogcmVtb3ZlXG4vLyB0ZXN0IGVsZW0gZGF0YVxuLy8gY29uc3QgZnVuY3Rpb25FbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdbJyArIEZVTkNUSU9OX0FUVFIgKyAnXScgKVxuXG4vLyAkKCBmdW5jdGlvbkVsZW1zICkuYWRkQ2xhc3MoICdURVNUJyApXG5cblxuLy8gYWRkIHRvIERvbURhdGFcbi8vIGZ1bmN0aW9uRWxlbXMuZm9yRWFjaCggZWxlbSA9PiB7XG4vLyAgIGNvbnN0IGtleSA9IGVsZW0uZ2V0QXR0cmlidXRlKCBGVU5DVElPTl9BVFRSIClcbi8vICAgLy8gY29uc29sZS5sb2coICdrZXk6ICcgKyBrZXkgKVxuLy8gICBEb21EYXRhLmFkZEVsZW0oIGVsZW0sIGtleSApXG5cbi8vICAgLy8gVEVTVCDigJMgVE9ETzogcmVtb3ZlIOKAkyBzaG93IGlkIG9uIGRvdWJsZWNsaWNrXG4vLyAvLyAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lciggJ2RibGNsaWNrJywgKCBldmVudCApID0+IHtcbi8vIC8vICAgICBhbGVydCggYGlkOiAkeyBldmVudC50YXJnZXQuYnN4RGF0YS5pZCB9XG4vLyAvLyBrZXk6ICckeyBldmVudC50YXJnZXQuYnN4RGF0YS5rZXkgfSdgIClcbi8vIC8vICAgfSApXG4vLyB9IClcblxuXG4vLyBmaWxlc1xuXG4vLyBpbXBvcnQgJy4vdGVzdC9pbmRleC5qcyc7XG5pbXBvcnQgJy4vLi4vdGVzdC9pbmRleC5qcyc7XG5cbi8vIGltcG9ydCAnLi91dGlsaXRpZXMvdXRpbHMuanMnO1xuaW1wb3J0ICcuL2Jyb3dzZXItYW5hbHl0aWNzL2luZGV4LmpzJztcbmltcG9ydCAnLi8uLi9hY2NvcmRpb24vaW5kZXguanMnO1xuaW1wb3J0ICcuLy4uL2FwcGVhci1lZmZlY3RzL2luZGV4LmpzJztcblxuXG5cblxuLy8gY29uc3QgS0VZID0gJ2FjYydcbi8vIGNvbnN0IERFRkFVTFRfVEFSR0VUX09QRU5FRF9DTEFTUyA9ICdvcGVuJ1xuLy8gY29uc3QgREVGQVVMVF9UUklHR0VSX09QRU5FRF9DTEFTUyA9ICdvcGVuJ1xuLy8gY29uc3QgREVGQVVMVF9BTExPV19NVUxUSV9PUEVOID0gdHJ1ZVxuXG4vLyAvLyBUT0RPOiBjaGlsZE5vZGVzLCBnZXQgaGVpZ2h0XG5cbi8vIERvbURhdGEuZ2V0RWxlbXMoIEtFWSApLmZvckVhY2goICggdHJpZ2dlciApID0+IHtcblxuLy8gICAvLyBnZXQgYWNjb3JkaW9uXG4vLyAgIGNvbnN0IGFjYyA9IHRyaWdnZXIuY2xvc2VzdCggJ1tkYXRhLWFjY10nIClcblxuLy8gICAvLyBnZXQgY29uZmlnXG4vLyAgIGNvbnN0IGNvbmYgPSBEb21Gbi5nZXRDb25maWdGcm9tQXR0ciggYWNjLCBLRVkgKVxuLy8gICBjb25zb2xlLmxvZyggJ2NvbmY6ICcgKyBKU09OLnN0cmluZ2lmeSggY29uZiApIClcbi8vICAgY29uc3QgQUxMT1dfTVVMVElfT1BFTiA9ICggY29uZiAhPSBudWxsICYmIHR5cGVvZiBjb25mLm11bHRpcGxlT3BlbiApICE9PSAndW5kZWZpbmVkJyA/IGNvbmYubXVsdGlwbGVPcGVuIDogREVGQVVMVF9BTExPV19NVUxUSV9PUEVOXG4vLyAgIGNvbnN0IFRBUkdFVF9PUEVORURfQ0xBU1MgPSAoIGNvbmYgIT0gbnVsbCAmJiB0eXBlb2YgY29uZi50YXJnZXRPcGVuZWRDbGFzcyApICE9PSAndW5kZWZpbmVkJyA/IGNvbmYudGFyZ2V0T3BlbmVkQ2xhc3MgOiBERUZBVUxUX1RBUkdFVF9PUEVORURfQ0xBU1Ncbi8vICAgY29uc3QgVFJJR0dFUl9PUEVORURfQ0xBU1MgPSAoIGNvbmYgIT0gbnVsbCAmJiB0eXBlb2YgY29uZi50cmlnZ2VyT3BlbmVkQ2xhc3MgKSAhPT0gJ3VuZGVmaW5lZCcgPyBjb25mLnRyaWdnZXJPcGVuZWRDbGFzcyA6IERFRkFVTFRfVFJJR0dFUl9PUEVORURfQ0xBU1NcblxuLy8gICBjb25zdCB0cmFuc2l0aW9uVG9sZXJhbmNlID0gMTBcblxuLy8gICAvLyBpbml0XG4vLyAgIGlmICggISBBTExPV19NVUxUSV9PUEVOICYmIHRyaWdnZXIuZ2V0QXR0cmlidXRlKCAnYXJpYS1leHBhbmRlZCcgKSA9PT0gJ3RydWUnICkge1xuLy8gICAgIC8vIHJlbWVtYmVyIGluaXRpYWwgb3BlbiBzdGF0dXMgaXRlbVxuLy8gICAgIGFjYy5ic3hEYXRhID0geyByZWNlbnRUcmlnZ2VyOiB0cmlnZ2VyIH1cbi8vICAgICAvLyBzZXQgZGlzYWJsZWQgKG1pZ2h0IG5vIGJlIGFscmVhZHkgc2V0KVxuLy8gICAgIHRyaWdnZXIuc2V0QXR0cmlidXRlKCAnYXJpYS1kaXNhYmxlZCcsICd0cnVlJyApXG4vLyAgIH1cblxuLy8gICBjb25zdCBnZXRUYXJnZXRGcm9tVHJpZ2dlciA9ICggdHJpZ2dlciApID0+IHtcbi8vICAgICBjb25zdCBpdGVtID0gdHJpZ2dlci5jbG9zZXN0KCAnW2RhdGEtYWNjLWl0bV0nIClcbi8vICAgICBjb25zdCB0YXJnZXRJZCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKCAnYXJpYS1jb250cm9scycgKVxuLy8gICAgIHJldHVybiBpdGVtLnF1ZXJ5U2VsZWN0b3IoIGAjJHt0YXJnZXRJZH1gIClcbi8vICAgfVxuLy8gICBjb25zdCBnZXRUcmlnZ2VyRnJvbUV2ZW50ID0gKCBldmVudCApID0+IHtcbi8vICAgICByZXR1cm4gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSggRlVOQ1RJT05fQVRUUiApICE9IG51bGwgPyBldmVudC50YXJnZXQgOiBldmVudC50YXJnZXQuY2xvc2VzdCggJ1snICsgRlVOQ1RJT05fQVRUUiArICddJyApXG4vLyAgIH1cbi8vICAgY29uc3QgY2xvc2UgPSAoIHRyaWdnZXIgKSA9PiB7XG4vLyAgICAgaWYgKCAhIHRyaWdnZXIuaGFzQXR0cmlidXRlKCAnYXJpYS1kaXNhYmxlZCcgKSB8fCB0cmlnZ2VyLmdldEF0dHJpYnV0ZSggJ2FyaWEtZGlzYWJsZWQnICkgPT09ICdmYWxzZScgKSB7XG4vLyAgICAgICB0cmlnZ2VyLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnIClcbi8vICAgICAgIHRyaWdnZXIuY2xhc3NMaXN0LnJlbW92ZSggVFJJR0dFUl9PUEVORURfQ0xBU1MgKVxuLy8gICAgICAgY29uc3QgdGFyZ2V0ID0gZ2V0VGFyZ2V0RnJvbVRyaWdnZXIoIHRyaWdnZXIgKVxuLy8gICAgICAgY29uc3QgdGFyZ2V0SW5uZXIgPSB0YXJnZXQucXVlcnlTZWxlY3RvciggJ1thY2MtY250LWlucl0nIClcbi8vICAgICAgIGNvbnN0IHRhcmdldElubmVySGVpZ2h0ID0gdGFyZ2V0SW5uZXIub2Zmc2V0SGVpZ2h0XG4vLyAgICAgICAvLyBzZXQgaGVpZ2h0IGJlZm9yZSByZW1vdmUgb3BlbmVkIGNsYXNzXG4vLyAgICAgICB0YXJnZXQuc3R5bGUuaGVpZ2h0ID0gdGFyZ2V0SW5uZXJIZWlnaHQgKyAncHgnXG4vLyAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XG4vLyAgICAgICAgIC8vIHJlbW92ZSBvcGVuZWQgY2xhc3Ncbi8vICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoIFRBUkdFVF9PUEVORURfQ0xBU1MgKVxuLy8gICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XG4vLyAgICAgICAgICAgLy8gcmVtb3ZlIGhlaWdodCB0byBpbml0IHRyYW5zaXRpb25cbi8vICAgICAgICAgICB0YXJnZXQuc3R5bGUuaGVpZ2h0ID0gJydcbi8vICAgICAgICAgfSwgdHJhbnNpdGlvblRvbGVyYW5jZSApXG4vLyAgICAgICB9LCB0cmFuc2l0aW9uVG9sZXJhbmNlIClcbi8vICAgICB9XG4vLyAgIH1cbi8vICAgY29uc3Qgb3BlbiA9ICggdHJpZ2dlciApID0+IHtcbi8vICAgICB0cmlnZ2VyLnNldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKVxuLy8gICAgIHRyaWdnZXIuY2xhc3NMaXN0LmFkZCggVFJJR0dFUl9PUEVORURfQ0xBU1MgKVxuLy8gICAgIGNvbnN0IHRhcmdldCA9IGdldFRhcmdldEZyb21UcmlnZ2VyKCB0cmlnZ2VyIClcbi8vICAgICBjb25zdCB0YXJnZXRJbm5lciA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKCAnW2FjYy1jbnQtaW5yXScgKVxuLy8gICAgIGNvbnN0IHRhcmdldElubmVySGVpZ2h0ID0gdGFyZ2V0SW5uZXIub2Zmc2V0SGVpZ2h0XG4vLyAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoIFRBUkdFVF9PUEVORURfQ0xBU1MgKVxuLy8gICAgIHRhcmdldC5zdHlsZS5oZWlnaHQgPSB0YXJnZXRJbm5lckhlaWdodCArICdweCdcbi8vICAgICAvLyByZW1vdmUgaGVpZ2h0IGFmdGVyIHRyYW5zaXRpb24gZW5kZWRcbi8vICAgICBjb25zdCB0cmFuc2l0aW9uRHVyYXRpb24gPSBEb21Gbi5nZXRUcmFuc2l0aW9uRHVyYXRpb24oIHRhcmdldCApICsgdHJhbnNpdGlvblRvbGVyYW5jZVxuLy8gICAgIHNldFRpbWVvdXQoICgpID0+IHtcbi8vICAgICAgIHRhcmdldC5zdHlsZS5oZWlnaHQgPSAnJ1xuLy8gICAgIH0sIHRyYW5zaXRpb25EdXJhdGlvbiApXG5cbi8vICAgICBpZiAoICEgQUxMT1dfTVVMVElfT1BFTiApIHtcbi8vICAgICAgIC8vIGRpc2FibGUgY2xpY2tlZFxuLy8gICAgICAgdHJpZ2dlci5zZXRBdHRyaWJ1dGUoICdhcmlhLWRpc2FibGVkJywgJ3RydWUnIClcbi8vICAgICAgIGlmICggdHlwZW9mIGFjYy5ic3hEYXRhICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgYWNjLmJzeERhdGEucmVjZW50VHJpZ2dlciAhPT0gJ3VuZGVmaW5lZCcgKSB7XG4vLyAgICAgICAgIC8vIHJlbW92ZSBkaXNhYmxlZCBmcm9tIHJlY2VudFxuLy8gICAgICAgICBhY2MuYnN4RGF0YS5yZWNlbnRUcmlnZ2VyLnJlbW92ZUF0dHJpYnV0ZSggJ2FyaWEtZGlzYWJsZWQnIClcbi8vICAgICAgICAgLy8gY2xvc2Ugb3BlbiAobm90IGNsaWNrZWQpIGl0ZW1cbi8vICAgICAgICAgY2xvc2UoIGFjYy5ic3hEYXRhLnJlY2VudFRyaWdnZXIgKVxuLy8gICAgICAgfVxuLy8gICAgICAgLy8gcmVtZW1iZXIgY2xpY2tlZCBpdGVtXG4vLyAgICAgICBhY2MuYnN4RGF0YSA9IHsgcmVjZW50VHJpZ2dlcjogdHJpZ2dlciB9XG4vLyAgICAgfVxuLy8gICB9XG5cbi8vICAgLy8gc2V0IGV2ZW50IGxpc3RlbmVyXG4vLyAgIC8vIC4ke3RyaWdnZXIuYnN4RGF0YS5rZXl9LiR7dHJpZ2dlci5ic3hEYXRhLmlkfVxuLy8gICB0cmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsICggZXZlbnQgKSA9PiB7XG4vLyAgICAgLy8gY29uc29sZS5sb2coICdjbGljaycgKVxuLy8gICAgIC8vIGV2ZW50IHRhcmdldCBtaWdodCBiZSB0cmlnZ2VyIGludHNlbGYgb3IgdHJpZ2dlcnMgY2hpbGRcbi8vICAgICBjb25zdCB0cmlnZ2VyID0gZ2V0VHJpZ2dlckZyb21FdmVudCggZXZlbnQgKVxuXG4vLyAgICAgLy8gZGVjaWRlIHdldGhlciBvcGVuIG9yIGNsb3NlXG4vLyAgICAgaWYgKCB0cmlnZ2VyLmdldEF0dHJpYnV0ZSggJ2FyaWEtZXhwYW5kZWQnICkgPT09ICdmYWxzZScgKSB7XG4vLyAgICAgICBvcGVuKCB0cmlnZ2VyIClcbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgY2xvc2UoIHRyaWdnZXIgKVxuLy8gICAgIH1cblxuLy8gICB9IClcblxuLy8gfSApXG5cblxuXG5cblxuXG5cbi8vIGNvbnN0IHRlc3RDbGFzcyA9ICdIRUxMTy1URVNUJ1xuXG4vLyAvLyBnZXQgZnJvbSBEb21EYXRhIGJ5IGtleVxuLy8gRG9tRGF0YS5nZXRFbGVtcyggJ2tleV8xJyApLmZvckVhY2goICggZWxlbSApID0+IHtcbi8vICAgLy8gRG9tRm4uYWRkQ2xhc3MoIGVsZW0sIHRlc3RDbGFzcyApXG4vLyAgIGVsZW0uY2xhc3NMaXN0LmFkZCggdGVzdENsYXNzIClcbi8vIH0gKVxuXG4vLyAvLyBURVNUIOKAkyBUT0RPOiByZW1vdmUg4oCTIHJlbW92ZSBjbGFzc1xuLy8gRG9tRGF0YS5nZXRFbGVtcyggJ2tleV8xJyApLmZvckVhY2goICggZWxlbSApID0+IHtcbi8vICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoIGV2ZW50ICkgPT4ge1xuLy8gICAgIC8vIERvbUZuLnJlbW92ZUNsYXNzKCBldmVudC50YXJnZXQsIHRlc3RDbGFzcyApXG4vLyAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoIHRlc3RDbGFzcyApXG4vLyAgIH0gKVxuLy8gfSApXG5cbi8vIGdldCBmcm9tIERvbURhdGEgYnkga2V5XG4vLyBEb21EYXRhLmdldEVsZW1zKCAna2V5XzUnICkuZm9yRWFjaCggKCBlbGVtICkgPT4ge1xuLy8gICBEb21Gbi5hZGRDbGFzcyggZWxlbSwgdGVzdENsYXNzICsgJy01JyApXG4vLyB9IClcblxuXG5cblxuXG4vLyBmaWxlIGltcG9ydHNcblxuLy8gaW1wb3J0ICcuL2Fub3RoZXItZmlsZS5qcyc7XG5cblxuLy8gYWxsIHRoZSByZXN0XG5cbi8vIGNvbnN0IHRlc3QgPSAndGVzdCc7XG5cbi8vIGNvbnNvbGUubG9nKCBgSGVsbG8gZnJvbSAke3Rlc3R9IDopYCApO1xuXG5cblxuXG5cbi8vIGNvbnN0IGZ1bmN0aW9uRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnW2RhdGEtYnN4XScgKTsgXG5cbi8vIGZ1bmN0aW9uRWxlbXMuZm9yRWFjaCggKCBpdGVtLCBpbmRleCApID0+IHtcbi8vICBjb25zb2xlLmxvZyggaW5kZXggKTtcbi8vIH0gKTtcblxuIiwiaW1wb3J0IFNlbGVjdG9ycyBmcm9tICcuLy4uL3V0aWxpdGllcy9zZWxlY3RvcnMnXG5cblxuY29uc3QgRlVOQ1RJT05fQVRUUiA9IFNlbGVjdG9ycy5mdW5jdGlvbkF0dHJcblxuXG5jb25zdCBnZXRDb25maWdGcm9tQXR0ciA9ICggZWxlbSwga2V5ICkgPT4ge1xuICBpZiAoICEgZWxlbSApIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGxldCBjb25mXG4gIGlmICgga2V5ICkge1xuICAgIGNvbmYgPSBlbGVtLmdldEF0dHJpYnV0ZSggYGRhdGEtJHtrZXl9LWNvbmZgIClcbiAgfVxuICBlbHNlIHtcbiAgICBjb25mID0gZWxlbS5nZXRBdHRyaWJ1dGUoIGBkYXRhLWNvbmZgIClcbiAgfVxuXG4gIGlmICggdHlwZW9mIGNvbmYgIT09ICd1bmRlZmluZWQnICYmIGNvbmYgIT0gbnVsbCAgKSB7XG4gICAgcmV0dXJuICggbmV3IEZ1bmN0aW9uKCAncmV0dXJuICcgKyBjb25mICkgKSgpXG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIHt9XG4gIH1cbn1cblxuY29uc3QgZ2V0VGFyZ2V0QnlBcmlhQ29udHJvbHMgPSAoIHRyaWdnZXIsIGNsb3Nlc3QgKSA9PiB7XG4gIGNvbnN0IHdyYXBwZXIgPSB0eXBlb2YgY2xvc2VzdCAhPT0gJ3VuZGVmaW5lZCcgPyBjbG9zZXN0IDogZG9jdW1lbnRcbiAgY29uc3QgdGFyZ2V0SWQgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZSggJ2FyaWEtY29udHJvbHMnIClcbiAgcmV0dXJuIHdyYXBwZXIucXVlcnlTZWxlY3RvciggYCMke3RhcmdldElkfWAgKVxufVxuXG5jb25zdCBnZXRUcmFuc2l0aW9uRHVyYXRpb24gPSAoIGVsZW0gKSA9PiB7XG4gIGxldCB7IHRyYW5zaXRpb25EdXJhdGlvbiB9ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoIGVsZW0gKVxuICBjb25zdCBmbG9hdFRyYW5zaXRpb25EdXJhdGlvbiA9IE51bWJlci5wYXJzZUZsb2F0KCB0cmFuc2l0aW9uRHVyYXRpb24gKVxuICBpZiAoICEgZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gKSB7XG4gICAgZmxvYXRUcmFuc2l0aW9uRHVyYXRpb24gPSAwXG4gIH1cbiAgcmV0dXJuIGZsb2F0VHJhbnNpdGlvbkR1cmF0aW9uICogMTAwMFxufVxuXG5jb25zdCBnZXRUcmlnZ2VyRnJvbUV2ZW50ID0gKCBldmVudCApID0+IHtcbiAgcmV0dXJuIGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoIEZVTkNUSU9OX0FUVFIgKSAhPSBudWxsID8gZXZlbnQudGFyZ2V0IDogZXZlbnQudGFyZ2V0LmNsb3Nlc3QoICdbJyArIEZVTkNUSU9OX0FUVFIgKyAnXScgKVxufVxuXG5jb25zdCBhZGRDbGFzc05hbWVzID0gKCBlbGVtLCBjbGFzc05hbWVzICkgPT4ge1xuICBpZiAoIGNsYXNzTmFtZXMuaW5kZXhPZiggJyAnICkgKSB7XG4gICAgY29uc3QgY2xhc3NOYW1lTGlzdCA9IGNsYXNzTmFtZXMuc3BsaXQoICcgJyApXG4gICAgY2xhc3NOYW1lTGlzdC5mb3JFYWNoKCAoIGNsYXNzTmFtZSApID0+IHtcbiAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZCggY2xhc3NOYW1lIClcbiAgICB9IClcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtLmNsYXNzTGlzdC5hZGQoIGNsYXNzTmFtZXMgKVxuICB9XG59XG5cbmNvbnN0IHJlbW92ZUNsYXNzTmFtZXMgPSAoIGVsZW0sIGNsYXNzTmFtZXMgKSA9PiB7XG4gIGlmICggY2xhc3NOYW1lcy5pbmRleE9mKCAnICcgKSApIHtcbiAgICBjb25zdCBjbGFzc05hbWVMaXN0ID0gY2xhc3NOYW1lcy5zcGxpdCggJyAnIClcbiAgICBjbGFzc05hbWVMaXN0LmZvckVhY2goICggY2xhc3NOYW1lICkgPT4ge1xuICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCBjbGFzc05hbWUgKVxuICAgIH0gKVxuICB9XG4gIGVsc2Uge1xuICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZSggY2xhc3NOYW1lcyApXG4gIH1cbn1cblxuY29uc3QgdHJpZ2dlckV2ZW50ID0gKCBlbGVtLCBldmVudE5hbWUgKSA9PiB7XG4gICAgY29uc3QgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCggJ0V2ZW50JyApXG4gICAgZXZlbnQuaW5pdEV2ZW50KCBldmVudE5hbWUsIHRydWUsIHRydWUpXG4gICAgZWxlbS5kaXNwYXRjaEV2ZW50KCBldmVudCApXG59XG5cblxuLy8gY2hlY2sgaWYgaW5uZXJFbGVtIGlzIHBvc2l0aW9uZXMgaW5zaWRlIG91dGVyRWxlbVxuY29uc3QgaXNQb3NpdGlvbmVkSW5zaWRlID0gKCBvdXRlckVsZW0sIGlubmVyRWxlbSApID0+IHtcblxuICBjb25zb2xlLmxvZyggJy0tJyApXG4gIGNvbnNvbGUubG9nKCAnaW5uZXJFbGVtLm9mZnNldExlZnQgPj0gb3V0ZXJFbGVtLm9mZnNldExlZnQ6ICcgKyAoIGlubmVyRWxlbS5vZmZzZXRMZWZ0ID49IG91dGVyRWxlbS5vZmZzZXRMZWZ0ID8gJ3RydWUnIDogJ2ZhbHNlJyApIClcbiAgY29uc29sZS5sb2coICcoIGlubmVyRWxlbS5vZmZzZXRMZWZ0ICsgaW5uZXJFbGVtLm9mZnNldFdpZHRoICkgPD0gKCAvKiBvdXRlckVsZW0ub2Zmc2V0TGVmdCArICovIG91dGVyRWxlbS5vZmZzZXRXaWR0aCApOiAnICsgKCAoIGlubmVyRWxlbS5vZmZzZXRMZWZ0ICsgaW5uZXJFbGVtLm9mZnNldFdpZHRoICkgPD0gKCAvKiBvdXRlckVsZW0ub2Zmc2V0TGVmdCArICovIG91dGVyRWxlbS5vZmZzZXRXaWR0aCApID8gJ3RydWUnIDogJ2ZhbHNlJyApIClcbiAgY29uc29sZS5sb2coICdpbm5lckVsZW0ub2Zmc2V0VG9wID49IG91dGVyRWxlbS5vZmZzZXRUb3A6ICcgKyAoIGlubmVyRWxlbS5vZmZzZXRUb3AgPj0gb3V0ZXJFbGVtLm9mZnNldFRvcCA/ICd0cnVlJyA6ICdmYWxzZScgKSApXG4gIGNvbnNvbGUubG9nKCAnKCBpbm5lckVsZW0ub2Zmc2V0VG9wICsgaW5uZXJFbGVtLm9mZnNldEhlaWdodCApIDw9ICggLyogb3V0ZXJFbGVtLm9mZnNldFRvcCArICovIG91dGVyRWxlbS5vZmZzZXRIZWlnaHQgKTogJyArICggKCBpbm5lckVsZW0ub2Zmc2V0VG9wICsgaW5uZXJFbGVtLm9mZnNldEhlaWdodCApIDw9ICggLyogb3V0ZXJFbGVtLm9mZnNldFRvcCArICovIG91dGVyRWxlbS5vZmZzZXRIZWlnaHQgKSA/ICd0cnVlJyA6ICdmYWxzZScgKSApXG5cbiAgcmV0dXJuICggXG4gICAgaW5uZXJFbGVtLm9mZnNldExlZnQgPj0gb3V0ZXJFbGVtLm9mZnNldExlZnRcbiAgICAmJiAoIGlubmVyRWxlbS5vZmZzZXRMZWZ0ICsgaW5uZXJFbGVtLm9mZnNldFdpZHRoICkgPD0gKCAvKiBvdXRlckVsZW0ub2Zmc2V0TGVmdCArICovIG91dGVyRWxlbS5vZmZzZXRXaWR0aCApXG4gICAgJiYgaW5uZXJFbGVtLm9mZnNldFRvcCA+PSBvdXRlckVsZW0ub2Zmc2V0VG9wXG4gICAgJiYgKCBpbm5lckVsZW0ub2Zmc2V0VG9wICsgaW5uZXJFbGVtLm9mZnNldEhlaWdodCApIDw9ICggLyogb3V0ZXJFbGVtLm9mZnNldFRvcCArICovIG91dGVyRWxlbS5vZmZzZXRIZWlnaHQgKVxuICApXG59XG5cbmNvbnN0IERvbUZuID0ge1xuICBnZXRDb25maWdGcm9tQXR0cixcbiAgZ2V0VGFyZ2V0QnlBcmlhQ29udHJvbHMsXG4gIGdldFRyYW5zaXRpb25EdXJhdGlvbixcbiAgZ2V0VHJpZ2dlckZyb21FdmVudCxcbiAgYWRkQ2xhc3NOYW1lcyxcbiAgcmVtb3ZlQ2xhc3NOYW1lcyxcbiAgdHJpZ2dlckV2ZW50LFxuICBpc1Bvc2l0aW9uZWRJbnNpZGUsXG59XG5cbmV4cG9ydCBkZWZhdWx0IERvbUZuIiwiXG5jb25zdCBTZWxlY3RvcnMgPSB7XG4gIGZ1bmN0aW9uQXR0cjogJ2RhdGEtYnN4JyxcbiAgdGFyZ2V0QXR0cjogJ2RhdGEtYnN4LXRnJyxcbiAgZm9jdXNzYWJsZUVsZW1lbnRzOiAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIFt0YWJpbmRleD1cIjBcIl0nLFxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RvcnMiLCJpbXBvcnQgJy4vaXMtcG9zaXRpb25lZC1pbnNpZGUvaW5kZXguanMnOyIsIlxuLy8gaW5uZXIgZWxlbSBwb3NpdGlvbmVkIGluc2lkZSBvdXRlciBlbGVtXG5pbXBvcnQgRG9tRGF0YSBmcm9tICcuLy4uLy4uL2pzL2RvbS9kb20tZGF0YSdcbmltcG9ydCBNYWtlRm5FbGVtcyBmcm9tICcuLy4uLy4uL2pzL2RvbS9mdW5jdGlvbi1lbGVtZW50cydcbmltcG9ydCBEb21GbiBmcm9tICcuLy4uLy4uL2pzL3V0aWxpdGllcy9kb20tZnVuY3Rpb25zJ1xuXG5jb25zdCBLRVkgPSAnb3V0ZXInXG5cbi8vIGluaXRcblxuaWYgKCBEb21EYXRhLmdldEVsZW1zKCBLRVkgKSApIHtcbiAgRG9tRGF0YS5nZXRFbGVtcyggS0VZICkuZm9yRWFjaCggKCBvdXRlckVsZW0gKSA9PiB7XG4gICAgY29uc3QgaW5uZXJFbGVtID0gb3V0ZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoICdbZGF0YS1ic3gtdGc9XCJpbm5lclwiXScgKVxuICAgIG91dGVyRWxlbS5zZXRBdHRyaWJ1dGUoICdkYXRhLXRlc3QnLCAoIERvbUZuLmlzUG9zaXRpb25lZEluc2lkZSggb3V0ZXJFbGVtLCBpbm5lckVsZW0gKSA/ICd0cnVlJyA6ICdmYWxzZScgKSApXG4gICAgaW5uZXJFbGVtLmlubmVySFRNTCA9ICggRG9tRm4uaXNQb3NpdGlvbmVkSW5zaWRlKCBvdXRlckVsZW0sIGlubmVyRWxlbSApID8gJ3RydWUnIDogJ2ZhbHNlJyApXG4gIH0gKVxufSJdfQ==
