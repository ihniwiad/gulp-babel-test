"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// class BasicFnComponent {
//   constructor( elem ) {
//     if ( ! elem ) {
//        return;
//     }
//     this._elem = elem:
//   }
// }

/*

TODO:

	- add 0...n categories
		- has name, consent, items, 
	- add 1...n items to category
		- has itemName, itemConsent, itemDomElems
	- listen before & after cookies while consent, list all new cookies ?
*/
var DataCategory = /*#__PURE__*/function () {
  function DataCategory(name, consent, items) {
    _classCallCheck(this, DataCategory);

    this.name = name;
    this._consent = consent;
    this._items = items;
  }

  _createClass(DataCategory, [{
    key: "consent",
    get: function get() {
      return this._consent;
    },
    set: function set(cons) {
      this._consent = cons;
    } // Change a property
    // Object.defineProperty(person, "language", {value : "NO"}); 

  }]);

  return DataCategory;
}();

; // class PrivacyManager {
//   constructor( elem ) {
//     if ( ! elem ) {
//        return;
//     }
//     this._elem = elem:
//   }
//   this.addCategory = ( categoryName ) => {
//   }
// };

/*
	privacyData = {
		cats: [
			name: 'analytics',
			consent: null,
			content: [
				{
					name: 'analytics-item-name',
					scriptsSeletors: [],
				}
			],
		],
	};
*/

var _default = DataCategory;
exports["default"] = _default;