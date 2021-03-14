"use strict";

var _domData = _interopRequireDefault(require("./../../js/dom/dom-data"));

var _functionElements = _interopRequireDefault(require("./../../js/dom/function-elements"));

var _domFunctions = _interopRequireDefault(require("./../../js/utilities/dom-functions"));

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
      trigger.setAttribute('aria-expanded', 'true'); // DomFn.ariaExpanded( trigger, true )

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