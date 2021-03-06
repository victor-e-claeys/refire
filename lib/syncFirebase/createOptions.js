'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = createOptions;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _buildQueryState = require('./buildQueryState');

var _buildQueryState2 = _interopRequireDefault(_buildQueryState);

function createOptions(_ref) {
  var bindings = _ref.bindings;
  var pathParams = _ref.pathParams;
  var state = _ref.state;
  var appName = _ref.appName;

  return Object.keys(bindings).reduce(function (result, localBinding) {

    var paramsState = typeof pathParams === "function" ? pathParams(state) : null;

    var path = typeof bindings[localBinding].path === "function" ? bindings[localBinding].path(state, paramsState) : bindings[localBinding].path;

    if (path) {
      var queryState = typeof bindings[localBinding].query === "function" ? bindings[localBinding].query((0, _buildQueryState2['default'])(), state).getState() : bindings[localBinding].query;

      var firebaseRef = _firebase2['default'].app(appName).database().ref(path);

      var query = bindings[localBinding].query ? bindings[localBinding].query(firebaseRef, state) : firebaseRef;

      var type = bindings[localBinding].populate ? "Array" : bindings[localBinding].type;

      result[localBinding] = _extends({}, bindings[localBinding], {
        path: path,
        query: query,
        queryState: queryState,
        type: type
      });
    }
    return result;
  }, {});
}

module.exports = exports['default'];
//# sourceMappingURL=createOptions.js.map