<template>
  <v-list subheader>
    <v-subheader>Your Chats</v-subheader>
    <v-list-item avatar v-for="(chat, index) in chats" v-bind:key="chat.name" :to="/chat/ + index">
      <v-list-item-content>
        <v-list-item-title v-html="chat.name"></v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-icon>mdi-chat</v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
  export default{
    created () {
      this.$store.dispatch('loadChats')
    },
    computed: {
      chats () {
        return this.$store.getters.chats
      }
    }
  }
</script>
