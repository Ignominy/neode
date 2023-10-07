"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UnwindStatement = /*#__PURE__*/function () {
  function UnwindStatement() {
    _classCallCheck(this, UnwindStatement);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this._unwind = args;
  }

  _createClass(UnwindStatement, [{
    key: "toString",
    value: function toString() {
      var vars = this._unwind.join(",");

      return "UNWIND ".concat(vars);
    }
  }]);

  return UnwindStatement;
}();

exports["default"] = UnwindStatement;