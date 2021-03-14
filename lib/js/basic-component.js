"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _domData = _interopRequireDefault(require("./dom/dom-data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var VERSION = '0.0.1';

var BasicComponent = /*#__PURE__*/function () {
  function BasicComponent(element) {
    _classCallCheck(this, BasicComponent);

    if (!element) {
      return;
    }

    this._element = element;
    Data.setData(element, this.constructor.DATA_KEY, this);
  }

  _createClass(BasicComponent, [{
    key: "dispose",
    value: function dispose() {
      Data.removeData(this._element, this.constructor.DATA_KEY);
      this._element = null;
    }
    /** Static */

  }], [{
    key: "getInstance",
    value: function getInstance(element) {
      return Data.getData(element, this.DATA_KEY);
    }
  }, {
    key: "VERSION",
    get: function get() {
      return VERSION;
    }
  }]);

  return BasicComponent;
}();

var _default = BasicComponent;
exports["default"] = _default;