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