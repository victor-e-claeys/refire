import {
  addArrayChild,
  changeArrayChild,
  moveArrayChild,
  removeArrayChild,
  updateArray,
  updateObject,
  receiveInitialValue
} from '../actions/firebase'

export function dispatchChildAdded(store, localBinding) {
  return (snapshot, previousChildKey) => {
    return store.dispatch(
      addArrayChild(localBinding, snapshot, previousChildKey)
    )
  }
}

export function dispatchChildChanged(store, localBinding) {
  return (snapshot) => {
    return store.dispatch(
      changeArrayChild(localBinding, snapshot)
    )
  }
}

export function dispatchChildMoved(store, localBinding) {
  return (snapshot, previousChildKey) => {
    return store.dispatch(
      moveArrayChild(localBinding, snapshot, previousChildKey)
    )
  }
}

export function dispatchChildRemoved(store, localBinding) {
  return (snapshot) => {
    return store.dispatch(
      removeArrayChild(localBinding, snapshot)
    )
  }
}

export function dispatchArrayUpdated(store, localBinding) {
  return (snapshot) => {
    return store.dispatch(
      updateArray(localBinding, snapshot)
    )
  }
}

export function dispatchObjectUpdated(store, localBinding, snapshot) {
  return store.dispatch(
    updateObject(localBinding, snapshot)
  )
}

export function dispatchInitialValueReceived(store, localBinding) {
  return store.dispatch(receiveInitialValue(localBinding))
}
