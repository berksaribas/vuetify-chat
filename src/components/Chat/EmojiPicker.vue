<template>
  <div class="emoji-picker" v-if="show">
    <div class="emoji-header">
      Emoji Picker
      <div class="emoji-close" @click="closePicker">Kapat</div>
    </div>
    <div class="emoji-content">
      <emoji v-for="emoji in emojis" :emoji="emoji" @click="onEmojiClick"></emoji>
    </div>
  </div>
</template>

<script>
  import Emoji from './Emoji.vue'

  export default {
    data () {
      return {
        emojis: []
      }
    },
    props: {
      show: true
    },
    created () {
      this.$http.get('https://raw.githubusercontent.com/shanraisshan/EmojiCodeSheet/master/json/string/People.json').then(response => {
        this.emojis = response.body.peoples.people
      }, response => {
        // error callback
      })
    },
    methods: {
      onEmojiClick (emoji) {
        this.$emit('click', emoji)
      },
      closePicker () {
        this.$emit('close')
      }
    },
    components: {
      'emoji': Emoji
    }
  }
</script>

<style>
  .emoji-picker{
    background: white;
    position: absolute;
    bottom: 5rem;
    right: 0;
    width: 200px;
    user-select: none;
  }
  .emoji-picker .emoji-header{
    display: flex;
    padding: 5px;
    box-shadow: 0px 5px 9px 0px rgba(0,0,0,0.15);
  }

  .emoji-picker .emoji-header .emoji-close{
    margin-left: auto;
  }
  .emoji-picker .emoji-content{
    margin-top: 10px;
    overflow-y: auto;
    height: 200px;
  }
  .emoji-picker span{
    cursor: pointer;
    font-size: 25px;
  }
</style>
