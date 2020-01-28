import * as firebase from 'firebase'

const ChatModule = {
  state: {
    chats: {}
  },
  mutations: {
    setChats (state, payload) {
      payload["0"] = {name: "Default"}
      state.chats = payload
    }
  },
  actions: {
    sendMessage (context, payload) {
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
    loadUserChats (context) {
      let user = context.getters.user
      firebase.database().ref('users').child(user.id).child('chats').orderByChild("timestamp").once("value", function(snapshot) {
        let chats = snapshot.val()
        if(chats == null) {
          chats = {}
        }

        for(let chatId in chats) {
          chats[chatId].name = "Loading..."
          firebase.database().ref('chats').child(chatId).once('value', function (snapshot) {
            chats[chatId].name = snapshot.val().name
            context.commit('setChats', chats)
          })
        }
      })
    }
  },
  getters: {
    chats (state) {
      return state.chats
    }
  }
}

export default ChatModule
