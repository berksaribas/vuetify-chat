<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col sm="6" xs="12" offset-sm="3">
        <form @submit.prevent="createChat">
          <v-col xs="12">
            <v-text-field
              name="chatname"
              label="Chat Name"
              id="chatname"
              v-model="chatName"
              type="text"
              required></v-text-field>
            <v-btn type="submit">Create</v-btn>
          </v-col>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import * as firebase from 'firebase'

  export default {
    data () {
      return {
        chatName: '',
        loading: false
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
    },
    methods: {
      createChat () {
        if (this.chatName == '' || this.loading) {
          return
        }

        this.loading = true

        let time = new Date().valueOf()
        let newPostKey = firebase.database().ref().child('chats').push().key

        let updates = {}
        updates['/chats/' + newPostKey] = {name: this.chatName}
        updates['/chat_members/' + newPostKey + '/users/' + this.user.id] = {timestamp: time}
        updates['users/' + this.user.id + '/chats/' + newPostKey] = {timestamp: time}
        firebase.database().ref().update(updates).then(() => {
          this.loading = false
          this.$router.push('/chat/' + newPostKey)
        })
      }
    }
  }
</script>
