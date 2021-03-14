"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _selectors = _interopRequireDefault(require("./../utilities/selectors"));

var _classNames = _interopRequireDefault(require("./../utilities/class-names"));

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
  // innerElem has to be positiones absolute in outerElem relative to outerElem
  var outerElemStyle = getComputedStyle(outerElem);
  return innerElem.offsetLeft + parseInt(outerElemStyle.borderLeftWidth) >= 0 && innerElem.offsetLeft + parseInt(outerElemStyle.borderLeftWidth) + innerElem.offsetWidth <= outerElem.offsetWidth && innerElem.offsetTop + parseInt(outerElemStyle.borderTopWidth) >= 0 && innerElem.offsetTop + parseInt(outerElemStyle.borderTopWidth) + innerElem.offsetHeight <= outerElem.offsetHeight;
}; // add animating class name, remove after transition finished


var setRemoveAnimationClassName = function setRemoveAnimationClassName(elem, animatingClassName) {
  var ANIMATING_CLASS_NAME = typeof animatingClassName != 'undefined' ? animatingClassName : _classNames["default"].animating;
  var TRANSITION_DURATION = getTransitionDuration(elem);

  if (transitionDuration > 0) {
    addClassNames(elem, ANIMATING_CLASS_NAME);
    setTimeout(function () {
      removeClassNames(elem, ANIMATING_CLASS_NAME);
    }, TRANSITION_DURATION);
  }
}; // convert type (e.g. make true from 'true')


var convertType = function convertType(value) {
  try {
    value = JSON.parse(value);
    return value;
  } catch (e) {
    // 'value' is not a json string
    return value;
  }
}; // aria expanded – gets or sets aria-expanded


var ariaExpanded = function ariaExpanded(elem, value) {
  if (typeof value !== 'undefined') {
    elem.setAttribute('aria-expanded', value);
    return value;
  }

  return convertType(elem.getAttribute('aria-expanded'));
};

var DomFn = {
  addClassNames: addClassNames,
  convertType: convertType,
  getConfigFromAttr: getConfigFromAttr,
  getTargetByAriaControls: getTargetByAriaControls,
  getTransitionDuration: getTransitionDuration,
  getTriggerFromEvent: getTriggerFromEvent,
  isPositionedInside: isPositionedInside,
  removeClassNames: removeClassNames,
  setRemoveAnimationClassName: setRemoveAnimationClassName,
  triggerEvent: triggerEvent
};
var _default = DomFn;
exports["default"] = _default;