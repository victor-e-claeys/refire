import {
  dispatchChildAdded,
  dispatchChildChanged,
  dispatchChildMoved,
  dispatchChildRemoved,
  dispatchArrayUpdated,
  dispatchObjectUpdated,
  dispatchInitialValueReceived
} from './dispatch'

export default function subscribe(localBinding, bindOptions, options) {
  const {type, query, populate} = bindOptions
  const {store, onCancel} = options
  const listeners = {}
  const populated = {}

  if (type === "Array") {
    let initialValueReceived = false

    const populateChild = (key) => {
      return new Promise(resolve => {
        const ref = query.root().child(populate(key))
        ref.once('value', function(snapshot) {
          return resolve([key, ref, snapshot.val()])
        }, function() {
          return resolve([key, ref, null])
        })
      })
    }

    // only listen child_added for arrays after initial fetch is done
    const onChildAdded = (snapshot, previousChildKey) => {
      if (initialValueReceived) {
        if (populate) {
          const ref = query.root().child(populate(snapshot.key()))
          ref.once('value', function(populatedSnapshot) {
            dispatchChildAdded(store, localBinding)(snapshot.key(), populatedSnapshot.val(), previousChildKey)
            populated[snapshot.key()] = {
              ref: ref,
              listener: ref.on('value', function(populatedSnapshot) {
                dispatchChildChanged(store, localBinding)(snapshot.key(), populatedSnapshot.val())
              })
            }
          })
        } else {
          dispatchChildAdded(store, localBinding)(snapshot.key(), snapshot.val(), previousChildKey)
        }
      }
    }

    const onceValue = (snapshot) => {
      if (populate) {
        const populateRefs = {}
        Promise.all(
          Object.keys(snapshot.val() || {}).map(populateChild)
        ).then(resolved => {
          const result = {}
          resolved.forEach(arr => {
            const [key, ref, value] = arr
            result[key] = value
            populateRefs[key] = ref
          })
          return result
        }).then(populated => {
          dispatchArrayUpdated(store, localBinding)(snapshot.key(), populated)
          dispatchInitialValueReceived(store, localBinding)
          initialValueReceived = true

          Object.keys(populateRefs).forEach(key => {
            const ref = populateRefs[key]
            populated[key] = {
              ref: ref,
              listener: ref.on('value', function(populatedSnapshot) {
                dispatchChildChanged(store, localBinding)(key, populatedSnapshot.val())
              })
            }
          })
        })
      } else {
        dispatchArrayUpdated(store, localBinding)(snapshot.key(), snapshot.val())
        dispatchInitialValueReceived(store, localBinding)
        initialValueReceived = true
      }
    }

    const onChildChanged = (snapshot) => {
      dispatchChildChanged(store, localBinding)(snapshot.key(), snapshot.val())
    }

    const onChildRemoved = (snapshot) => {
      dispatchChildRemoved(store, localBinding)(snapshot)
      const key = snapshot.key()
      if (populated[key]) {
        populated[key].ref.off('value', populated[key].listener)
        delete populated[key]
      }
    }

    listeners.child_added = query.on('child_added', onChildAdded, onCancel)
    listeners.child_changed = query.on('child_changed', onChildChanged, onCancel)
    listeners.child_moved = query.on('child_moved', dispatchChildMoved(store, localBinding), onCancel)
    listeners.child_removed = query.on('child_removed', onChildRemoved, onCancel)

    // listen for array value once to prevent multiple updates on initial items
    query.once('value', onceValue, onCancel)
  } else {
    listeners.value = query.on('value', (snapshot) => {
      dispatchObjectUpdated(store, localBinding, snapshot)
      dispatchInitialValueReceived(store, localBinding)
    }, onCancel)
  }

  return {
    ref: query.ref(),
    listeners: listeners,
    populated: populated
  }
}