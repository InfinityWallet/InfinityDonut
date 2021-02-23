"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBig = isBig;
exports.preparePrice = preparePrice;
exports.sortBalances = sortBalances;
exports.prepareAmount = prepareAmount;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isBig() {
  if (window.innerWidth > 1350) return 4;
  return 2;
}

function preparePrice(price, decimals) {
  var res = new _bignumber.default(price);
  if (isNaN(price)) return "0.00";

  if (decimals == 8) {
    if (Math.abs(res.toNumber()) == 0) {
      return "0.00";
    } else return res.toFormatSpecial(8);
  } else {
    return prepareAmount(price);
  }
}

function sortBalances(balances) {
  return Object.keys(balances).sort(function (a, b) {
    var a_b = balances[a];
    var b_b = balances[b];
    if (a_b > b_b) return -1;else if (a_b < b_b) return 1;
    return 0;
  });
}

function prepareAmount(price) {
  var res = new _bignumber.default(price);

  if (Math.abs(res.toNumber()) == 0) {
    res = "0.00";
  } else if (Math.abs(res.toNumber()) < 0.01) res = res.toFormatSpecial(6);else if (Math.abs(res.toNumber()) < 1) {
    res = res.toFormatSpecial(4);
  } else {
    res = res.toFormatSpecial(2);
  }

  return res;
}

//# sourceMappingURL=utils.js.map