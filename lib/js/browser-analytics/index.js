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