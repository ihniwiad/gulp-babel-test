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