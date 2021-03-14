"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sayHello = sayHello;

function sayHello(params) {
  var name = params.name; // console.log( `Hello from importet function ${ name ? name : 'unknown' }` );

  console.log("Hello ".concat(name));
}