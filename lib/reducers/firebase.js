'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _lodashArrayFindIndex = require('lodash/array/findIndex');

var _lodashArrayFindIndex2 = _interopRequireDefault(_lodashArrayFindIndex);

var _lodashArrayWithout = require('lodash/array/without');

var _lodashArrayWithout2 = _interopRequireDefault(_lodashArrayWithout);

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _helpersCreateReducer = require('../helpers/createReducer');

var _helpersCreateReducer2 = _interopRequireDefault(_helpersCreateReducer);

var _actionsFirebase = require('../actions/firebase');

function indexForKey(array, key) {
  return (0, _lodashArrayFindIndex2['default'])(array, function (element) {
    return element.key === key;
  });
}

function arrayChildAdded(state, action) {
  var _action$payload = action.payload;
  var path = _action$payload.path;
  var value = _action$payload.value;
  var previousChildKey = _action$payload.previousChildKey;

  var newArray = [].concat(_toConsumableArray(state.stores[path].value));
  var insertionIndex = previousChildKey === null ? newArray.length : indexForKey(newArray, previousChildKey) + 1;

  newArray.splice(insertionIndex, 0, value);

  return (0, _updeep2['default'])({ stores: _defineProperty({}, path, { value: newArray }) }, state);
}

function arrayChildChanged(state, action) {
  var _action$payload2 = action.payload;
  var path = _action$payload2.path;
  var key = _action$payload2.key;
  var value = _action$payload2.value;

  var currentValue = state.stores[path] || {};

  // skip update if key isn't present in current array
  if (indexForKey(currentValue.value, key) === -1) {
    return state;
  }

  return _updeep2['default'].updateIn('stores.' + path + '.value.' + indexForKey(currentValue.value, key), value, state);
}

function arrayChildMoved(state, action) {
  var _action$payload3 = action.payload;
  var path = _action$payload3.path;
  var key = _action$payload3.key;
  var previousChildKey = _action$payload3.previousChildKey;

  var newArray = [].concat(_toConsumableArray(state.stores[path].value));
  var currentIndex = indexForKey(newArray, key);
  var record = newArray.splice(currentIndex, 1)[0];

  var insertionIndex = previousChildKey === null ? 0 : indexForKey(newArray, previousChildKey) + 1;

  newArray.splice(insertionIndex, 0, record);

  return (0, _updeep2['default'])({ stores: _defineProperty({}, path, { value: newArray }) }, state);
}

function arrayChildRemoved(state, action) {
  var _action$payload4 = action.payload;
  var path = _action$payload4.path;
  var key = _action$payload4.key;

  var newArray = [].concat(_toConsumableArray(state.stores[path].value));
  newArray.splice(indexForKey(newArray, key), 1);

  return (0, _updeep2['default'])({ stores: _defineProperty({}, path, { value: newArray }) }, state);
}

function valueReplaced(state, action) {
  var _action$payload5 = action.payload;
  var path = _action$payload5.path;
  var value = _action$payload5.value;

  return (0, _updeep2['default'])({ stores: _defineProperty({}, path, value) }, state);
}

function objectReplaced(state, action) {
  var _action$payload6 = action.payload;
  var path = _action$payload6.path;
  var value = _action$payload6.value;

  // TODO:
  // investigate why firebase's .val() doesn't return new reference for object when nested object's key has been deleted
  return _extends({}, state, {
    stores: _extends({}, state.stores, _defineProperty({}, path, value))
  });
}

function initialValueReceived(state, action) {
  var path = action.payload.path;

  return (0, _updeep2['default'])({ initialValuesReceived: function initialValuesReceived(values) {
      return [].concat(_toConsumableArray(values), [path]);
    } }, state);
}

function initialFetchDone(state) {
  return (0, _updeep2['default'])({ initialFetchDone: true }, state);
}

function connected(state) {
  return (0, _updeep2['default'])({ connected: true }, state);
}

function userAuthenticated(state, action) {
  return (0, _updeep2['default'])({ authenticatedUser: action.payload }, state);
}

function userUnauthenticated(state) {
  return (0, _updeep2['default'])({ authenticatedUser: null }, state);
}

function configUpdated(state, action) {
  var name = action.payload.name;

  return (0, _updeep2['default'])({ name: name }, state);
}

