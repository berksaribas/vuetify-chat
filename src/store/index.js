import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    loading: false,
    error: null,
    onlineUsers: [],
    chats: []
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
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setMessagesEmpty (state) {
      state.messages = []
    },
    setOnlineUsers (state, payload) {
      state.onlineUsers = payload
    },
    setChats (state, payload) {
      state.chats = payload
    }
  },
  actions: {
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            firebase.database().ref('users').child(user.uid).set({
              name: payload.username
            })
              .then(
                message => {
                  commit('setLoading', false)
                  const newUser = {
                    id: user.uid,
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
          user => {
            firebase.database().ref('users').child(user.uid).once('value', function (data) {
              commit('setLoading', false)
              const newUser = {
                id: user.uid,
                username: data.val().name
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
    },
    sendMessage ({commit}, payload) {
      let chatID = payload.chatID
      const message = {
        user: payload.username,
        content: payload.content,
        date: payload.date
      }
      firebase.database().ref('messages').child(chatID).child('messages').push(message)
        .then(
          (data) => {
          }
        )
        .catch(
          (error) => {
            console.log(error)
          }
        )
    },
    loadChats ({commit}) {
      firebase.database().ref('chats').on('value', function (snapshot) {
        commit('setChats', snapshot.val())
      })
    },
    loadOnlineUsers ({commit}) {
      firebase.database().ref('presence').on('value', function (snapshot) {
        let result = []
        result[0] = snapshot.numChildren()
        result[1] = snapshot.val()
        commit('setOnlineUsers', result)
      })
    },
    createChat ({commit}, payload) {
      var newPostKey = firebase.database().ref().child('chats').push().key
      var updates = {}
      updates['/chats/' + newPostKey] = {name: payload.chatName}
      firebase.database().ref().update(updates)
    },
    clearError ({commit}) {
      commit('clearError')
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    messages (state) {
      return state.messages
    },
    onlineUsers (state) {
      return state.onlineUsers
    },
    chats (state) {
      return state.chats
    }
  }
})
