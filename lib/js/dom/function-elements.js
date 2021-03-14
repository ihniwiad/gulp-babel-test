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