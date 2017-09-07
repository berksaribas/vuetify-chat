<template>
  <v-layout row>
    <v-flex xs12 sm12>
      <div class="chat-container">
        <message :messages="messages" @imageLoad="scrollToEnd"></message>
      </div>
      <emoji-picker :show="emojiPanel" @close="toggleEmojiPanel" @click="addMessage"></emoji-picker>
      <div class="typer">
        <input type="text" placeholder="İletinizi buraya yazın" v-on:keyup.enter="sendMessage" v-model="content">
        <v-btn icon class="blue--text emoji-panel" @click="toggleEmojiPanel">
          <v-icon>mood</v-icon>
        </v-btn>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
  import Message from './Message.vue'
  import EmojiPicker from './EmojiPicker.vue'
  import * as firebase from 'firebase'

  export default {
    data () {
      return {
        content: '',
        chatMessages: [],
        emojiPanel: false
      }
    },
    props: [
      'id'
    ],
    mounted () {
      let chatID = this.id
      let that = this
      console.log(chatID)
      firebase.database().ref('messages').child(chatID).child('messages').limitToLast(20).on('child_added', function (snapshot) {
        let message = snapshot.val()
        /*eslint-disable */
        var urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
        /*eslint-enable */
        message.content = message.content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
        message.content = message.content.replace(urlPattern, "<a href='$1'>$1</a>")
        that.chatMessages.push(that.processMessage(message))
      })
      this.$store.dispatch('loadOnlineUsers')
    },
    components: {
      'message': Message,
      'emoji-picker': EmojiPicker
    },
    computed: {
      messages () {
        return this.chatMessages
      },
      username () {
        return this.$store.getters.user.username
      }
    },
    watch: {
      'messages': function (value) {
        this.$nextTick(() => {
          this.scrollToEnd()
        })
      }
    },
    methods: {
      processMessage (message) {
        /*eslint-disable */
        var imageRegex = /([^\s\']+).(?:jpg|jpeg|gif|png)/i
        /*eslint-enable */
        if (imageRegex.test(message.content)) {
          message.image = imageRegex.exec(message.content)[0]
        }
        var emojiRegex = /([\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{2934}-\u{1f18e}])/gu
        if (emojiRegex.test(message.content)) {
          message.content = message.content.replace(emojiRegex, '<span class="emoji">$1</span>')
        }
        return message
      },
      sendMessage () {
        if (this.content !== '') {
          this.$store.dispatch('sendMessage', { username: this.username, content: this.content, date: new Date().toString(), chatID: this.id })
          this.content = ''
        }
      },
      scrollToEnd () {
        var container = this.$el.querySelector('.chat-container')
        container.scrollTop = container.scrollHeight
      },
      addMessage (emoji) {
        this.content += emoji.value
      },
      toggleEmojiPanel () {
        this.emojiPanel = !this.emojiPanel
      }
    }
  }
</script>

<style>
  .typer{
    position: absolute;
    display: flex;
    align-items: center;
    bottom: 0;
    height: 5rem;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 -5px 10px -5px rgba(0,0,0,.2);
  }
  .typer .emoji-panel{
    margin-left: auto;
  }
  .typer input[type=text]{
    position: absolute;
    left: 2rem;
    padding: 1rem;
    width: 80%;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1.25rem;
  }
  .chat-container{
    box-sizing: border-box;
    height: calc(100vh - 9.5rem);
    overflow-y: auto;
    padding: 10px;
    background-color: #f2f2f2;
  }
  .message.own{
    text-align: right;
  }
  .message.own .content{
    background-color: lightskyblue;
  }
  .chat-container .username{
    font-size: 18px;
    font-weight: bold;
  }
  .chat-container .content{
    padding: 8px;
    background-color: lightgreen;
    border-radius: 10px;
    display:inline-block;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12);
    max-width: 50%;
    word-wrap: break-word;
    }
  @media (max-width: 480px) {
    .chat-container .content{
      max-width: 60%;
    }
  }

</style>
