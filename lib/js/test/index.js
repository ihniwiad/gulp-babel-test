"use strict";

var _jquery = _interopRequireDefault(require("jquery"));

var _sayHello = require("./say-hello.js");

var _test = _interopRequireDefault(require("./test-01.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log('TEST');
console.log('ES5_UTILS.classes.animatingIn: ' + _test["default"].classes.animatingIn);

_test["default"].$functionElems.addClass(_test["default"].classes.animatingIn); // TEST inner elem positioned inside outer elem
// import DomData from './../dom/dom-data'
// import MakeFnElems from './../dom/function-elements'
// import DomFn from './../utilities/dom-functions'
// const KEY = 'outer'
// // init
// if ( DomData.getElems( KEY ) ) {
//   DomData.getElems( KEY ).forEach( ( outerElem ) => {
//     const innerElem = outerElem.querySelector( '[data-bsx-tg="inner"]' )
//     outerElem.setAttribute( 'data-test', ( DomFn.isPositionedInside( outerElem, innerElem ) ? 'true' : 'false' ) )
//   } )
// }
// /TEST inner elem positioned inside outer elem
// importet function


(0, _sayHello.sayHello)({
  name: 'MyName :)'
}); // jquery test

(0, _jquery["default"])('h1').html('jQuery manipulated');