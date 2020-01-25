import * as firebase from 'firebase'

const AuthModule = {
  state: {
    user: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
      const userListRef = firebase.database().ref('presence')
      const myUserRef = userListRef.push()

      firebase.database().ref('.info/connected')
        .on(
          'value', function (snap) {
            if (snap.val()) {
              // if we lose network then remove this user from the list
              myUserRef.onDisconnect()
                .remove()
              // set user's online status
              let presenceObject = {user: payload, status: 'online'}
              myUserRef.set(presenceObject)
            } else {
              // client has lost network
              let presenceObject = {user: payload, status: 'offline'}
              myUserRef.set(presenceObject)
            }
          }
        )
    }
  },
  actions: {
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          auth => {
            firebase.database().ref('users').child(auth.user.uid).set({
              name: payload.username
            })
              .then(
                message => {
                  commit('setLoading', false)
                  const newUser = {
                    id: auth.user.uid,
                    username: payload.username
                  }
                  commit('setUser', newUser)
                }
              )
              .catch(
                error => {
                  commit('setLoading', false)
                  commit('setError', error)
                }
              )
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          auth => {
            firebase.database().ref('users').child(auth.user.uid).once('value', function (data) {
              commit('setLoading', false)
              const newUser = {
                id: auth.user.uid,
                username: auth.user.email
              }
              commit('setUser', newUser)
            })
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
          }
        )
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}

export default AuthModule