function updateError(state, action) {
  var _action$payload7 = action.payload;
  var field = _action$payload7.field;
  var error = _action$payload7.error;

  return (0, _updeep2['default'])({ errors: _defineProperty({}, field, error) }, state);
}

function updateProcessing(state, action) {
  var _action$payload8 = action.payload;
  var field = _action$payload8.field;
  var value = _action$payload8.value;

  return (0, _updeep2['default'])({ processing: _defineProperty({}, field, value) }, state);
}

function updateCompleted(state, action) {
  var _action$payload9 = action.payload;
  var field = _action$payload9.field;
  var value = _action$payload9.value;

  return (0, _updeep2['default'])({ completed: _defineProperty({}, field, value) }, state);
}

function updateWriteProcessing(state, action) {
  var _action$payload10 = action.payload;
  var path = _action$payload10.path;
  var id = _action$payload10.id;
  var value = _action$payload10.value;

  var currentValue = state.writes.processing[path] || [];
  var newValue = value ? [].concat(_toConsumableArray(currentValue), [id]) : (0, _lodashArrayWithout2['default'])(currentValue, id);

  return (0, _updeep2['default'])({ writes: { processing: _defineProperty({}, path, newValue) } }, state);
}

function updateWriteErrors(state, action) {
  var _action$payload11 = action.payload;
  var path = _action$payload11.path;
  var error = _action$payload11.error;

  var currentValue = state.writes.errors[path] || [];
  var newValue = error ? [].concat(_toConsumableArray(currentValue), [error]) : [];

  return (0, _updeep2['default'])({ writes: { errors: _defineProperty({}, path, newValue) } }, state);
}

exports['default'] = function (bindings) {
  var _createReducer;

  var initialStores = Object.keys(bindings).reduce(function (obj, path) {
    obj[path] = null;
    return obj;
  }, {});

  var initialState = {
    authenticatedUser: null,
    connected: false,
    initialFetchDone: false,
    initialValuesReceived: [],
    stores: initialStores,
    name: null,
    errors: {
      permissions: null,
      login: null,
      createUser: null,
      resetPassword: null
    },
    processing: {
      login: false,
      createUser: false,
      resetPassword: false
    },
    completed: {
      login: false,
      createUser: false,
      resetPassword: false
    },
    writes: {
      processing: {},
      errors: {}
    }
  };

  return (0, _helpersCreateReducer2['default'])(initialState, (_createReducer = {}, _defineProperty(_createReducer, _actionsFirebase.ARRAY_CHILD_ADDED, arrayChildAdded), _defineProperty(_createReducer, _actionsFirebase.ARRAY_CHILD_CHANGED, arrayChildChanged), _defineProperty(_createReducer, _actionsFirebase.ARRAY_CHILD_MOVED, arrayChildMoved), _defineProperty(_createReducer, _actionsFirebase.ARRAY_CHILD_REMOVED, arrayChildRemoved), _defineProperty(_createReducer, _actionsFirebase.ARRAY_UPDATED, valueReplaced), _defineProperty(_createReducer, _actionsFirebase.OBJECT_UPDATED, objectReplaced), _defineProperty(_createReducer, _actionsFirebase.VALUE_REPLACED, valueReplaced), _defineProperty(_createReducer, _actionsFirebase.INITIAL_VALUE_RECEIVED, initialValueReceived), _defineProperty(_createReducer, _actionsFirebase.INITIAL_FETCH_DONE, initialFetchDone), _defineProperty(_createReducer, _actionsFirebase.CONNECTED, connected), _defineProperty(_createReducer, _actionsFirebase.USER_AUTHENTICATED, userAuthenticated), _defineProperty(_createReducer, _actionsFirebase.USER_UNAUTHENTICATED, userUnauthenticated), _defineProperty(_createReducer, _actionsFirebase.CONFIG_UPDATED, configUpdated), _defineProperty(_createReducer, _actionsFirebase.ERROR_UPDATED, updateError), _defineProperty(_createReducer, _actionsFirebase.PROCESSING_UPDATED, updateProcessing), _defineProperty(_createReducer, _actionsFirebase.COMPLETED_UPDATED, updateCompleted), _defineProperty(_createReducer, _actionsFirebase.WRITE_PROCESSING_UPDATED, updateWriteProcessing), _defineProperty(_createReducer, _actionsFirebase.WRITE_ERRORS_UPDATED, updateWriteErrors), _createReducer));
};

module.exports = exports['default'];
//# sourceMappingURL=firebase.js.map